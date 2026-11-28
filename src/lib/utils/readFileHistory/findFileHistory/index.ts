import type { FileHistory, HistoryChange, HistoryCommit } from '@/types/fileHistory';

/** True when the change touched the file: it is the change's path, or the file was renamed away (a copy leaves its source unchanged). */
function touchesPath({ change, repoPath }: { change: HistoryChange; repoPath: string }): boolean {
  if (change.path === repoPath) return true;
  return change.status === 'R' && change.fromPath === repoPath;
}

/**
 * Walks commits newest to oldest following the file back through renames. Changes
 * in a commit are compared against the name the commit was reached with; the name
 * switches only after the commit. Older adds overwrite newer ones, so the oldest wins.
 */
function findFirstAdded({ commits, repoPath }: { commits: readonly HistoryCommit[]; repoPath: string }): string | undefined {
  let name = repoPath;
  let firstAdded: string | undefined;
  for (const commit of commits) {
    let nextName = name;
    for (const change of commit.changes) {
      if (change.path !== name) continue;
      if (change.status === 'A' || change.status === 'C') firstAdded = commit.date;
      if (change.status === 'R' && change.fromPath !== undefined) nextName = change.fromPath;
    }
    name = nextName;
  }
  return firstAdded;
}

/**
 * Answers what history says about one file from commits already parsed, newest
 * first. `lastChanged` and `lastCommit` come from the newest commit touching the
 * path (a rename away counts, a copy of it does not), matching
 * `git log -1 --format=%aI -- <path>` and `git log -1 --format=%h -- <path>`.
 * `firstAdded` is the oldest add found following renames back, matching the
 * oldest line of `git log --follow --diff-filter=A --format=%aI -- <path>`; a copy
 * counts as an add of its new path and is not followed to its source. Each field
 * is set only when found; a path no commit touches returns `{}`.
 */
export default function findFileHistory({
  commits,
  repoPath,
}: {
  commits: readonly HistoryCommit[];
  repoPath: string;
}): FileHistory {
  const fileHistory: FileHistory = {};

  const newest = commits.find((commit) => commit.changes.some((change) => touchesPath({ change, repoPath })));
  if (newest) {
    fileHistory.lastChanged = newest.date;
    fileHistory.lastCommit = newest.hash;
  }

  const firstAdded = findFirstAdded({ commits, repoPath });
  if (firstAdded !== undefined) fileHistory.firstAdded = firstAdded;

  return fileHistory;
}
