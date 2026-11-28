import { describe, it, expect } from 'vitest';
import type { SitePage } from '@/types/sitePage';
import ogCardAddress from '../../ogCardAddress';
import selectOgCards from './index';

function makeSitePage(overrides: Partial<SitePage> = {}): SitePage {
  const page: SitePage = {
    urlPath: '/docs/methodology/aide-spec/',
    title: 'AIDE spec',
    description: 'The intent spec.',
    kind: 'doc',
    section: 'methodology',
    ogImage: '/og.png',
    breadcrumb: [],
    ...overrides,
  };
  if (overrides.ogImage === undefined) page.ogImage = ogCardAddress(page) ?? '/og.png';
  return page;
}

describe('selectOgCards', () => {
  it('yields exactly the site card for no pages', () => {
    expect(selectOgCards([])).toEqual([{ layout: 'site', address: '/og.png', label: 'site card' }]);
  });

  it('puts the site card first and keeps page jobs in input order', () => {
    const first = makeSitePage({ urlPath: '/docs/methodology/b/', title: 'B' });
    const second = makeSitePage({ urlPath: '/docs/methodology/a/', title: 'A' });

    const jobs = selectOgCards([first, second]);

    expect(jobs.map((job) => job.label)).toEqual(['site card', '/docs/methodology/b/', '/docs/methodology/a/']);
    expect(jobs[0]).toEqual({ layout: 'site', address: '/og.png', label: 'site card' });
    expect(jobs[1]).toEqual({
      layout: 'page',
      address: first.ogImage,
      label: '/docs/methodology/b/',
      page: { urlPath: '/docs/methodology/b/', kind: 'doc', title: 'B', section: 'methodology' },
    });
  });

  it('yields no job for observer', () => {
    const observer = makeSitePage({ urlPath: '/observer/', kind: 'observer', section: undefined, ogImage: '/anything.png' });

    expect(selectOgCards([observer])).toHaveLength(1);
  });

  it('adds no job for a site-card page whose record points at /og.png', () => {
    const home = makeSitePage({ urlPath: '/', kind: 'home', section: undefined, ogImage: '/og.png' });

    expect(selectOgCards([home])).toHaveLength(1);
  });

  it('throws naming the urlPath when a page record differs from its computed address', () => {
    const page = makeSitePage({ ogImage: '/og/stale-0000000000.png' });

    expect(() => selectOgCards([page])).toThrow(
      `share-image address mismatch for /docs/methodology/aide-spec/: record has /og/stale-0000000000.png, expected ${ogCardAddress(page)}`,
    );
  });

  it('throws when a site-kind record has an ogImage other than /og.png', () => {
    const home = makeSitePage({ urlPath: '/', kind: 'home', section: undefined, ogImage: '/og/home-0000000000.png' });

    expect(() => selectOgCards([home])).toThrow(
      'share-image address mismatch for /: record has /og/home-0000000000.png, expected /og.png',
    );
  });

  it('throws naming both urlPaths when two records produce one address', () => {
    const first = makeSitePage();
    const second = { ...first };

    expect(() => selectOgCards([first, second])).toThrow(
      `share-image address collision at ${first.ogImage}: ${first.urlPath} and ${second.urlPath}`,
    );
  });
});
