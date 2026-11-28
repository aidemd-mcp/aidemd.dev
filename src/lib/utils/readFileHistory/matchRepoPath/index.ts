import type { HistoryCommit } from '@/types/fileHistory';

/**
 * Returns the path as git spells it. The registry reads names from disk, so the
 * case nearly always matches; the fallback covers a caller on a case-insensitive
 * file system (Windows, macOS) that spelled a path differently, which
 * `git log -- <path>` also matched there. An exact match wins; otherwise, with
 * `ignoreCase`, the one history path differing only by letter case is returned.
 * Zero or several such paths leave `repoPath` unchanged: two spellings are never
 * guessed between.
 */
export default function matchRepoPath({
  repoPath,
  commits,
  ignoreCase,
}: {
  repoPath: string;
  commits: readonly HistoryCommit[];
  ignoreCase: boolean;
}): string {
  const historyPaths = new Set<string>();
  for (const commit of commits) {
    for (const change of commit.changes) {
      historyPaths.add(change.path);
      if (change.fromPath !== undefined) historyPaths.add(change.fromPath);
    }
  }

  if (historyPaths.has(repoPath)) return repoPath;
  if (!ignoreCase) return repoPath;

  const wanted = repoPath.toLowerCase();
  const spellings = [...historyPaths].filter((historyPath) => historyPath.toLowerCase() === wanted);
  return spellings.length === 1 ? spellings[0] : repoPath;
}
