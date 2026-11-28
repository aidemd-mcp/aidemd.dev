import path from 'node:path';
import { readFile } from 'node:fs/promises';
import type { DocRoute, WalkedDocRoute } from '@/types/docs';
import parseDocFrontmatter from '../parseDocFrontmatter';
import absolutizeDocLinks from './absolutizeDocLinks';

/** Module-level cache of the in-flight or finished body per normalized absPath — concurrent callers for one doc share one read and one rewrite. */
const cache = new Map<string, Promise<string>>();

/**
 * Produces a doc's markdown body: the file with its frontmatter removed (first
 * H1 kept) and every resolvable relative doc link made absolute to
 * `https://aidemd.dev<urlPath>/`. This is what llms-full.txt and the per-page
 * `.md` copies carry.
 *
 * It runs only when asked, once per doc per process, because the link rewrite
 * parses every doc and the registry build must stay cheap for every page that
 * reads it. `routes` must be the build's registry routes; the memo does not
 * look at `routes` on a later call. A file that cannot be read rejects the
 * call; nothing catches it.
 */
export default function renderDocMarkdown({
  route,
  routes,
}: {
  route: DocRoute;
  routes: readonly WalkedDocRoute[];
}): Promise<string> {
  const key = path.normalize(route.absPath);
  const hit = cache.get(key);
  if (hit) return hit;

  const body = produceBody({ route, routes });
  cache.set(key, body);
  return body;
}

async function produceBody({
  route,
  routes,
}: {
  route: DocRoute;
  routes: readonly WalkedDocRoute[];
}): Promise<string> {
  const raw = await readFile(route.absPath, 'utf8');
  const { content } = parseDocFrontmatter(raw, route.slug);
  const routesByPath = new Map(routes.map((r) => [path.normalize(r.absPath), r]));

  return absolutizeDocLinks({ markdown: content, fromPath: route.absPath, routesByPath });
}
