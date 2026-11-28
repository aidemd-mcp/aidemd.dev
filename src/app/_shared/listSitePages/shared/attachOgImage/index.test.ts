import { describe, it, expect } from 'vitest';
import type { SitePage } from '@/types/sitePage';
import ogCardAddress from '@/service/socialShare/ogCardAddress';
import attachOgImage from './index';

function makePage(overrides: Partial<Omit<SitePage, 'ogImage'>> = {}): Omit<SitePage, 'ogImage'> {
  return {
    urlPath: '/docs/methodology/aide-spec/',
    title: 'AIDE spec',
    description: 'The spec.',
    kind: 'doc',
    section: 'methodology',
    breadcrumb: [{ name: 'AIDE', urlPath: '/' }],
    ...overrides,
  };
}

describe('attachOgImage', () => {
  it('gives a doc page the address ogCardAddress computes', () => {
    const page = makePage();
    const result = attachOgImage(page);
    expect(result.ogImage).toMatch(/^\/og\/docs-methodology-aide-spec-[0-9a-f]{10}\.png$/);
    expect(result.ogImage).toBe(
      ogCardAddress({ urlPath: page.urlPath, kind: page.kind, title: page.title, section: page.section }),
    );
  });

  it('keeps every other field of the page', () => {
    const page = makePage();
    expect(attachOgImage(page)).toMatchObject(page);
  });

  it('gives a home page the shared site card', () => {
    const result = attachOgImage(makePage({ urlPath: '/', kind: 'home', section: undefined }));
    expect(result.ogImage).toBe('/og.png');
  });

  it('throws for the observer, which has no card', () => {
    expect(() => attachOgImage(makePage({ urlPath: '/observer/', kind: 'observer', section: undefined }))).toThrow(
      'listSitePages: no share card for /observer/',
    );
  });
});
