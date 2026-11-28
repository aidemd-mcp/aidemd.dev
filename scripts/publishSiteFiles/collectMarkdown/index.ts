import buildRegistry, { renderDocMarkdown } from '@/service/docsRegistry';
import copyBySlug from '@/data/learn/copyBySlug';
import type { DocRoute } from '@/types/docs';
import type { SitePage } from '@/types/sitePage';
import renderLearnMarkdown from '../renderLearnMarkdown';

const LEARN_PATH = /^\/learn\/([^/]+)\/$/;

/** Finds the doc route a `doc` page was built from; the page's urlPath is the route's with a trailing slash. */
function findRoute(routes: DocRoute[], page: SitePage): DocRoute {
  const route = routes.find((candidate) => `${candidate.urlPath}/` === page.urlPath);
  if (!route) throw new Error(`collectMarkdown: no doc route for ${page.urlPath}`);
  return route;
}

/** Renders the markdown copy of one /learn page from its copy record, keyed by the slug in the page's urlPath. */
function renderLearnPage(page: SitePage): string {
  const slug = LEARN_PATH.exec(page.urlPath)?.[1];
  if (!slug || !Object.hasOwn(copyBySlug, slug)) {
    throw new Error(`collectMarkdown: no learn copy for ${page.urlPath}`);
  }
  return renderLearnMarkdown({ copy: copyBySlug[slug as keyof typeof copyBySlug], page });
}

/**
 * Collects the markdown text of every doc and /learn page, keyed by the page's
 * urlPath. Doc bodies come from the docs registry on request; /learn text is
 * rendered from its copy record. Pages of any other kind carry no markdown and
 * are skipped. A page with no source, or one that renders blank, throws naming
 * the page, so no `.md` copy or llms-full.txt entry can be silently empty.
 */
export default async function collectMarkdown(pages: SitePage[]): Promise<Map<string, string>> {
  const { routes } = await buildRegistry();

  const entries = await Promise.all(
    pages
      .filter((page) => page.kind === 'doc' || page.kind === 'learn')
      .map(async (page): Promise<[string, string]> => {
        const text =
          page.kind === 'doc'
            ? await renderDocMarkdown(findRoute(routes, page))
            : renderLearnPage(page);
        if (text.trim() === '') throw new Error(`collectMarkdown: blank markdown for ${page.urlPath}`);
        return [page.urlPath, text];
      }),
  );

  return new Map(entries);
}
