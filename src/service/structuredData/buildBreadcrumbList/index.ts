import type { BreadcrumbItem } from '@/types/sitePage';
import type { BreadcrumbListNode } from '@/types/structuredData';
import resolveAbsoluteUrl from '@/service/structuredData/resolveAbsoluteUrl';

/**
 * The breadcrumb record, built from the same breadcrumb entry the visible trail
 * renders, so labels, order and count match what the visitor sees.
 */
export default function buildBreadcrumbList(breadcrumb: BreadcrumbItem[]): BreadcrumbListNode {
  if (breadcrumb.length < 2) {
    throw new Error('structuredData: a breadcrumb needs at least 2 items');
  }
  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: resolveAbsoluteUrl(item.urlPath),
    })),
  };
}
