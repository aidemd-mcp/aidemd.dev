import type { FeedMeta } from '@/types/feed';
import buildAbsoluteUrl from '../shared/buildAbsoluteUrl';
import escapeXml from '../shared/escapeXml';

/**
 * Renders the XML declaration, the opening `<feed>` tag and the feed-level Atom
 * elements, children indented two spaces, LF line endings. `updated` is written
 * verbatim: the caller passes the newest entry's date, so the feed carries a true
 * date and never a build time. Nothing here depends on the clock or environment.
 * The author is the name only, so the feed credits the organisation and no person.
 */
export default function renderHeader({ meta, updated }: { meta: FeedMeta; updated: string }): string {
  const feedUrl = escapeXml(buildAbsoluteUrl({ siteUrl: meta.siteUrl, urlPath: meta.feedUrlPath }));
  const homeUrl = escapeXml(buildAbsoluteUrl({ siteUrl: meta.siteUrl, urlPath: '/' }));

  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `  <id>${feedUrl}</id>`,
    `  <title type="text">${escapeXml(meta.title)}</title>`,
    `  <subtitle type="text">${escapeXml(meta.subtitle)}</subtitle>`,
    `  <updated>${escapeXml(updated)}</updated>`,
    `  <link rel="self" type="application/atom+xml" href="${feedUrl}"/>`,
    `  <link rel="alternate" type="text/html" href="${homeUrl}"/>`,
    '  <author>',
    `    <name>${escapeXml(meta.authorName)}</name>`,
    '  </author>',
  ].join('\n');
}
