import path from 'node:path';
import type { Root } from 'hast';
import type { Plugin } from 'unified';
import type { DocRoute } from '@/types/docs';
import resolveDocHref from './resolveDocHref';

/**
 * Warning keys already printed in this process. Next renders each doc for both
 * metadata and the page, so without this every broken link would warn twice.
 */
const warned = new Set<string>();

/** Formats an absolute path relative to process.cwd() with `/` separators, for build-log lines. */
function toLogPath(absPath: string): string {
  return path.relative(process.cwd(), absPath).split(path.sep).join('/');
}

/**
 * Builds the rehype plugin that makes a rendered doc's relative links live.
 * Every `<a>` with a string href goes through resolveDocHref (the spec's in-doc
 * link outcome): a link to a known doc is rewritten to that doc's route with its
 * anchor kept; a link to a missing doc keeps its href as written and prints one
 * warning per (linking file, href) pair per process. A missing target warns but
 * never fails the build, so a missing target stays visible in the log without
 * blocking the site.
 *
 * Runs after rehype-raw so raw-HTML `<a>` tags are covered. Links shown as code
 * are text nodes, not `<a>` elements, so they are untouched.
 */
export default function resolveDocLinks({
  fromPath,
  routes,
}: {
  fromPath: string;
  routes: readonly DocRoute[];
}): Plugin<[], Root> {
  const routesByPath = new Map(routes.map((route) => [path.normalize(route.absPath), route]));

  return () => async (tree) => {
    const { visit } = await import('unist-util-visit');

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href !== 'string') return;

      const resolution = resolveDocHref({ href, fromPath, routesByPath });
      if (resolution.status === 'untouched') return;

      if (resolution.status === 'rewritten') {
        node.properties.href = resolution.href;
        return;
      }

      const key = `${fromPath}\n${href}`;
      if (warned.has(key)) return;
      warned.add(key);
      console.warn(
        `docsRegistry: unresolved doc link "${href}" in ${toLogPath(fromPath)} — no doc at ${toLogPath(resolution.resolvedPath)}; left as written`,
      );
    });
  };
}
