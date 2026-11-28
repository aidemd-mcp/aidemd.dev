import { describe, expect, it } from 'vitest';
import type { SitePage } from '@/types/sitePage';
import buildArticle from './index';

function makeSitePage(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/docs/hooks/stop/',
    title: 'Stop hook',
    description: 'What the stop hook does.',
    kind: 'doc',
    ogImage: '/og/stop.png',
    breadcrumb: [
      { name: 'Home', urlPath: '/' },
      { name: 'Stop hook', urlPath: '/docs/hooks/stop/' },
    ],
    ...overrides,
  };
}

describe('buildArticle', () => {
  it('is a TechArticle for a doc page', () => {
    expect(buildArticle({ page: makeSitePage(), headline: 'H' })['@type']).toBe('TechArticle');
  });

  it('is an Article for a learn page', () => {
    const page = makeSitePage({ kind: 'learn', urlPath: '/learn/x/' });
    expect(buildArticle({ page, headline: 'H' })['@type']).toBe('Article');
  });

  it('throws for a kind that has no article', () => {
    const page = makeSitePage({ kind: 'home', urlPath: '/' });
    expect(() => buildArticle({ page, headline: 'H' })).toThrow(
      'structuredData: no article for page kind home',
    );
  });

  it('copies present dates verbatim', () => {
    const page = makeSitePage({
      published: '2026-01-02T03:04:05+00:00',
      modified: '2026-02-03T04:05:06+00:00',
    });
    const node = buildArticle({ page, headline: 'H' });
    expect(node.datePublished).toBe('2026-01-02T03:04:05+00:00');
    expect(node.dateModified).toBe('2026-02-03T04:05:06+00:00');
  });

  it('omits date keys when the page has no true date', () => {
    const keys = Object.keys(buildArticle({ page: makeSitePage(), headline: 'H' }));
    expect(keys).not.toContain('datePublished');
    expect(keys).not.toContain('dateModified');
  });

  it('credits the organization and website by bare @id reference', () => {
    const node = buildArticle({ page: makeSitePage(), headline: 'H' });
    expect(node.author).toEqual({ '@id': 'https://aidemd.dev/#organization' });
    expect(node.publisher).toEqual({ '@id': 'https://aidemd.dev/#organization' });
    expect(node.isPartOf).toEqual({ '@id': 'https://aidemd.dev/#website' });
    expect(Object.keys(node.author)).toHaveLength(1);
    expect(Object.keys(node.publisher)).toHaveLength(1);
    expect(Object.keys(node.isPartOf)).toHaveLength(1);
  });

  it('keeps the trailing slash on url and mainEntityOfPage and uses the headline and description', () => {
    const node = buildArticle({ page: makeSitePage(), headline: 'The headline' });
    expect(node.url).toBe('https://aidemd.dev/docs/hooks/stop/');
    expect(node.mainEntityOfPage).toBe('https://aidemd.dev/docs/hooks/stop/');
    expect(node.headline).toBe('The headline');
    expect(node.description).toBe('What the stop hook does.');
  });
});
