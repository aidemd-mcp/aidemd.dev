import siteIdentity from '@/data/siteIdentity';
import type { FeedMeta } from '@/types/feed';

/**
 * The feed-level copy and identity the Atom feed is composed with. The title is
 * the site name; the subtitle pairs AIDE with "intent-driven". The author is the
 * site identity's name, so the feed credits the same entity as the structured data.
 */
const feedMeta = {
  title: 'aidemd.dev',
  subtitle: 'New and updated pages in the intent-driven AIDE docs and /learn',
  siteUrl: siteIdentity.url,
  feedUrlPath: '/feed.xml',
  authorName: siteIdentity.name,
} as const satisfies FeedMeta;

export default feedMeta;
