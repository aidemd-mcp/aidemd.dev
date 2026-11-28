import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const NUL = Buffer.from([0]);

let cachedHash: string | undefined;

/** Lists every file under `directory` as a forward-slash path relative to `root`. */
function listFiles({ root, directory }: { root: string; directory: string }): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles({ root, directory: absolute });
    return [path.relative(root, absolute).split(path.sep).join('/')];
  });
}

/**
 * Fingerprints the share-card design source: the sha256 of every file under
 * `design/` (relative path, NUL, bytes, NUL, in sorted path order). Any change
 * to the layout, fonts or mascot image changes the hash, so every page card
 * gets a new address that scrapers have not cached. Anchored on
 * `process.cwd()` because the Next build rewrites `import.meta.url`; every
 * caller runs from the project root. Memoized after the first call.
 */
export default function hashDesignSource(): string {
  if (cachedHash !== undefined) return cachedHash;

  const root = path.join(process.cwd(), 'src', 'service', 'socialShare', 'design');
  const hash = createHash('sha256');
  for (const relativePath of listFiles({ root, directory: root }).sort()) {
    hash.update(Buffer.from(relativePath, 'utf8'));
    hash.update(NUL);
    hash.update(readFileSync(path.join(root, relativePath)));
    hash.update(NUL);
  }

  cachedHash = hash.digest('hex');
  return cachedHash;
}
