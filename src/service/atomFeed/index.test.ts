import { afterEach, describe, it, expect, vi } from 'vitest';
import siteIdentity from '@/data/siteIdentity';
import type { FeedMeta } from '@/types/feed';
import type { SitePage } from '@/types/sitePage';
import composeFeed from './index';

function makeMeta(overrides: Partial<FeedMeta> = {}): FeedMeta {
  return {
    title: 'aidemd.dev updates',
    subtitle: 'Changes to the docs and learn pages',
    siteUrl: siteIdentity.url,
    feedUrlPath: '/feed.xml',
    authorName: siteIdentity.name,
    ...overrides,
  };
}

function makePage(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/docs/hooks/stop/',
    title: 'Stop hook',
    description: 'When the stop hook fires.',
    kind: 'doc',
    ogImage: '/og/default.png',
    breadcrumb: [],
    modified: '2026-11-20T14:03:11-05:00',
    ...overrides,
  };
}

function makeMixedPages(): SitePage[] {
  return [
    makePage({ urlPath: '/', title: 'Home', kind: 'home', modified: '2026-11-25T10:00:00+00:00' }),
    makePage({ urlPath: '/brain/', title: 'Brain', kind: 'brain', modified: '2026-11-25T10:00:00+00:00' }),
    makePage({ urlPath: '/observer/', title: 'Observer', kind: 'observer', modified: '2026-11-25T10:00:00+00:00' }),
    makePage({ urlPath: '/privacy/', title: 'Privacy', kind: 'privacy', modified: '2026-11-25T10:00:00+00:00' }),
    makePage({ urlPath: '/docs/', title: 'Docs', kind: 'docsIndex', modified: undefined }),
    makePage({ urlPath: '/learn/', title: 'Learn', kind: 'learnIndex', modified: undefined }),
    makePage({ urlPath: '/docs/hooks/stop/', title: 'Stop hook', modified: '2026-11-20T14:03:11-05:00' }),
    makePage({
      urlPath: '/docs/hooks/start/',
      title: 'Start hook',
      modified: '2026-11-18T09:00:00+00:00',
      published: '2026-11-01T09:00:00+00:00',
    }),
    makePage({ urlPath: '/docs/hooks/undated/', title: 'Undated hook', modified: undefined }),
    makePage({ urlPath: '/learn/what-is-aide/', title: 'What is AIDE', kind: 'learn', modified: '2026-11-22T08:30:00+01:00' }),
    makePage({ urlPath: '/learn/intent-specs/', title: 'Intent specs', kind: 'learn', modified: '2026-11-10T12:00:00-08:00' }),
  ];
}

function entryBlocks(xml: string): string[] {
  return xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
}

function count(text: string, needle: string): number {
  return text.split(needle).length - 1;
}

afterEach(() => {
  vi.useRealTimers();
});

describe('composeFeed', () => {
  describe('entry selection', () => {
    it('lists exactly the dated docs and /learn pages, each with its own modified date', () => {
      const xml = composeFeed({ pages: makeMixedPages(), meta: makeMeta() });
      const blocks = entryBlocks(xml);

      expect(blocks).toHaveLength(4);
      expect(xml).toContain('<updated>2026-11-20T14:03:11-05:00</updated>');
      expect(xml).toContain('<updated>2026-11-18T09:00:00+00:00</updated>');
      expect(xml).toContain('<updated>2026-11-22T08:30:00+01:00</updated>');
      expect(xml).toContain('<updated>2026-11-10T12:00:00-08:00</updated>');
    });

    it('leaves out pages with no known date and non-docs pages', () => {
      const xml = composeFeed({ pages: makeMixedPages(), meta: makeMeta() });

      expect(xml).not.toContain('/docs/hooks/undated/');
      expect(xml).not.toContain('https://aidemd.dev/docs/</id>');
      expect(xml).not.toContain('https://aidemd.dev/learn/</id>');
      expect(xml).not.toContain('https://aidemd.dev/brain/');
      expect(xml).not.toContain('https://aidemd.dev/observer/');
      expect(xml).not.toContain('https://aidemd.dev/privacy/');
      expect(xml).not.toContain('<title type="text">Home</title>');
    });

    it('orders entries newest first', () => {
      const xml = composeFeed({ pages: makeMixedPages(), meta: makeMeta() });
      const ids = [...xml.matchAll(/<entry>\s*<id>([^<]+)<\/id>/g)].map((match) => match[1]);

      expect(ids).toEqual([
        'https://aidemd.dev/learn/what-is-aide/',
        'https://aidemd.dev/docs/hooks/stop/',
        'https://aidemd.dev/docs/hooks/start/',
        'https://aidemd.dev/learn/intent-specs/',
      ]);
    });
  });

  describe('true dates and determinism', () => {
    it('sets the feed updated time to the newest entry modified string', () => {
      const xml = composeFeed({ pages: makeMixedPages(), meta: makeMeta() });
      const header = xml.slice(0, xml.indexOf('<entry>'));

      expect(header).toContain('<updated>2026-11-22T08:30:00+01:00</updated>');
    });

    it('returns byte-identical output at two different clock instants and never embeds either', () => {
      const pages = makeMixedPages();
      const meta = makeMeta();

      vi.useFakeTimers();
      vi.setSystemTime(new Date('2031-03-04T05:06:07Z'));
      const first = composeFeed({ pages, meta });
      vi.setSystemTime(new Date('2044-09-10T11:12:13Z'));
      const second = composeFeed({ pages, meta });

      expect(second).toBe(first);
      expect(first).not.toContain('2031');
      expect(first).not.toContain('2044');
    });

    it('produces the same output for the same pages in a shuffled order', () => {
      const pages = makeMixedPages();
      const shuffled = [...pages].reverse();
      shuffled.push(shuffled.shift() as SitePage);

      expect(composeFeed({ pages: shuffled, meta: makeMeta() })).toBe(composeFeed({ pages, meta: makeMeta() }));
    });

    it('ends with exactly one trailing newline and uses LF only', () => {
      const xml = composeFeed({ pages: makeMixedPages(), meta: makeMeta() });

      expect(xml.endsWith('</feed>\n')).toBe(true);
      expect(xml.endsWith('\n\n')).toBe(false);
      expect(xml).not.toContain('\r');
    });
  });

  describe('canonical links, titles and summaries', () => {
    it('gives every entry id and link the site URL plus the page urlPath, ending in a slash', () => {
      const pages = makeMixedPages();
      const xml = composeFeed({ pages, meta: makeMeta() });

      for (const block of entryBlocks(xml)) {
        const id = block.match(/<id>([^<]+)<\/id>/)?.[1] ?? '';
        const href = block.match(/<link rel="alternate" type="text\/html" href="([^"]+)"\/>/)?.[1] ?? '';

        expect(id.startsWith('https://aidemd.dev/')).toBe(true);
        expect(id.endsWith('/')).toBe(true);
        expect(href).toBe(id);
        expect(pages.some((page) => `https://aidemd.dev${page.urlPath}` === id)).toBe(true);
      }
    });

    it('carries each page title and description, escaped', () => {
      const pages = [
        makePage({
          urlPath: '/docs/odd/',
          title: `Odd & <title> "quoted" 'single'`,
          description: `Summary & <b>bold</b> "q" 'a'`,
        }),
      ];
      const xml = composeFeed({ pages, meta: makeMeta() });

      expect(xml).toContain(
        '<title type="text">Odd &amp; &lt;title&gt; &quot;quoted&quot; &apos;single&apos;</title>',
      );
      expect(xml).toContain(
        '<summary type="text">Summary &amp; &lt;b&gt;bold&lt;/b&gt; &quot;q&quot; &apos;a&apos;</summary>',
      );
    });

    it('throws when a dated page urlPath lacks its trailing slash', () => {
      const pages = [makePage({ urlPath: '/docs/hooks/stop' })];

      expect(() => composeFeed({ pages, meta: makeMeta() })).toThrow('/docs/hooks/stop');
    });
  });

  describe('author', () => {
    it('credits Lowmeadow LLC at feed level and on every entry, with no email or uri', () => {
      const xml = composeFeed({ pages: makeMixedPages(), meta: makeMeta() });
      const entries = entryBlocks(xml).length;
      const names = [...xml.matchAll(/<name>([^<]*)<\/name>/g)].map((match) => match[1]);

      expect(count(xml, '<author>')).toBe(entries + 1);
      expect(names).toHaveLength(entries + 1);
      expect(names.every((name) => name === 'Lowmeadow LLC')).toBe(true);
      expect(xml).not.toContain('<email>');
      expect(xml).not.toContain('<uri>');
    });
  });

  describe('Atom structure', () => {
    it('opens with the XML declaration then the Atom feed root', () => {
      const xml = composeFeed({ pages: makeMixedPages(), meta: makeMeta() });
      const lines = xml.split('\n');

      expect(lines[0]).toBe('<?xml version="1.0" encoding="utf-8"?>');
      expect(lines[1]).toBe('<feed xmlns="http://www.w3.org/2005/Atom">');
      expect(count(xml, '<feed')).toBe(1);
      expect(count(xml, '</feed>')).toBe(1);
    });

    it('has exactly one id, title, updated and rel=self link before the first entry', () => {
      const xml = composeFeed({ pages: makeMixedPages(), meta: makeMeta() });
      const header = xml.slice(0, xml.indexOf('<entry>'));

      expect(count(header, '<id>')).toBe(1);
      expect(count(header, '<title ')).toBe(1);
      expect(count(header, '<updated>')).toBe(1);
      expect(count(header, 'rel="self"')).toBe(1);
    });

    it('gives every entry exactly one id, title, updated, alternate link, author and summary', () => {
      const xml = composeFeed({ pages: makeMixedPages(), meta: makeMeta() });

      for (const block of entryBlocks(xml)) {
        expect(count(block, '<id>')).toBe(1);
        expect(count(block, '<title ')).toBe(1);
        expect(count(block, '<updated>')).toBe(1);
        expect(count(block, 'rel="alternate"')).toBe(1);
        expect(count(block, '<author>')).toBe(1);
        expect(count(block, '<summary ')).toBe(1);
      }
    });

    it('leaves no raw markup characters or unescaped ampersands in any text node', () => {
      const pages = [
        makePage({
          urlPath: '/docs/odd/',
          title: `A & B < C > D " E ' F`,
          description: `1 & 2 < 3 > 4 " 5 ' 6`,
        }),
      ];
      const xml = composeFeed({
        pages,
        meta: makeMeta({ title: 'Feed & <friends>', subtitle: `It's "great" & more` }),
      });

      const textOnly = xml.replace(/<\/?[a-zA-Z?][^<>]*>/g, '');

      expect(textOnly).not.toMatch(/[<>]/);
      expect(textOnly).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
    });
  });

  describe('no true date available', () => {
    it('throws rather than returning a feed when no docs or /learn page has a modified date', () => {
      const pages = [
        makePage({ urlPath: '/docs/a/', modified: undefined }),
        makePage({ urlPath: '/learn/b/', kind: 'learn', modified: undefined }),
        makePage({ urlPath: '/', kind: 'home', title: 'Home', modified: '2026-11-25T10:00:00+00:00' }),
      ];

      expect(() => composeFeed({ pages, meta: makeMeta() })).toThrow(
        'atomFeed: no docs or /learn page has a known modified date; the feed has no true updated time',
      );
    });

    it('throws on an empty page list', () => {
      expect(() => composeFeed({ pages: [], meta: makeMeta() })).toThrow('atomFeed:');
    });
  });
});
