import type { FeedEntry } from '@/types/feed';

/** Parses an entry's `modified` into an epoch instant, failing loudly (naming the entry) when it is not a date. */
export default function parseModified(entry: FeedEntry): number {
  const instant = Date.parse(entry.modified);
  if (Number.isNaN(instant)) {
    throw new Error(`atomFeed: entry ${entry.urlPath} has a modified date that does not parse: ${entry.modified}`);
  }
  return instant;
}
