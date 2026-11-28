import type { FeedEntry } from '@/types/feed';
import type { SitePage } from '@/types/sitePage';
import isFeedPage from './isFeedPage';

/**
 * Picks the pages that become feed entries: docs and /learn pages that carry a
 * true last-modified date, mapped to the feed's entry shape in input order.
 * Index pages drop out on their own because they carry no date, and no date is
 * ever supplied here, so a dateless page is left out rather than given a made-up one.
 */
export default function selectEntries(pages: SitePage[]): FeedEntry[] {
  return pages.filter(isFeedPage).map((page) => ({
    urlPath: page.urlPath,
    title: page.title,
    description: page.description,
    modified: page.modified,
    // spread so a page with no published date yields no `published` key at all
    ...(page.published !== undefined && { published: page.published }),
  }));
}
