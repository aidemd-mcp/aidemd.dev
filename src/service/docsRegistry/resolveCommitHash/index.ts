import { execSync } from 'node:child_process';

/** In-process cache so each absPath is shelled out to git at most once per build. */
const cache = new Map<string, string>();

/**
 * Resolves the short commit hash of the last git commit that touched absPath.
 * Returns 'uncommitted' when the file has never been committed (empty stdout).
 * Results are memoized in a module-level Map so repeated calls for the same
 * path within a single build are free.
 */
export default function resolveCommitHash(absPath: string): string {
  const cached = cache.get(absPath);
  if (cached !== undefined) return cached;

  try {
    const hash = execSync(
      `git log -1 --format=%h -- ${JSON.stringify(absPath)}`,
      { encoding: 'utf8' },
    ).trim();

    const result = hash.length > 0 ? hash : 'uncommitted';
    cache.set(absPath, result);
    return result;
  } catch {
    // git is not available or the path is outside a git repo.
    cache.set(absPath, 'uncommitted');
    return 'uncommitted';
  }
}
