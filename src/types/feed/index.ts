import type { PageDates, SitePage } from '@/types/sitePage';

/** One feed entry; `modified` is required because a page without a proven date never becomes an entry. */
export type FeedEntry = Pick<SitePage, 'urlPath' | 'title' | 'description'> &
  Pick<PageDates, 'published'> & { modified: string };

/** Everything the feed needs beyond its entries, handed in by the caller. */
export type FeedMeta = {
  title: string;
  subtitle: string;
  siteUrl: string;
  feedUrlPath: string;
  authorName: string;
};
