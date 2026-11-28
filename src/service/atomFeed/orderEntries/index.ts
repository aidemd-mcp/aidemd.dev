import type { FeedEntry } from '@/types/feed';
import parseModified from './parseModified';

/**
 * Orders feed entries newest first without touching the input. Dates compare as
 * parsed instants, never as strings, because git dates carry differing offsets;
 * equal instants fall back to `urlPath` ascending so the output never depends on
 * input order. Reads no clock.
 */
export default function orderEntries(entries: FeedEntry[]): FeedEntry[] {
  const dated = entries.map((entry) => ({ entry, instant: parseModified(entry) }));

  return dated
    .sort((a, b) => {
      if (a.instant !== b.instant) return b.instant - a.instant;
      if (a.entry.urlPath === b.entry.urlPath) return 0;
      return a.entry.urlPath < b.entry.urlPath ? -1 : 1;
    })
    .map(({ entry }) => entry);
}
