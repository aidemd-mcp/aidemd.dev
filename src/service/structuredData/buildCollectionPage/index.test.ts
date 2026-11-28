import { describe, expect, it } from 'vitest';
import type { SitePage } from '@/types/sitePage';
import buildCollectionPage from './index';

function makeSitePage(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/learn/',
    title: 'Learn',
    description: 'Plain-language explainers.',
    kind: 'learnIndex',
    ogImage: '/og/learn.png',
    breadcrumb: [
      { name: 'Home', urlPath: '/' },
      { name: 'Learn', urlPath: '/learn/' },
    ],
    ...overrides,
  };
}

describe('buildCollectionPage', () => {
  it('builds the collection record from the page', () => {
    expect(buildCollectionPage(makeSitePage())).toEqual({
      '@type': 'CollectionPage',
      name: 'Learn',
      description: 'Plain-language explainers.',
      url: 'https://aidemd.dev/learn/',
      isPartOf: { '@id': 'https://aidemd.dev/#website' },
      publisher: { '@id': 'https://aidemd.dev/#organization' },
    });
  });

  it('carries no date key even when the page has dates', () => {
    const page = makeSitePage({
      published: '2026-01-02T03:04:05+00:00',
      modified: '2026-02-03T04:05:06+00:00',
    });
    const keys = Object.keys(buildCollectionPage(page));
    expect(keys).not.toContain('datePublished');
    expect(keys).not.toContain('dateModified');
  });
});
