import siteIdentity from '@/data/siteIdentity';
import type { SitePage } from '@/types/sitePage';

/**
 * The `<title>` text of a page. The observer page's approved title already
 * carries the site name (decision #18), so it is used as written; every other
 * kind gets the site name appended with ` | `.
 */
export default function formatDocumentTitle(page: SitePage): string {
  if (page.kind === 'observer') return page.title;
  return `${page.title} | ${siteIdentity.siteName}`;
}
