import { describe, it, expect } from 'vitest';
import type { LlmsPage } from '@/types/llmsTxt';
import buildSections from './index';

function makePage(overrides: Partial<LlmsPage> = {}): LlmsPage {
  return {
    urlPath: '/',
    title: 'Page',
    description: 'A page.',
    kind: 'home',
    breadcrumb: [],
    ...overrides,
  };
}

function makeSiteList(): LlmsPage[] {
  const sectionOne = makePage({ urlPath: '/docs/methodology/', title: 'Methodology', kind: 'docsSection' });
  const sectionTwo = makePage({ urlPath: '/docs/commands/', title: 'Commands', kind: 'docsSection' });
  const inSection = (section: LlmsPage) => [{ name: section.title, urlPath: section.urlPath }];
  return [
    makePage(),
    makePage({ urlPath: '/docs/', title: 'Docs', kind: 'docsIndex' }),
    sectionOne,
    makePage({
      urlPath: '/docs/methodology/index/',
      title: 'Methodology index',
      kind: 'doc',
      breadcrumb: inSection(sectionOne),
    }),
    makePage({
      urlPath: '/docs/methodology/aide-spec/',
      title: 'AIDE spec',
      kind: 'doc',
      breadcrumb: inSection(sectionOne),
    }),
    sectionTwo,
    makePage({
      urlPath: '/docs/commands/aide/',
      title: 'aide',
      kind: 'doc',
      breadcrumb: inSection(sectionTwo),
    }),
    makePage({ urlPath: '/learn/', title: 'Learn', kind: 'learnIndex' }),
    makePage({ urlPath: '/learn/first/', title: 'First', kind: 'learn' }),
    makePage({ urlPath: '/learn/second/', title: 'Second', kind: 'learn' }),
    makePage({ urlPath: '/brain/', title: 'Brain', kind: 'brain' }),
    makePage({ urlPath: '/brain/recipes/', title: 'Recipes', kind: 'brainRecipes' }),
    makePage({ urlPath: '/observer/', title: 'Observer', kind: 'observer' }),
    makePage({ urlPath: '/privacy/', title: 'Privacy', kind: 'privacy' }),
  ];
}

const urlPathsOf = (heading: string, pages: LlmsPage[]) =>
  buildSections({ pages })
    .find((section) => section.heading === heading)!
    .entries.map((entry) => entry.urlPath);

describe('buildSections', () => {
  it('orders headings as docs sections, Learn, then Optional', () => {
    const headings = buildSections({ pages: makeSiteList() }).map((section) => section.heading);
    expect(headings).toEqual(['Methodology', 'Commands', 'Learn', 'Optional']);
  });

  it('starts each docs section with its section page, followed by its docs in list order', () => {
    expect(urlPathsOf('Methodology', makeSiteList())).toEqual([
      '/docs/methodology/',
      '/docs/methodology/index/',
      '/docs/methodology/aide-spec/',
    ]);
    expect(urlPathsOf('Commands', makeSiteList())).toEqual(['/docs/commands/', '/docs/commands/aide/']);
  });

  it('keeps a doc listed earlier in the input before its sibling', () => {
    const pages = makeSiteList();
    const [first, second] = [pages[3]!, pages[4]!];
    const swapped = [...pages.slice(0, 3), second, first, ...pages.slice(5)];
    expect(urlPathsOf('Methodology', swapped)).toEqual([
      '/docs/methodology/',
      '/docs/methodology/aide-spec/',
      '/docs/methodology/index/',
    ]);
  });

  it('starts Learn with the learn index followed by the learn pages', () => {
    expect(urlPathsOf('Learn', makeSiteList())).toEqual(['/learn/', '/learn/first/', '/learn/second/']);
  });

  it('puts exactly observer and brain in Optional', () => {
    expect(urlPathsOf('Optional', makeSiteList()).sort()).toEqual(['/brain/', '/observer/']);
  });

  it('places no home, docs index, brain recipes or privacy page', () => {
    const placed = buildSections({ pages: makeSiteList() }).flatMap((section) =>
      section.entries.map((entry) => entry.kind),
    );
    for (const kind of ['home', 'docsIndex', 'brainRecipes', 'privacy'])
      expect(placed).not.toContain(kind);
  });

  it('sets every entry url to the origin plus its urlPath', () => {
    for (const section of buildSections({ pages: makeSiteList() }))
      for (const entry of section.entries) expect(entry.url).toBe(`https://aidemd.dev${entry.urlPath}`);
  });

  it('adds a third learn page to Learn with no other change', () => {
    const pages = makeSiteList();
    const withThird = [...pages, makePage({ urlPath: '/learn/third/', title: 'Third', kind: 'learn' })];
    expect(urlPathsOf('Learn', withThird)).toEqual([
      '/learn/',
      '/learn/first/',
      '/learn/second/',
      '/learn/third/',
    ]);
    expect(urlPathsOf('Methodology', withThird)).toEqual(urlPathsOf('Methodology', pages));
  });

  it('removes a doc from its section when it leaves the list', () => {
    const pages = makeSiteList().filter((page) => page.urlPath !== '/docs/methodology/aide-spec/');
    expect(urlPathsOf('Methodology', pages)).toEqual(['/docs/methodology/', '/docs/methodology/index/']);
  });

  it('throws naming the urlPath for a doc whose breadcrumb names no section', () => {
    const pages = [...makeSiteList(), makePage({ urlPath: '/docs/stray/', kind: 'doc', breadcrumb: [] })];
    expect(() => buildSections({ pages })).toThrow('/docs/stray/');
  });

  it.each([
    ['learnIndex'],
    ['observer'],
    ['brain'],
    ['docsSection'],
  ])('throws naming the missing kind when the list has no %s page', (kind) => {
    const pages = makeSiteList().filter((page) => page.kind !== kind);
    expect(() => buildSections({ pages })).toThrow(kind);
  });
});
