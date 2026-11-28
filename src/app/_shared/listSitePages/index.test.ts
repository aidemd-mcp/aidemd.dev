import { describe, it, expect, beforeAll } from 'vitest';
import buildRegistry from '@/service/docsRegistry';
import learnRoster from '@/data/learn';
import type { SitePage, SitePageKind } from '@/types/sitePage';
import listSitePages from './index';

const GENERATED_CARD = /^\/og\/[a-z0-9_-]+-[0-9a-f]{10}\.png$/;

let pages: SitePage[];

function ofKind(kind: SitePageKind): SitePage[] {
  return pages.filter((page) => page.kind === kind);
}

beforeAll(async () => {
  pages = await listSitePages();
});

describe('listSitePages (the real list)', () => {
  it.each<SitePageKind>(['home', 'docsIndex', 'brain', 'brainRecipes', 'observer', 'privacy', 'learnIndex'])(
    'lists exactly one %s page',
    (kind) => {
      expect(ofKind(kind)).toHaveLength(1);
    },
  );

  it('lists six docs section indexes', () => {
    expect(ofKind('docsSection')).toHaveLength(6);
  });

  it('lists one doc page per registry route', async () => {
    const { routes } = await buildRegistry();
    expect(ofKind('doc')).toHaveLength(routes.length);
  });

  it('lists the six /learn pages in roster order', () => {
    expect(ofKind('learn').map((page) => page.urlPath)).toEqual(learnRoster.map((entry) => entry.urlPath));
    expect(ofKind('learn')).toHaveLength(6);
  });

  it('includes the fixed canonical paths', () => {
    const paths = pages.map((page) => page.urlPath);
    expect(paths).toEqual(
      expect.arrayContaining([
        '/',
        '/docs/',
        '/docs/hooks/',
        '/brain/recipes/',
        '/observer/',
        '/privacy/',
        '/learn/',
        '/learn/intent-driven-engineering/',
      ]),
    );
  });

  it('lists every urlPath once', () => {
    const paths = pages.map((page) => page.urlPath);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('puts home first and each docs section index before its docs', () => {
    expect(pages[0].urlPath).toBe('/');
    expect(pages[1].urlPath).toBe('/docs/');
    for (const doc of ofKind('doc')) {
      const sectionPath = doc.breadcrumb[2].urlPath;
      expect(pages.findIndex((page) => page.urlPath === sectionPath)).toBeLessThan(
        pages.findIndex((page) => page.urlPath === doc.urlPath),
      );
    }
  });

  it('gives every doc page the dates its registry route carries', async () => {
    const { routes } = await buildRegistry();
    const byPath = new Map(routes.map((route) => [`${route.urlPath}/`, route]));
    for (const doc of ofKind('doc')) {
      const route = byPath.get(doc.urlPath)!;
      expect(doc.published).toBe(route.published);
      expect(doc.modified).toBe(route.modified);
    }
  });

  it.each<SitePageKind>(['home', 'docsIndex', 'brain', 'brainRecipes', 'observer', 'privacy', 'learnIndex'])(
    'carries no modified date on the %s page',
    (kind) => {
      expect(ofKind(kind)[0].modified).toBeUndefined();
      expect(ofKind(kind)[0].published).toBeUndefined();
    },
  );

  it('carries a markdown copy link exactly on doc and learn pages', () => {
    for (const page of pages) {
      const hasCopy = page.kind === 'doc' || page.kind === 'learn';
      expect(page.markdownUrl !== undefined).toBe(hasCopy);
    }
  });

  it('gives every generated-card page a content-hashed card address', () => {
    const carded = pages.filter((page) =>
      ['docsSection', 'doc', 'learnIndex', 'learn'].includes(page.kind),
    );
    for (const page of carded) {
      expect(page.ogImage).toMatch(GENERATED_CARD);
    }
  });

  it('returns the same array instance on every call', async () => {
    expect(await listSitePages()).toBe(pages);
  });
});
