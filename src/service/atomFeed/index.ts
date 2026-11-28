import type { FeedMeta } from '@/types/feed';
import type { SitePage } from '@/types/sitePage';
import orderEntries from './orderEntries';
import renderEntry from './renderEntry';
import renderHeader from './renderHeader';
import selectEntries from './selectEntries';

/**
 * Composes the complete Atom `feed.xml` text from the page list and feed metadata
 * it is handed: keeps the docs and /learn pages that carry a true last-modified
 * date, orders them newest first, renders the header (whose `updated` is the newest
 * entry's date) and one `<entry>` per page, then closes the feed. Output is
 * deterministic, LF-delimited and ends with exactly one trailing newline.
 * Pure: it reads no file, clock, git history or environment and writes nothing.
 * Throws when no page has a known date, because the feed then has no true
 * `updated` time and a build-time stand-in is never acceptable.
 */
export default function composeFeed({ pages, meta }: { pages: SitePage[]; meta: FeedMeta }): string {
  // Select the docs and /learn pages that carry a true modified date
  const entries = selectEntries(pages);

  // Order them newest first
  const ordered = orderEntries(entries);

  // No dated entry means no true feed updated time: fail rather than guess
  if (ordered.length === 0) {
    throw new Error('atomFeed: no docs or /learn page has a known modified date; the feed has no true updated time');
  }

  // The feed's updated time is the newest entry's date, verbatim
  const updated = ordered[0].modified;

  // Render the header, each entry, then close the feed
  const header = renderHeader({ meta, updated });
  const renderedEntries = ordered.map((entry) => renderEntry({ entry, meta }));

  return [header, ...renderedEntries, '</feed>'].join('\n') + '\n';
}
