import { describe, it, expect } from 'vitest';
import { DOCS_CATEGORIES, SECTION_INDEX_META } from '@/data/docsCategories';
import buildDocsSectionPage from './index';

describe('buildDocsSectionPage', () => {
  it.each(DOCS_CATEGORIES.map((category) => [category.section, category] as const))(
    'builds the %s section index from its category and metadata',
    (section, category) => {
      const meta = SECTION_INDEX_META[section];
      const urlPath = `/docs/${category.urlSegment}/`;
      const page = buildDocsSectionPage(category);
      expect(page.urlPath).toBe(urlPath);
      expect(page.kind).toBe('docsSection');
      expect(page.title).toBe(meta.label);
      expect(page.description).toBe(meta.lede);
      expect(page.breadcrumb).toEqual([
        { name: 'AIDE', urlPath: '/' },
        { name: 'DOCS', urlPath: '/docs/' },
        { name: meta.label.toUpperCase(), urlPath },
      ]);
    },
  );

  it('has a generated share card and no dates, markdown copy or section', () => {
    const page = buildDocsSectionPage(DOCS_CATEGORIES[0]);
    expect(page.ogImage).toMatch(/^\/og\/docs-methodology-[0-9a-f]{10}\.png$/);
    expect(page).not.toHaveProperty('published');
    expect(page).not.toHaveProperty('modified');
    expect(page).not.toHaveProperty('markdownUrl');
    expect(page).not.toHaveProperty('section');
  });
});
