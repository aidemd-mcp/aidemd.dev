import { describe, it, expect } from 'vitest';
import siteIdentity from '@/data/siteIdentity';
import type { FeedMeta } from '@/types/feed';
import renderHeader from './index';

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

const UPDATED = '2026-11-20T14:03:11-05:00';

describe('renderHeader', () => {
  it('starts with the XML declaration', () => {
    const header = renderHeader({ meta: makeMeta(), updated: UPDATED });

    expect(header.split('\n')[0]).toBe('<?xml version="1.0" encoding="utf-8"?>');
  });

  it('declares the Atom namespace on the feed element', () => {
    const header = renderHeader({ meta: makeMeta(), updated: UPDATED });

    expect(header.split('\n')[1]).toBe('<feed xmlns="http://www.w3.org/2005/Atom">');
  });

  it('uses the feed URL for both id and the self link', () => {
    const header = renderHeader({ meta: makeMeta(), updated: UPDATED });

    expect(header).toContain('<id>https://aidemd.dev/feed.xml</id>');
    expect(header).toContain('<link rel="self" type="application/atom+xml" href="https://aidemd.dev/feed.xml"/>');
  });

  it('points the alternate link at the site root', () => {
    const header = renderHeader({ meta: makeMeta(), updated: UPDATED });

    expect(header).toContain('<link rel="alternate" type="text/html" href="https://aidemd.dev/"/>');
  });

  it('carries updated byte for byte, without converting the offset', () => {
    const header = renderHeader({ meta: makeMeta(), updated: UPDATED });

    expect(header).toContain('<updated>2026-11-20T14:03:11-05:00</updated>');
  });

  it('credits Lowmeadow LLC by name only', () => {
    const header = renderHeader({ meta: makeMeta(), updated: UPDATED });

    expect(header).toContain('<name>Lowmeadow LLC</name>');
    expect(header).not.toContain('<email>');
    expect(header).not.toContain('<uri>');
  });

  it('escapes the title and subtitle', () => {
    const header = renderHeader({
      meta: makeMeta({ title: 'Docs & Learn', subtitle: 'a < b' }),
      updated: UPDATED,
    });

    expect(header).toContain('<title type="text">Docs &amp; Learn</title>');
    expect(header).toContain('<subtitle type="text">a &lt; b</subtitle>');
  });

  it('adds no generator element', () => {
    const header = renderHeader({ meta: makeMeta(), updated: UPDATED });

    expect(header).not.toContain('<generator');
  });

  it('renders the exact block with element order locked and leaves <feed> open', () => {
    const header = renderHeader({ meta: makeMeta(), updated: UPDATED });

    expect(header).toBe(
      [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<feed xmlns="http://www.w3.org/2005/Atom">',
        '  <id>https://aidemd.dev/feed.xml</id>',
        '  <title type="text">Feed title</title>',
        '  <subtitle type="text">Feed subtitle</subtitle>',
        '  <updated>2026-11-20T14:03:11-05:00</updated>',
        '  <link rel="self" type="application/atom+xml" href="https://aidemd.dev/feed.xml"/>',
        '  <link rel="alternate" type="text/html" href="https://aidemd.dev/"/>',
        '  <author>',
        '    <name>Lowmeadow LLC</name>',
        '  </author>',
      ].join('\n'),
    );
  });
});
