import { DOCS_CATEGORIES } from '@/data/docsCategories';
import buildRegistry, { getDocMeta } from '@/service/docsRegistry';
import type { SitePage } from '@/types/sitePage';
import buildDocsIndexPage from './buildDocsIndexPage';
import buildDocsSectionPage from './buildDocsSectionPage';
import buildDocPage from './buildDocPage';

/**
 * Lists every docs page in site order: the docs index, then for each
 * DOCS_CATEGORIES entry its section index followed by its docs in registry
 * order.
 *
 * Pipeline:
 *   1. Read the registry's routes (memoized per process).
 *   2. Read every route's title and description in parallel, order kept.
 *   3. Build the docs index page.
 *   4. For each category in array order, build its section page and then one
 *      page per route of that section, in registry order.
 */
export default async function listDocsPages(): Promise<SitePage[]> {
  const { routes } = await buildRegistry();
  const metas = await Promise.all(routes.map((route) => getDocMeta(route)));
  const docPages = routes.map((route, i) => ({ route, page: buildDocPage({ route, meta: metas[i] }) }));

  return [
    buildDocsIndexPage(),
    ...DOCS_CATEGORIES.flatMap((category) => [
      buildDocsSectionPage(category),
      ...docPages.filter(({ route }) => route.section === category.section).map(({ page }) => page),
    ]),
  ];
}
