import { describe, it, expect } from 'vitest';
import type { LlmsPage } from '@/types/llmsTxt';
import composeLlmsFiles from './index';

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
    makePage({ title: 'Home' }),
    makePage({ urlPath: '/docs/', title: 'Docs', kind: 'docsIndex' }),
    sectionOne,
    makePage({
      urlPath: '/docs/methodology/aide-spec/',
      title: 'AIDE spec',
      description: 'The spec format.',
      kind: 'doc',
      breadcrumb: inSection(sectionOne),
      markdown: '# AIDE spec\n\nSPEC-BODY-TEXT\n',
    }),
    sectionTwo,
    makePage({
      urlPath: '/docs/commands/aide/',
      title: 'aide',
      description: 'The orchestrator command.',
      kind: 'doc',
      breadcrumb: inSection(sectionTwo),
      markdown: 'COMMAND-BODY-TEXT\n',
    }),
    makePage({ urlPath: '/learn/', title: 'Learn', kind: 'learnIndex' }),
    makePage({
      urlPath: '/learn/what-is-aide/',
      title: 'What is AIDE',
      description: 'An introduction.',
      kind: 'learn',
      markdown: '# What is AIDE\n\nLEARN-ONE-TEXT\n',
    }),
    makePage({
      urlPath: '/learn/why-intent/',
      title: 'Why intent',
      description: 'Why specs.',
      kind: 'learn',
      markdown: 'LEARN-TWO-TEXT\n',
    }),
    makePage({ urlPath: '/brain/', title: 'Brain', kind: 'brain' }),
    makePage({ urlPath: '/brain/recipes/', title: 'Brain recipes', kind: 'brainRecipes' }),
    makePage({ urlPath: '/observer/', title: 'Observer', kind: 'observer' }),
    makePage({ urlPath: '/privacy/', title: 'Privacy', kind: 'privacy' }),
  ];
}

describe('composeLlmsFiles', () => {
  it('orders the llms.txt H2s as the docs sections, Learn, Optional', () => {
    const { llmsTxt } = composeLlmsFiles({ pages: makeSiteList() });
    const headings = llmsTxt.split('\n').filter(line => line.startsWith('## '));
    expect(headings).toEqual(['## Methodology', '## Commands', '## Learn', '## Optional']);
  });

  it('lists observer, brain and the learn index, and omits home, docs index, brain recipes and privacy', () => {
    const { llmsTxt } = composeLlmsFiles({ pages: makeSiteList() });
    expect(llmsTxt).toContain('https://aidemd.dev/observer/');
    expect(llmsTxt).toContain('https://aidemd.dev/brain/)');
    expect(llmsTxt).toContain('https://aidemd.dev/learn/)');
    expect(llmsTxt).not.toContain('https://aidemd.dev/brain/recipes/');
    expect(llmsTxt).not.toContain('https://aidemd.dev/privacy/');
    expect(llmsTxt).not.toContain('https://aidemd.dev/docs/)');
    expect(llmsTxt).not.toContain('https://aidemd.dev/)');
  });

  it.each(['SPEC-BODY-TEXT', 'COMMAND-BODY-TEXT', 'LEARN-ONE-TEXT', 'LEARN-TWO-TEXT'])(
    'carries %s in llms-full.txt',
    text => {
      const { llmsFullTxt } = composeLlmsFiles({ pages: makeSiteList() });
      expect(llmsFullTxt).toContain(text);
    },
  );

  it.each(['llmsTxt', 'llmsFullTxt'] as const)('%s has no AIDEY, no standalone AID and no .md link', key => {
    const output = composeLlmsFiles({ pages: makeSiteList() })[key];
    expect(output).not.toMatch(/AIDEY/);
    expect(output).not.toMatch(/\bAID\b/);
    expect(output).not.toMatch(/\]\([^)]*\.md\)/);
  });

  it.each(['llmsTxt', 'llmsFullTxt'] as const)('every link and Source URL in %s ends in a trailing slash', key => {
    const output = composeLlmsFiles({ pages: makeSiteList() })[key];
    // Link targets and Source lines only — the fixed preamble prose mentions the bare site origin.
    const urls = output.match(/(?<=\]\()https:\/\/aidemd\.dev[^)\s]*|(?<=^Source: )https:\/\/aidemd\.dev\S*/gm) ?? [];
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) expect(url).toMatch(/^https:\/\/aidemd\.dev\/.*\/$/);
  });

  it('throws naming the url when a learn page has no markdown', () => {
    const pages = makeSiteList().map(page =>
      page.urlPath === '/learn/why-intent/' ? { ...page, markdown: undefined } : page,
    );
    expect(() => composeLlmsFiles({ pages })).toThrow('https://aidemd.dev/learn/why-intent/');
  });
});
