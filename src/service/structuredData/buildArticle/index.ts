import type { ArticleNode } from '@/types/structuredData';
import type { SitePage } from '@/types/sitePage';
import resolveAbsoluteUrl from '@/service/structuredData/resolveAbsoluteUrl';
import siteReferences from '@/service/structuredData/siteReferences';
import resolveArticleType from '@/service/structuredData/buildArticle/resolveArticleType';

/**
 * The page record for a docs page (TechArticle) or a /learn page (Article). It credits
 * Lowmeadow LLC by reference only: author and publisher point at the one Organization
 * and isPartOf at the one WebSite. Dates are set only when the page has a true date,
 * so the record never carries a guessed one.
 */
export default function buildArticle({
  page,
  headline,
}: {
  page: SitePage;
  headline: string;
}): ArticleNode {
  const url = resolveAbsoluteUrl(page.urlPath);
  const articleType = resolveArticleType(page.kind);
  return {
    '@type': articleType,
    headline,
    description: page.description,
    url,
    mainEntityOfPage: url,
    ...(page.published !== undefined && { datePublished: page.published }),
    ...(page.modified !== undefined && { dateModified: page.modified }),
    author: siteReferences.organization,
    publisher: siteReferences.organization,
    isPartOf: siteReferences.website,
  };
}
