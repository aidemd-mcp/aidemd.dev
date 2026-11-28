import { describe, it, expect } from 'vitest';
import type { SitePage } from '@/types/sitePage';
import assertSitePages from './index';

function makePage(overrides: Partial<SitePage> = {}): SitePage {
  const urlPath = overrides.urlPath ?? '/docs/hooks/stop/';
  return {
    urlPath,
    kind: 'doc',
    title: 'Stop hook',
    description: 'What the stop hook does.',
    markdownUrl: urlPath === '/' ? undefined : `${urlPath.slice(0, -1)}.md`,
    ogImage: `/og/${urlPath.replace(/\//g, '-').replace(/^-|-$/g, '') || 'home'}-0123456789.png`,
    breadcrumb: [
      { name: 'AIDE', urlPath: '/' },
      { name: 'Stop hook', urlPath },
    ],
    published: '2026-01-01T00:00:00+00:00',
    modified: '2026-02-01T00:00:00+00:00',
    ...overrides,
  };
}

function makeHome(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/',
    kind: 'home',
    title: 'AIDE',
    description: 'Home.',
    ogImage: '/og.png',
    breadcrumb: [{ name: 'home', urlPath: '/' }],
    ...overrides,
  };
}

describe('assertSitePages', () => {
  it('accepts a clean list', () => {
    const pages = [makeHome(), makePage(), makePage({ urlPath: '/docs/hooks/start/' })];
    expect(() => assertSitePages(pages)).not.toThrow();
  });

  it('accepts a dateless doc and a shared non-card image', () => {
    const { published, modified, ...datelessFields } = makePage();
    const doc: SitePage = datelessFields;
    const observer = makePage({
      urlPath: '/observer/',
      kind: 'observer',
      markdownUrl: undefined,
      ogImage: '/observer/capture.png',
      published: undefined,
      modified: undefined,
    });
    expect(() => assertSitePages([makeHome(), doc, observer])).not.toThrow();
  });

  const stopPath = makePage().urlPath;
  it.each<[string, SitePage[], string]>([
    ['no trailing slash', [makePage({ urlPath: '/docs/hooks/stop' })], 'urlPath is not a lowercase path with leading and trailing slash'],
    ['no leading slash', [makePage({ urlPath: 'docs/hooks/stop/' })], 'urlPath is not a lowercase path with leading and trailing slash'],
    ['uppercase', [makePage({ urlPath: '/docs/Hooks/' })], 'urlPath is not a lowercase path with leading and trailing slash'],
    ['listed twice', [makePage(), makePage({ ogImage: '/og/other-0123456789.png' })], 'urlPath is listed twice'],
    ['the 404', [makePage({ urlPath: '/404/' })], 'urlPath is not indexable'],
    ['a dynamic segment', [makePage({ urlPath: '/docs/[slug]/' })], 'urlPath is not indexable'],
    ['empty title', [makePage({ title: ' ' })], 'title is empty or not single-line'],
    ['multi-line title', [makePage({ title: 'a\nb' })], 'title is empty or not single-line'],
    ['empty description', [makePage({ description: '' })], 'description is empty or not single-line'],
    ['multi-line description', [makePage({ description: 'a\r\nb' })], 'description is empty or not single-line'],
    ['empty breadcrumb', [makePage({ breadcrumb: [] })], 'breadcrumb is empty'],
    [
      'breadcrumb not starting at home',
      [makePage({ breadcrumb: [{ name: 'DOCS', urlPath: '/docs/' }, { name: 'x', urlPath: stopPath }] })],
      'breadcrumb does not start at home',
    ],
    [
      'breadcrumb ending at another page',
      [makePage({ breadcrumb: [{ name: 'AIDE', urlPath: '/' }, { name: 'x', urlPath: '/docs/hooks/start/' }] })],
      'breadcrumb does not end at the page',
    ],
    [
      'breadcrumb item without trailing slash',
      [
        makePage({
          breadcrumb: [
            { name: 'AIDE', urlPath: '/' },
            { name: 'DOCS', urlPath: '/docs' },
            { name: 'x', urlPath: stopPath },
          ],
        }),
      ],
      'breadcrumb item without trailing slash',
    ],
    [
      'doc without markdown copy',
      [makePage({ markdownUrl: undefined })],
      'markdownUrl is missing',
    ],
    [
      'learn without markdown copy',
      [makePage({ urlPath: '/learn/x/', kind: 'learn', markdownUrl: undefined })],
      'markdownUrl is missing',
    ],
    [
      'index with a markdown copy',
      [makePage({ kind: 'docsSection', published: undefined, modified: undefined })],
      'markdownUrl is present on a page with no markdown copy',
    ],
    [
      'markdown copy of another page',
      [makePage({ markdownUrl: '/docs/hooks/start.md' })],
      'markdownUrl belongs to another page',
    ],
    [
      'published on a dateless kind',
      [makeHome({ published: '2026-01-01T00:00:00+00:00' })],
      'dates are present on a page with no single content source',
    ],
    [
      'modified on a dateless kind',
      [makeHome({ modified: '2026-01-01T00:00:00+00:00' })],
      'dates are present on a page with no single content source',
    ],
    ['relative image', [makePage({ ogImage: 'og/a.png' })], 'ogImage is not root-relative'],
    [
      'generated card shared by two pages',
      [makePage(), makePage({ urlPath: '/docs/hooks/start/', ogImage: makePage().ogImage })],
      'ogImage is shared with another page',
    ],
  ])('throws for %s', (_label, pages, rule) => {
    const failing = pages[pages.length - 1].urlPath;
    expect(() => assertSitePages(pages)).toThrow(`listSitePages: ${rule} at ${failing}`);
  });

  it('names the first broken page, not a later one', () => {
    const pages = [makePage({ title: '' }), makePage({ urlPath: '/docs/hooks/start/', description: '' })];
    expect(() => assertSitePages(pages)).toThrow('title is empty or not single-line at /docs/hooks/stop/');
  });
});
