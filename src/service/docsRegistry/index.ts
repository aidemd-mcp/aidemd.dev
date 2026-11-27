import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { DOCS_CATEGORIES } from '@/data/docsCategories';
import type { DocRegistry, DocRoute, RenderedDoc } from '@/types/docs';
import walkDocsRoot from './walkDocsRoot';
import assertUniqueUrlPaths from './assertUniqueUrlPaths';
import orderRoutes from './orderRoutes';
import parseDocFrontmatter from './parseDocFrontmatter';
import resolveCommitHash from './resolveCommitHash';
import resolvePublishedDate from './resolvePublishedDate';
import renderMarkdown from './renderMarkdown';
import getHighlighter from '@/lib/shiki';
import getDocMetaHelper from './getDocMeta';

/** Module-level cache — populated on first call and reused for the remainder of the build. */
let cached: DocRegistry | null = null;

/**
 * Builds the complete DocRegistry by walking every content root defined in
 * DOCS_CATEGORIES, sorting routes deterministically, and wiring up the getByKey
 * index function.
 *
 * Pipeline:
 *   1. Walk each root via walkDocsRoot — discovers every .md file with zero
 *      exclusions, deriving case-kept slugs and lowercase urlPaths.
 *   2. Concatenate all routes from every section.
 *   3. Gate via assertUniqueUrlPaths — two files whose URLs differ only by case
 *      fail the build.
 *   4. Sort via orderRoutes — section priority, index-first, alphabetical
 *      lowercased urlPath — and assign sequential order integers.
 *   5. Return { routes, getByKey } and memoize the result so generateStaticParams
 *      and every page component in a single build share the same registry instance
 *      without re-walking the filesystem. getByKey matches case-insensitively.
 *
 * Resolves absRoot paths relative to process.cwd() so the registry works
 * regardless of which directory the Next.js build process starts from.
 */
export default async function buildRegistry(): Promise<DocRegistry> {
  if (cached) return cached;

  const cwd = process.cwd();

  const allRoutesNested = await Promise.all(
    DOCS_CATEGORIES.map((cat) =>
      walkDocsRoot({
        section: cat.section,
        urlSegment: cat.urlSegment,
        absRoot: path.resolve(cwd, cat.absRoot),
      }),
    ),
  );

  const walked = allRoutesNested.flat();

  // Lowercased URLs can collide; fail before ordering so no doc is dropped silently.
  assertUniqueUrlPaths(walked);

  const routes = orderRoutes(walked);

  const registry: DocRegistry = {
    routes,
    getByKey: (key) => {
      const lowerKey = key.toLowerCase();
      return routes.find((r) => `${r.section}/${r.slug.toLowerCase()}` === lowerKey);
    },
  };

  cached = registry;
  return registry;
}

/**
 * Cheap-read counterpart to `renderDoc`. Returns only the route's resolved
 * title and the optional frontmatter `description` — no Shiki, no HTML
 * rendering. Prefer this over `renderDoc` when you need title + description
 * only (e.g. the llms.txt generator, sitemaps, or meta-index surfaces).
 * Use `renderDoc` when the rendered body HTML is required.
 */
export const getDocMeta = getDocMetaHelper;

/**
 * Reads, parses, and renders a single doc route to a RenderedDoc. The Shiki
 * highlighter is resolved once via the module-level singleton in
 * src/lib/shiki/index.ts and shared across every renderDoc call in a build —
 * callers do not need to manage the highlighter lifecycle.
 */
export async function renderDoc(route: DocRoute): Promise<RenderedDoc> {
  const highlighter = await getHighlighter();
  const raw = await readFile(route.absPath, 'utf8');
  const { frontmatter, body } = parseDocFrontmatter(raw, route.slug);
  const commit = resolveCommitHash(route.absPath);
  const { routes } = await buildRegistry();
  const bodyHtml = await renderMarkdown(body, { highlighter, fromPath: route.absPath, routes });

  return {
    route,
    frontmatter,
    bodyHtml,
    commit,
    published: frontmatter.published || resolvePublishedDate(route.absPath),
  };
}
