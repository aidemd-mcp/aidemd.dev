import type { SitePage } from '@/types/sitePage';
import listDocsPages from './listDocsPages';
import listLearnPages from './listLearnPages';
import buildHomePage from './buildHomePage';
import buildBrainPages from './buildBrainPages';
import buildObserverPage from './buildObserverPage';
import buildPrivacyPage from './buildPrivacyPage';
import assertSitePages from './assertSitePages';

let cached: Promise<SitePage[]> | null = null;

async function build(): Promise<SitePage[]> {
  const pages = [
    buildHomePage(),
    ...(await listDocsPages()),
    ...buildBrainPages(),
    buildObserverPage(),
    buildPrivacyPage(),
    ...listLearnPages(),
  ];
  assertSitePages(pages);
  return pages;
}

/**
 * The one list of every indexable page, in site order. Every page's metadata,
 * the sitemap, the feed, the llms files and the pre-deploy script read this
 * list, so none of them can disagree about what exists or when it changed.
 * Memoized per process because all of them read it in one build: one registry
 * build and one version-history read, and the identical array for every surface.
 * Errors (a broken rule, a shallow history) propagate and stop the build.
 *
 * Pipeline:
 *   1. Home.
 *   2. The docs index, then each docs section index followed by its docs.
 *   3. /brain and /brain/recipes, /observer, /privacy.
 *   4. The /learn index and the /learn pages in roster order.
 *   5. Validate with assertSitePages, then resolve.
 */
export default function listSitePages(): Promise<SitePage[]> {
  cached ??= build();
  return cached;
}
