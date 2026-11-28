import { describe, expect, it } from 'vitest';
import type { SitePage } from '@/types/sitePage';
import verifyFeed from './index';

function makePage(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/',
    title: 'Home',
    description: 'Home page',
    kind: 'home',
    ogImage: '/og.png',
    breadcrumb: [],
    ...overrides,
  };
}

const older = '2026-11-01T10:00:00+00:00';
const newer = '2026-11-20T10:00:00+00:00';

const pages: SitePage[] = [
  makePage(),
  makePage({ urlPath: '/docs/hooks/stop/', kind: 'doc', modified: older }),
  makePage({ urlPath: '/learn/intent/', kind: 'learn', modified: newer }),
  makePage({ urlPath: '/learn/', kind: 'learnIndex' }),
];

function makeEntry(urlPath: string, modified: string, published?: string): string {
  const publishedLine = published === undefined ? '' : `    <published>${published}</published>\n`;
  return `  <entry>\n    <id>https://aidemd.dev${urlPath}</id>\n${publishedLine}    <updated>${modified}</updated>\n  </entry>`;
}

function makeXml({ updated = newer, entries = [makeEntry('/learn/intent/', newer), makeEntry('/docs/hooks/stop/', older)] } = {}): string {
  const header = `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">\n  <id>https://aidemd.dev/feed.xml</id>\n  <updated>${updated}</updated>`;
  return `${header}\n${entries.join('\n')}\n</feed>\n`;
}

describe('verifyFeed', () => {
  it('passes a clean feed', () => {
    expect(() => verifyFeed({ xml: makeXml(), pages })).not.toThrow();
  });

  it('throws on a wrong entry count', () => {
    const xml = makeXml({ entries: [makeEntry('/learn/intent/', newer)] });
    expect(() => verifyFeed({ xml, pages })).toThrow('feed.xml: has 1 entries, the page list has 2 dated pages');
  });

  it('throws on an entry for a dateless page', () => {
    const xml = makeXml({ entries: [makeEntry('/learn/intent/', newer), makeEntry('/learn/', newer)] });
    expect(() => verifyFeed({ xml, pages })).toThrow('feed.xml: has no entry for https://aidemd.dev/docs/hooks/stop/');
  });

  it('throws on an entry that is not a dated page', () => {
    const xml = makeXml({
      entries: [makeEntry('/learn/intent/', newer), makeEntry('/docs/hooks/stop/', older), makeEntry('/privacy/', older)],
    });
    const withThree = [...pages, makePage({ urlPath: '/docs/other/', kind: 'doc', modified: older })];
    expect(() => verifyFeed({ xml, pages: withThree })).toThrow('feed.xml: has no entry for https://aidemd.dev/docs/other/');
  });

  it('throws when the feed updated is not the newest date', () => {
    expect(() => verifyFeed({ xml: makeXml({ updated: older }), pages })).toThrow('feed.xml: feed <updated> is');
  });

  it('throws when an entry is stamped with a date other than its page modified date', () => {
    const xml = makeXml({ entries: [makeEntry('/learn/intent/', newer), makeEntry('/docs/hooks/stop/', '2026-11-27T09:00:00+00:00')] });
    expect(() => verifyFeed({ xml, pages })).toThrow(
      "publishSiteFiles: feed.xml: entry https://aidemd.dev/docs/hooks/stop/ <updated> is 2026-11-27T09:00:00+00:00, the page's modified date is " + older,
    );
  });

  describe('published dates', () => {
    const published = '2026-10-01T10:00:00+00:00';
    const datedPages = [
      makePage({ urlPath: '/docs/hooks/stop/', kind: 'doc', modified: older, published }),
      makePage({ urlPath: '/learn/intent/', kind: 'learn', modified: newer }),
    ];

    it('passes when the entry published date equals the page published date', () => {
      const xml = makeXml({ entries: [makeEntry('/learn/intent/', newer), makeEntry('/docs/hooks/stop/', older, published)] });
      expect(() => verifyFeed({ xml, pages: datedPages })).not.toThrow();
    });

    it('throws when an entry published date differs from its page', () => {
      const xml = makeXml({ entries: [makeEntry('/learn/intent/', newer), makeEntry('/docs/hooks/stop/', older, older)] });
      expect(() => verifyFeed({ xml, pages: datedPages })).toThrow('entry https://aidemd.dev/docs/hooks/stop/ <published> is');
    });

    it('throws when the entry has a published date and its page has none', () => {
      const xml = makeXml({ entries: [makeEntry('/learn/intent/', newer, published), makeEntry('/docs/hooks/stop/', older, published)] });
      expect(() => verifyFeed({ xml, pages: datedPages })).toThrow(
        "entry https://aidemd.dev/learn/intent/ <published> is 2026-10-01T10:00:00+00:00, the page's published date is missing",
      );
    });

    it('throws when the page has a published date and its entry has none', () => {
      const xml = makeXml({ entries: [makeEntry('/learn/intent/', newer), makeEntry('/docs/hooks/stop/', older)] });
      expect(() => verifyFeed({ xml, pages: datedPages })).toThrow(
        "entry https://aidemd.dev/docs/hooks/stop/ <published> is missing, the page's published date is " + published,
      );
    });
  });

  it.each([
    ['empty', ''],
    ['no declaration', makeXml().replace('<?xml version="1.0" encoding="utf-8"?>\n', '')],
    ['no Atom root', makeXml().replace('<feed xmlns="http://www.w3.org/2005/Atom">', '<feed>')],
    ['truncated', makeXml().replace('</feed>\n', '')],
  ])('throws on a malformed feed: %s', (_name, xml) => {
    expect(() => verifyFeed({ xml, pages })).toThrow('publishSiteFiles: feed.xml:');
  });
});
