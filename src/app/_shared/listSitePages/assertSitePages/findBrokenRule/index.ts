import type { SitePage } from '@/types/sitePage';
import toMarkdownUrl from '../../shared/toMarkdownUrl';

const OG_CARD_PREFIX = '/og/';

/**
 * Names the first rule `page` breaks, or `null` when it breaks none. Rules are
 * checked in a fixed order so the same defect always reports the same rule.
 * `seenPaths` and `seenImages` hold the pages already accepted; the caller adds
 * to them after a clean page.
 */
export default function findBrokenRule(
  page: SitePage,
  seenPaths: ReadonlySet<string>,
  seenImages: ReadonlySet<string>,
): string | null {
  const { urlPath, title, description, breadcrumb, kind, markdownUrl, ogImage } = page;

  if (!urlPath.startsWith('/') || !urlPath.endsWith('/') || urlPath !== urlPath.toLowerCase()) {
    return 'urlPath is not a lowercase path with leading and trailing slash';
  }
  if (seenPaths.has(urlPath)) return 'urlPath is listed twice';
  if (urlPath === '/404/' || urlPath.includes('[')) return 'urlPath is not indexable';

  if (title.trim() === '' || /[\r\n]/.test(title)) return 'title is empty or not single-line';
  if (description.trim() === '' || /[\r\n]/.test(description)) {
    return 'description is empty or not single-line';
  }

  if (breadcrumb.length === 0) return 'breadcrumb is empty';
  if (breadcrumb[0].urlPath !== '/') return 'breadcrumb does not start at home';
  if (breadcrumb[breadcrumb.length - 1].urlPath !== urlPath) return 'breadcrumb does not end at the page';
  if (breadcrumb.some((item) => !item.urlPath.endsWith('/'))) return 'breadcrumb item without trailing slash';

  const hasMarkdownCopy = kind === 'doc' || kind === 'learn';
  if (hasMarkdownCopy !== (markdownUrl !== undefined)) {
    return hasMarkdownCopy ? 'markdownUrl is missing' : 'markdownUrl is present on a page with no markdown copy';
  }
  if (markdownUrl !== undefined && markdownUrl !== toMarkdownUrl(urlPath)) {
    return 'markdownUrl belongs to another page';
  }

  if ((page.published !== undefined || page.modified !== undefined) && !hasMarkdownCopy) {
    return 'dates are present on a page with no single content source';
  }

  if (!ogImage.startsWith('/')) return 'ogImage is not root-relative';
  if (ogImage.startsWith(OG_CARD_PREFIX) && seenImages.has(ogImage)) return 'ogImage is shared with another page';

  return null;
}
