import readFileHistory from '@/lib/utils/readFileHistory';

/** In-process cache so each absPath is answered at most once per build. */
const cache = new Map<string, string>();

/**
 * Resolves the short commit hash of the last git commit that touched absPath.
 * Returns 'uncommitted' when the file has never been committed (no history).
 *
 * The hash comes from the shared history read, which runs once per build and
 * answers every path from memory, not from a git call per file. Results are
 * memoized in a module-level Map so repeated calls for the same path within a
 * single build are free.
 */
export default function resolveCommitHash(absPath: string): string {
  const cached = cache.get(absPath);
  if (cached !== undefined) return cached;

  try {
    const result = readFileHistory(absPath).lastCommit ?? 'uncommitted';
    cache.set(absPath, result);
    return result;
  } catch {
    // readFileHistory throws when git cannot be run or the path is outside the
    // repository. The marker stands in for a commit; a broken history still
    // stops the build, because hydrateRoute calls resolveGitDates first.
    cache.set(absPath, 'uncommitted');
    return 'uncommitted';
  }
}
