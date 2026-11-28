import type { SitePage } from '@/types/sitePage';
import listSitePages from '..';

/**
 * Looks a page up in the one list by its canonical path (with trailing
 * slash). Throws when the path is not listed, so a typo stops the build
 * instead of rendering another page's metadata.
 */
export default async function findSitePage(urlPath: string): Promise<SitePage> {
  const pages = await listSitePages();
  const page = pages.find((candidate) => candidate.urlPath === urlPath);
  if (page === undefined) {
    throw new Error(`listSitePages: no page at ${urlPath}`);
  }
  return page;
}
