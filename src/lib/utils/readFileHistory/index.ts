import type { FileHistory, HistoryCommit } from '@/types/fileHistory';
import findFileHistory from './findFileHistory';
import matchRepoPath from './matchRepoPath';
import parseGitLog from './parseGitLog';
import runGit from './runGit';
import toRepoPath from './toRepoPath';

/**
 * The one history read, as arguments to git:
 * - `-z` prints paths raw, never quoted or escaped;
 * - `--root` lists the first commit's files as added;
 * - `-M` detects renames whatever the user's git config says;
 * - `--diff-merges=off` makes merge commits list no files (a merge only brings
 *   in changes its own commits already record);
 * - `--name-status` prints the change letter per file;
 * - the format is a record separator, the short hash, a unit separator and the
 *   author date (ISO 8601), separators that cannot appear in a path.
 * No `-C`: copies are deliberately counted as adds and not followed. The old
 * `git log --follow` did follow copies, which could date a file from an
 * unrelated similar file (decision #47).
 * Order is git's default, newest first.
 */
const HISTORY_LOG_ARGS = [
  'log',
  '-z',
  '--root',
  '-M',
  '--diff-merges=off',
  '--name-status',
  '--format=%x1e%h%x1f%aI',
] as const;

const CASE_INSENSITIVE_PLATFORMS = ['win32', 'darwin'];

let loaded: { repoRoot: string; commits: HistoryCommit[] } | undefined;
const answers = new Map<string, FileHistory>();

function loadHistory(): { repoRoot: string; commits: HistoryCommit[] } {
  const repoRoot = runGit(['rev-parse', '--show-toplevel']).trim();
  const commits = parseGitLog(runGit(HISTORY_LOG_ARGS));
  return { repoRoot, commits };
}

/**
 * Answers what the repository's version history says about one file: when it
 * was first added (following renames back), when it last changed and the short
 * id of the commit that last touched it.
 *
 * The history is read from git once per process and parsed in memory; every
 * file after the first is answered from that read, and each path's answer is
 * remembered. A file with no history gets `{}`, never empty strings.
 *
 * Throws, with the `readFileHistory:` prefix, when git cannot be run or its
 * output is unreadable, and when `absPath` is outside the repository. A failed
 * read is not remembered, so every caller sees the failure. The reader does
 * not judge whether the history is complete (a shallow clone is the caller's
 * to detect).
 */
export default function readFileHistory(absPath: string): FileHistory {
  const remembered = answers.get(absPath);
  if (remembered) return remembered;

  loaded ??= loadHistory();
  const { repoRoot, commits } = loaded;

  const repoPath = toRepoPath({ absPath, repoRoot });
  const gitPath = matchRepoPath({
    repoPath,
    commits,
    ignoreCase: CASE_INSENSITIVE_PLATFORMS.includes(process.platform),
  });
  const fileHistory = findFileHistory({ commits, repoPath: gitPath });

  answers.set(absPath, fileHistory);
  return fileHistory;
}
