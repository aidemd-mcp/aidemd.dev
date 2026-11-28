import type { FeedEntry, FeedMeta } from '@/types/feed';
import buildAbsoluteUrl from '../shared/buildAbsoluteUrl';
import escapeXml from '../shared/escapeXml';

/**
 * Renders one Atom `<entry>` block, two-space indented under `<feed>`, LF line endings.
 * The canonical URL is both the entry id and its alternate link. `updated` is the
 * entry's `modified` string verbatim, never reformatted, so it equals the page's date.
 * The author is the name only: no email, no uri, no person. Throws when the page path
 * lacks its trailing slash, because the feed never emits a non-canonical address.
 */
export default function renderEntry({ entry, meta }: { entry: FeedEntry; meta: FeedMeta }): string {
  if (!entry.urlPath.endsWith('/')) {
    throw new Error(`renderEntry: urlPath must end with '/': ${entry.urlPath}`);
  }

  const url = escapeXml(buildAbsoluteUrl({ siteUrl: meta.siteUrl, urlPath: entry.urlPath }));

  return [
    '  <entry>',
    `    <id>${url}</id>`,
    `    <title type="text">${escapeXml(entry.title)}</title>`,
    `    <link rel="alternate" type="text/html" href="${url}"/>`,
    ...(entry.published === undefined ? [] : [`    <published>${escapeXml(entry.published)}</published>`]),
    `    <updated>${escapeXml(entry.modified)}</updated>`,
    '    <author>',
    `      <name>${escapeXml(meta.authorName)}</name>`,
    '    </author>',
    `    <summary type="text">${escapeXml(entry.description)}</summary>`,
    '  </entry>',
  ].join('\n');
}
