import type { SitePage } from '@/types/sitePage';
import findBrokenRule from './findBrokenRule';

/**
 * Stops the build on the first page that breaks a listing rule: canonical
 * path, uniqueness, indexability, single-line copy, breadcrumb ends, markdown
 * copy link exactly where a copy exists, dates only on pages with one content
 * source, and a unique generated share image. Throws
 * `listSitePages: <rule> at <urlPath>`.
 *
 * Pipeline:
 *   1. Walk the pages in list order.
 *   2. Ask findBrokenRule about each one against the pages already accepted.
 *   3. Throw naming the page and rule on the first break.
 */
export default function assertSitePages(pages: SitePage[]): void {
  const seenPaths = new Set<string>();
  const seenImages = new Set<string>();

  for (const page of pages) {
    const broken = findBrokenRule(page, seenPaths, seenImages);
    if (broken !== null) {
      throw new Error(`listSitePages: ${broken} at ${page.urlPath}`);
    }
    seenPaths.add(page.urlPath);
    seenImages.add(page.ogImage);
  }
}
