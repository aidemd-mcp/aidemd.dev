import { execSync } from 'node:child_process';
import readFileHistory from '@/lib/utils/readFileHistory';
import type { FileHistory } from '@/types/fileHistory';
import type { PageDates } from '@/types/sitePage';

const SHALLOW_MESSAGE =
  'resolveGitDates: the repository is a shallow clone, so version-history dates would be wrong. Fetch full history (actions/checkout with fetch-depth: 0, or git fetch --unshallow) and rebuild.';

/** Set once the repository has been proven to have full history in this process. */
let historyVerified = false;

/** Per-process answers so every surface in one build reads identical dates. */
const cache = new Map<string, PageDates>();

/** Runs the shallow-history check's git command for absPath and returns its trimmed stdout; a failure is rethrown with the path named. */
function runGit(command: string, absPath: string): string {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`resolveGitDates: git failed for ${absPath}: ${reason}`);
  }
}

/** Stops the build when the repository is a shallow clone; checked once per process. */
function assertFullHistory(absPath: string): void {
  if (historyVerified) return;
  if (runGit('git rev-parse --is-shallow-repository', absPath) === 'true') {
    throw new Error(SHALLOW_MESSAGE);
  }
  historyVerified = true;
}

/**
 * The single source of page dates. `published` is the author date of the
 * file's first commit (following renames); `modified` is the author date of
 * its last commit. Both are ISO 8601 with offset and come only from version
 * history, read from the one history read per build, via readFileHistory.
 *
 * Throws, with a message starting `resolveGitDates:`, when the repository is a
 * shallow clone (history would be wrong) or when any git call fails. A file
 * with no commits yet returns `{}`: an absent field means "not provable",
 * never an empty string or a guessed date. Results are memoized per absPath.
 */
export default function resolveGitDates(absPath: string): PageDates {
  assertFullHistory(absPath);

  const cached = cache.get(absPath);
  if (cached) return cached;

  let history: FileHistory;
  try {
    history = readFileHistory(absPath);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`resolveGitDates: git failed for ${absPath}: ${reason}`);
  }

  const dates: PageDates = {
    ...(history.firstAdded ? { published: history.firstAdded } : {}),
    ...(history.lastChanged ? { modified: history.lastChanged } : {}),
  };
  cache.set(absPath, dates);
  return dates;
}
