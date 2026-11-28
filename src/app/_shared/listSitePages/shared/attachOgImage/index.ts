import type { SitePage } from '@/types/sitePage';
import ogCardAddress from '@/service/socialShare/ogCardAddress';

/**
 * Gives a page its share image from socialShare's one address formula, so the
 * list and the card renderer can never disagree. Throws for a kind with no
 * card; the observer builder sets its own capture image instead.
 */
export default function attachOgImage(page: Omit<SitePage, 'ogImage'>): SitePage {
  const ogImage = ogCardAddress({
    urlPath: page.urlPath,
    kind: page.kind,
    title: page.title,
    section: page.section,
  });
  if (ogImage === null) throw new Error(`listSitePages: no share card for ${page.urlPath}`);
  return { ...page, ogImage };
}
