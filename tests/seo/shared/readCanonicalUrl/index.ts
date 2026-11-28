import fs from 'node:fs';
import resolveOutFile from '../resolveOutFile';

/** The `href` of the one `link[rel=canonical]` in a built page's HTML file; throws when there is not exactly one. */
export default function readCanonicalUrl(urlPath: string): string {
  const html = fs.readFileSync(resolveOutFile(urlPath), 'utf8');
  const matches = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)];
  if (matches.length !== 1) {
    throw new Error(`${urlPath}: expected exactly one canonical link, found ${matches.length}`);
  }
  return matches[0][1];
}
