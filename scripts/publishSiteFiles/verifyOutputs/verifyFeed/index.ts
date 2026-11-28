import siteIdentity from '@/data/siteIdentity';
import type { SitePage, SitePageKind } from '@/types/sitePage';
import fileError from '../shared/fileError';

const FILE = 'feed.xml';

/** The page families the feed lists, when they carry a true modified date. */
const FEED_KINDS = ['docsIndex', 'docsSection', 'doc', 'learnIndex', 'learn'] as const satisfies readonly SitePageKind[];

/** The pages that must be feed entries: a feed kind with a modified date. */
function feedPages(pages: SitePage[]): (SitePage & { modified: string })[] {
  return pages.filter(
    (page): page is SitePage & { modified: string } =>
      (FEED_KINDS as readonly SitePageKind[]).includes(page.kind) && page.modified !== undefined,
  );
}

/**
 * Checks feed.xml as read back from disk against the page list. It must open with
 * the XML declaration, carry the Atom `<feed>` root and end with `</feed>` and one
 * newline. Its `<entry>` blocks must be exactly the docs and /learn pages that carry
 * a modified date (same count, same canonical ids), and the feed-level `<updated>`
 * must be the newest of those dates, byte for byte. Each entry's own `<updated>` must equal
 * its page's `modified` and its `<published>` its page's `published` (present on both sides
 * or neither), byte for byte. Throws naming the broken rule.
 */
export default function verifyFeed({ xml, pages }: { xml: string; pages: SitePage[] }): void {
  if (xml.trim() === '') throw fileError(FILE, 'is empty');
  if (!xml.startsWith('<?xml')) throw fileError(FILE, 'does not start with the XML declaration');
  if (!xml.includes('<feed xmlns="http://www.w3.org/2005/Atom">')) throw fileError(FILE, 'has no Atom <feed> root');
  if (!xml.endsWith('</feed>\n')) throw fileError(FILE, 'does not end with </feed> and one newline');

  const expected = feedPages(pages);
  const [header, ...entries] = xml.split('<entry>');

  if (entries.length !== expected.length) {
    throw fileError(FILE, `has ${entries.length} entries, the page list has ${expected.length} dated pages`);
  }

  const ids = entries.map((entry) => entry.match(/<id>(.*?)<\/id>/)?.[1] ?? '');
  const expectedIds = expected.map((page) => siteIdentity.url + page.urlPath);
  const missingId = expectedIds.find((id) => !ids.includes(id));
  if (missingId) throw fileError(FILE, `has no entry for ${missingId}`);
  const extraId = ids.find((id) => !expectedIds.includes(id));
  if (extraId !== undefined) {
    throw fileError(FILE, `has an entry for ${extraId || 'an unreadable id'}, which is not a dated docs or /learn page`);
  }

  for (const page of expected) {
    const id = siteIdentity.url + page.urlPath;
    const entry = entries[ids.indexOf(id)];
    const entryUpdated = entry.match(/<updated>(.*?)<\/updated>/)?.[1];
    if (entryUpdated !== page.modified) {
      throw fileError(FILE, `entry ${id} <updated> is ${entryUpdated ?? 'missing'}, the page's modified date is ${page.modified}`);
    }
    const entryPublished = entry.match(/<published>(.*?)<\/published>/)?.[1];
    if (entryPublished !== page.published) {
      throw fileError(
        FILE,
        `entry ${id} <published> is ${entryPublished ?? 'missing'}, the page's published date is ${page.published ?? 'missing'}`,
      );
    }
  }

  const updated = header.match(/<updated>(.*?)<\/updated>/)?.[1];
  if (updated === undefined) throw fileError(FILE, 'has no feed-level <updated>');
  const newestTime = Math.max(...expected.map((page) => Date.parse(page.modified)));
  const newest = expected.filter((page) => Date.parse(page.modified) === newestTime).map((page) => page.modified);
  if (!newest.includes(updated)) {
    throw fileError(FILE, `feed <updated> is ${updated}, the newest page date is ${newest[0]}`);
  }
}
