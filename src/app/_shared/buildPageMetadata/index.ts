import type { Metadata } from 'next';
import siteIdentity from '@/data/siteIdentity';
import ogCardAlt from '@/service/socialShare/ogCardAlt';
import type { PageImage, SitePage } from '@/types/sitePage';
import formatDocumentTitle from './formatDocumentTitle';

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;

/**
 * The one way a page gets its metadata. Next.js replaces a parent's
 * `openGraph`, `twitter` and `alternates` objects wholesale, so every page
 * restates all of them here and none hand-writes its own. Everything comes from
 * the page record: the canonical and `og:url` are the same string, `og:image`
 * is the page's own `ogImage`, and article dates appear only when version
 * history proved them. `image` overrides the card's size and alt for a page
 * whose image is not a generated card (the /observer capture); without it the
 * card is 1200×630 with the alt from `ogCardAlt`, and a page with neither
 * throws. Pure: reads only its input, `siteIdentity` and `ogCardAlt`.
 */
export default function buildPageMetadata(page: SitePage, image?: PageImage): Metadata {
  const canonical = siteIdentity.url + page.urlPath;
  const alt = image?.alt ?? ogCardAlt(page);
  if (alt === null) {
    throw new Error(`buildPageMetadata: no image alt for ${page.urlPath}`);
  }

  const types: Record<string, string> = { 'application/atom+xml': '/feed.xml' };
  if (page.markdownUrl !== undefined) types['text/markdown'] = page.markdownUrl;

  const images = [{ url: page.ogImage, width: image?.width ?? CARD_WIDTH, height: image?.height ?? CARD_HEIGHT, alt }];
  const shared = {
    url: canonical,
    siteName: siteIdentity.siteName,
    title: page.title,
    description: page.description,
    images,
  };
  const isArticle = page.kind === 'doc' || page.kind === 'learn';

  return {
    title: { absolute: formatDocumentTitle(page) },
    description: page.description,
    alternates: { canonical, types },
    openGraph: isArticle
      ? {
          type: 'article',
          ...shared,
          ...(page.published !== undefined ? { publishedTime: page.published } : {}),
          ...(page.modified !== undefined ? { modifiedTime: page.modified } : {}),
        }
      : { type: 'website', ...shared },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [page.ogImage],
    },
  };
}
