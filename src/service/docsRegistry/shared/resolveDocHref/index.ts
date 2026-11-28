import path from 'node:path';
import type { WalkedDocRoute } from '@/types/docs';

/**
 * The outcome of resolving one href found in a rendered doc.
 * - `untouched`: not a relative link to a doc; the href stays as written.
 * - `rewritten`: the link points at a known doc; `href` is that doc's live route.
 * - `missing`: the link points at a `.md` file no route covers; `resolvedPath` is where it landed.
 */
export type DocHrefResolution =
  | { status: 'untouched' }
  | { status: 'rewritten'; href: string }
  | { status: 'missing'; resolvedPath: string };

const URL_SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

/** Percent-decodes a path part; malformed escapes return undefined so the caller leaves the link alone instead of throwing. */
function decodePathPart(pathPart: string): string | undefined {
  try {
    return decodeURIComponent(pathPart);
  } catch {
    return undefined;
  }
}

/**
 * Resolves one relative doc link by file path, never by editing the href string:
 * the href is resolved against the linking file's directory and the result is
 * looked up among the routes by `absPath` (exact, case-sensitive, so a wrong-case
 * link is reported on every OS). A hit becomes the target's trailing-slash route
 * with the original query and fragment kept; a miss is reported, never guessed.
 * Pure: no I/O, no logging, never throws — the caller owns the warning.
 */
export default function resolveDocHref({
  href,
  fromPath,
  routesByPath,
}: {
  href: string;
  fromPath: string;
  routesByPath: ReadonlyMap<string, WalkedDocRoute>;
}): DocHrefResolution {
  if (href === '' || href.startsWith('#') || href.startsWith('/')) return { status: 'untouched' };
  if (URL_SCHEME.test(href)) return { status: 'untouched' };

  const fragmentStart = href.indexOf('#');
  const beforeFragment = fragmentStart === -1 ? href : href.slice(0, fragmentStart);
  const fragment = fragmentStart === -1 ? '' : href.slice(fragmentStart);

  const queryStart = beforeFragment.indexOf('?');
  const pathPart = queryStart === -1 ? beforeFragment : beforeFragment.slice(0, queryStart);
  const query = queryStart === -1 ? '' : beforeFragment.slice(queryStart);

  const decodedPath = decodePathPart(pathPart);
  if (decodedPath === undefined || !decodedPath.endsWith('.md')) return { status: 'untouched' };

  const resolvedPath = path.normalize(path.resolve(path.dirname(fromPath), decodedPath));
  const route = routesByPath.get(resolvedPath);
  if (!route) return { status: 'missing', resolvedPath };

  return { status: 'rewritten', href: `${route.urlPath}/${query}${fragment}` };
}
