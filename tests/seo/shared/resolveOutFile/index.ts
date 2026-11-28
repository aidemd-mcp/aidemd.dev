import path from 'node:path';
import outDir from '../outDir';

/**
 * The file under `out/` a URL or root-relative path is served from: a path
 * ending in `/` maps to its `index.html`, anything else maps to itself.
 * Query and hash are ignored.
 */
export default function resolveOutFile(href: string): string {
  const pathname = decodeURIComponent(new URL(href, 'https://aidemd.dev').pathname);
  const relative = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  return path.join(outDir, relative);
}
