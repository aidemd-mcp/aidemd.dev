import fs from 'node:fs';
import path from 'node:path';
import outDir from '../outDir';

function collectPagePaths(dir: string, urlPath: string, found: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('_') || (urlPath === '/' && entry.name === '404')) continue;
      collectPagePaths(path.join(dir, entry.name), `${urlPath}${entry.name}/`, found);
    } else if (entry.name === 'index.html') {
      found.push(urlPath);
    }
  }
}

/**
 * Every built page as a URL path with a trailing slash: each `out/**\/index.html`
 * except `out/404/`.
 */
export default function listBuiltPages(): string[] {
  if (!fs.existsSync(outDir)) {
    throw new Error('run npm run build first');
  }
  const found: string[] = [];
  collectPagePaths(outDir, '/', found);
  return found.sort();
}
