import { describe, it, expect } from 'vitest';
import siteIdentity from '@/data/siteIdentity';
import type { SitePage, SitePageKind } from '@/types/sitePage';
import formatDocumentTitle from './index';

function makePage(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/docs/hooks/stop/',
    title: 'Stop hook',
    description: 'What the Stop hook does.',
    kind: 'doc',
    ogImage: '/og.png',
    breadcrumb: [],
    ...overrides,
  };
}

describe('formatDocumentTitle', () => {
  it.each<SitePageKind>([
    'home',
    'docsIndex',
    'docsSection',
    'doc',
    'brain',
    'brainRecipes',
    'privacy',
    'learnIndex',
    'learn',
  ])('appends the site name for kind %s', (kind) => {
    expect(formatDocumentTitle(makePage({ kind, title: 'A title' }))).toBe(`A title | ${siteIdentity.siteName}`);
  });

  it('uses the observer title as written', () => {
    expect(formatDocumentTitle(makePage({ kind: 'observer', title: 'Observer — aidemd.dev' }))).toBe(
      'Observer — aidemd.dev',
    );
  });
});
