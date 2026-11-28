/**
 * Derives a page's markdown copy address from its canonical path:
 * `/docs/hooks/stop/` becomes `/docs/hooks/stop.md`. Throws on a path that is
 * not a trailing-slash canonical path, or on the home path, which has no copy.
 */
export default function toMarkdownUrl(urlPath: string): string {
  if (urlPath === '/' || !urlPath.startsWith('/') || !urlPath.endsWith('/')) {
    throw new Error(`listSitePages: no markdown copy address for ${urlPath}`);
  }
  return `${urlPath.slice(0, -1)}.md`;
}
