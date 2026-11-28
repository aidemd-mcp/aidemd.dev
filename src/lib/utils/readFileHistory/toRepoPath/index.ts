import path from 'node:path';

/**
 * Turns an absolute file path into the repository-relative path git records,
 * with `/` separators. `node:path` for the running platform does the work: on
 * Windows it ignores drive-letter case and accepts both separator styles, and
 * `repoRoot` as `git rev-parse --show-toplevel` prints it (`D:/Code/repo`) is
 * normalized by `path.resolve`. Throws for a path outside the repository, on
 * another drive, or the root itself, since none of them is a file git tracks.
 */
export default function toRepoPath({ absPath, repoRoot }: { absPath: string; repoRoot: string }): string {
  const relative = path.relative(path.resolve(repoRoot), path.resolve(absPath));
  const repoPath = relative.replaceAll('\\', '/');

  const outside = repoPath === '' || repoPath === '..' || repoPath.startsWith('../') || path.isAbsolute(relative);
  if (outside) {
    throw new Error(`readFileHistory: ${absPath} is not a file inside the repository at ${repoRoot}`);
  }
  return repoPath;
}
