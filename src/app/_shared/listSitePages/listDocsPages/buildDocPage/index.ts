import { SECTION_INDEX_META } from '@/data/docsCategories';
import type { getDocMeta } from '@/service/docsRegistry';
import type { DocRoute } from '@/types/docs';
import type { SitePage } from '@/types/sitePage';
import fixedPageCopy from '../../fixedPageCopy';
import attachOgImage from '../../shared/attachOgImage';
import toMarkdownUrl from '../../shared/toMarkdownUrl';
import toSingleLine from '../../shared/toSingleLine';

type DocMetaFields = Awaited<ReturnType<typeof getDocMeta>>;

/**
 * One doc page record. `title` is the H1 the file declares (today's `<title>`);
 * the breadcrumb tail is `meta.title`, the label the docs trail shows, so the
 * visible trail and the BreadcrumbList record stay word for word equal. The
 * description is the frontmatter or first-sentence text, single-lined, with an
 * AIDE-paired template as the last resort. `published` / `modified` are copied
 * from the route only when version history proved them.
 */
export default function buildDocPage({ route, meta }: { route: DocRoute; meta: DocMetaFields }): SitePage {
  const urlPath = `${route.urlPath}/`;
  return attachOgImage({
    urlPath,
    kind: 'doc',
    title: route.title,
    description: toSingleLine(meta.description ?? `${route.title} — canonical documentation for intent-driven AIDE`),
    section: SECTION_INDEX_META[route.section].label.toLowerCase(),
    markdownUrl: toMarkdownUrl(urlPath),
    breadcrumb: [
      { name: 'AIDE', urlPath: '/' },
      { name: fixedPageCopy.docsIndex.crumb, urlPath: '/docs/' },
      { name: route.section.toUpperCase(), urlPath: `/docs/${route.section}/` },
      { name: meta.title, urlPath },
    ],
    ...(route.published !== undefined && { published: route.published }),
    ...(route.modified !== undefined && { modified: route.modified }),
  });
}
