import type { SitePage } from '@/types/sitePage';
import type { CollectionPageNode } from '@/types/structuredData';
import resolveAbsoluteUrl from '@/service/structuredData/resolveAbsoluteUrl';
import siteReferences from '@/service/structuredData/siteReferences';

/**
 * The /learn index record. The index has no single content source, so it never
 * carries a date, even when the page object has one.
 */
export default function buildCollectionPage(page: SitePage): CollectionPageNode {
  return {
    '@type': 'CollectionPage',
    name: page.title,
    description: page.description,
    url: resolveAbsoluteUrl(page.urlPath),
    isPartOf: siteReferences.website,
    publisher: siteReferences.organization,
  };
}
