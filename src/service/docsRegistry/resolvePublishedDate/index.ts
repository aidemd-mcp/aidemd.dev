import { execSync } from 'node:child_process';

/** In-process cache so each absPath is shelled out to git at most once per build. */
const cache = new Map<string, string>();

/**
 * Resolves the ISO 8601 author-date of the first git commit that introduced
 * absPath (i.e., the commit that added the file). This is used as the
 * "published" date for docs whose frontmatter does not carry an explicit
 * `published:` field.
 *
 * Uses `--diff-filter=A` to select only the Add commit for the file, and
 * `--format=%aI` for the strict ISO 8601 author-date with timezone offset.
 *
 * Returns '' when the file has never been committed or git is unavailable —
 * the caller falls back to a dash in that case.
 *
 * Results are memoized in a module-level Map so repeated calls for the same
 * path within a single build are free.
 */
export default function resolvePublishedDate(absPath: string): string {
  const cached = cache.get(absPath);
  if (cached !== undefined) return cached;

  try {
    const date = execSync(
      `git log --diff-filter=A --format=%aI -- ${JSON.stringify(absPath)}`,
      { encoding: 'utf8' },
    ).trim();

    cache.set(absPath, date);
    return date;
  } catch {
    // git is not available or the path is outside a git repo.
    cache.set(absPath, '');
    return '';
  }
}
