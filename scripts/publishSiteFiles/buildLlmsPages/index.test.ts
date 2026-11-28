import { describe, expect, it } from 'vitest';
import type { SitePage, SitePageKind } from '@/types/sitePage';
import buildLlmsPages from './index';

function makePage(kind: SitePageKind, urlPath: string): SitePage {
  return {
    urlPath,
    title: `Title ${urlPath}`,
    description: `Description ${urlPath}`,
    kind,
    ogImage: '/og.png',
    breadcrumb: [{ name: 'Home', urlPath: '/' }],
  };
}

describe('buildLlmsPages', () => {
  const pages = [
    makePage('home', '/'),
    makePage('doc', '/docs/hooks/stop/'),
    makePage('privacy', '/privacy/'),
    makePage('learn', '/learn/intent-driven-engineering/'),
  ];
  const markdown = new Map([
    ['/docs/hooks/stop/', '# Stop\n'],
    ['/learn/intent-driven-engineering/', '# Intent\n'],
  ]);

  it('keeps the page list order', () => {
    expect(buildLlmsPages({ pages, markdown }).map((page) => page.urlPath)).toEqual(
      pages.map((page) => page.urlPath),
    );
  });

  it('attaches markdown only to doc and learn pages', () => {
    const records = buildLlmsPages({ pages, markdown });
    expect(records.map((record) => record.markdown)).toEqual([undefined, '# Stop\n', undefined, '# Intent\n']);
    expect('markdown' in records[0]).toBe(false);
  });

  it('carries title, description, kind and breadcrumb through', () => {
    const [home] = buildLlmsPages({ pages, markdown });
    expect(home).toEqual({
      urlPath: '/',
      title: 'Title /',
      description: 'Description /',
      kind: 'home',
      breadcrumb: [{ name: 'Home', urlPath: '/' }],
    });
  });

  it.each([
    ['doc', '/docs/hooks/stop/'],
    ['learn', '/learn/intent-driven-engineering/'],
  ] as const)('throws naming the urlPath when a %s page has no markdown entry', (kind, urlPath) => {
    expect(() => buildLlmsPages({ pages: [makePage(kind, urlPath)], markdown: new Map() })).toThrow(urlPath);
  });
});
