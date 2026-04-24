import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { DOCS_CATEGORIES } from '@/data/docsCategories';
import type { DocRegistry, DocRoute, RenderedDoc } from '@/types/docs';
import walkDocsRoot from './walkDocsRoot';
import orderRoutes from './orderRoutes';
import parseDocFrontmatter from './parseDocFrontmatter';
import resolveCommitHash from './resolveCommitHash';
import renderMarkdown from './renderMarkdown';
import getHighlighter from '@/lib/shiki';

/** Module-level cache — populated on first call and reused for the remainder of the build. */
let cached: DocRegistry | null = null;

/**
 * Builds the complete DocRegistry by walking the four content roots defined in
 * DOCS_CATEGORIES, sorting routes deterministically, and wiring up the getByKey
 * index function.
 *
 * Pipeline:
 *   1. Walk each root via walkDocsRoot — discovers every .md file with zero
 *      exclusions, deriving slugs from relative paths.
 *   2. Concatenate all routes from all four sections.
 *   3. Sort via orderRoutes — section priority, index-first, alphabetical slug —
 *      and assign sequential order integers.
 *   4. Return { routes, getByKey } and memoize the result so generateStaticParams
 *      and every page component in a single build share the same registry instance
 *      without re-walking the filesystem.
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

  const routes = orderRoutes(allRoutesNested.flat());

  const registry: DocRegistry = {
    routes,
    getByKey: (key) => routes.find((r) => `${r.section}/${r.slug}` === key),
  };

  cached = registry;
  return registry;
}

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
  const bodyHtml = await renderMarkdown(body, highlighter);

  return {
    route,
    frontmatter,
    bodyHtml,
    commit,
    published: frontmatter.published ?? '',
  };
}
