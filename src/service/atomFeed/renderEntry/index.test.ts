import { describe, it, expect } from 'vitest';
import siteIdentity from '@/data/siteIdentity';
import type { FeedEntry, FeedMeta } from '@/types/feed';
import renderEntry from './index';

function makeEntry(overrides: Partial<FeedEntry> = {}): FeedEntry {
  return {
    urlPath: '/docs/hooks/stop/',
    title: 'Stop hook',
    description: 'When the stop hook fires.',
    modified: '2026-11-20T14:03:11-05:00',
    ...overrides,
  };
}

function makeMeta(overrides: Partial<FeedMeta> = {}): FeedMeta {
  return {
    title: 'Feed title',
    subtitle: 'Feed subtitle',
    siteUrl: siteIdentity.url,
    feedUrlPath: '/feed.xml',
    authorName: siteIdentity.name,
    ...overrides,
  };
}

describe('renderEntry', () => {
  it('renders the exact block with element order locked', () => {
    const block = renderEntry({
      entry: makeEntry({ published: '2026-11-01T09:00:00-05:00' }),
      meta: makeMeta(),
    });

    expect(block).toBe(
      [
        '  <entry>',
        '    <id>https://aidemd.dev/docs/hooks/stop/</id>',
        '    <title type="text">Stop hook</title>',
        '    <link rel="alternate" type="text/html" href="https://aidemd.dev/docs/hooks/stop/"/>',
        '    <published>2026-11-01T09:00:00-05:00</published>',
        '    <updated>2026-11-20T14:03:11-05:00</updated>',
        '    <author>',
        '      <name>Lowmeadow LLC</name>',
        '    </author>',
        '    <summary type="text">When the stop hook fires.</summary>',
        '  </entry>',
      ].join('\n'),
    );
  });

  it('uses the canonical URL for both id and link href', () => {
    const block = renderEntry({ entry: makeEntry(), meta: makeMeta() });

    expect(block).toContain('<id>https://aidemd.dev/docs/hooks/stop/</id>');
    expect(block).toContain('href="https://aidemd.dev/docs/hooks/stop/"');
  });

  it('carries modified byte for byte, without converting the offset', () => {
    const block = renderEntry({ entry: makeEntry({ modified: '2026-11-20T14:03:11-05:00' }), meta: makeMeta() });

    expect(block).toContain('<updated>2026-11-20T14:03:11-05:00</updated>');
  });

  it('includes published when given and omits it when not', () => {
    const withPublished = renderEntry({
      entry: makeEntry({ published: '2026-11-01T09:00:00-05:00' }),
      meta: makeMeta(),
    });
    const withoutPublished = renderEntry({ entry: makeEntry(), meta: makeMeta() });

    expect(withPublished).toContain('<published>2026-11-01T09:00:00-05:00</published>');
    expect(withoutPublished).not.toContain('<published>');
  });

  it('escapes the title', () => {
    const block = renderEntry({ entry: makeEntry({ title: 'Hooks & <stop>' }), meta: makeMeta() });

    expect(block).toContain('<title type="text">Hooks &amp; &lt;stop&gt;</title>');
  });

  it('escapes the summary', () => {
    const block = renderEntry({
      entry: makeEntry({ description: `Use "a" & 'b' < c > d` }),
      meta: makeMeta(),
    });

    expect(block).toContain('<summary type="text">Use &quot;a&quot; &amp; &apos;b&apos; &lt; c &gt; d</summary>');
  });

  it('credits Lowmeadow LLC by name only', () => {
    const block = renderEntry({ entry: makeEntry(), meta: makeMeta() });

    expect(block).toContain('<name>Lowmeadow LLC</name>');
    expect(block).not.toContain('<email>');
    expect(block).not.toContain('<uri>');
  });

  it('throws when the urlPath has no trailing slash', () => {
    expect(() => renderEntry({ entry: makeEntry({ urlPath: '/docs/hooks/stop' }), meta: makeMeta() })).toThrow(
      '/docs/hooks/stop',
    );
  });
});
