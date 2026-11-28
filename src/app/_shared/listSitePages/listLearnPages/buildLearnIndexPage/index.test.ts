import { describe, it, expect } from 'vitest';
import learnIndex from '@/data/learn/learnIndex';
import templateLabels from '@/data/learn/templateLabels';
import buildLearnIndexPage from './index';

describe('buildLearnIndexPage', () => {
  it('carries the learn index copy and the learnIndex kind at /learn/', () => {
    const page = buildLearnIndexPage();
    expect(page.urlPath).toBe('/learn/');
    expect(page.kind).toBe('learnIndex');
    expect(page.title).toBe(learnIndex.title);
    expect(page.description).toBe(learnIndex.description);
    expect(page.section).toBe('learn');
  });

  it('trails home then learn', () => {
    expect(buildLearnIndexPage().breadcrumb).toEqual([
      { name: templateLabels.breadcrumbHome, urlPath: '/' },
      { name: templateLabels.breadcrumbLearn, urlPath: '/learn/' },
    ]);
  });

  it('has a generated share card and carries no dates or markdown copy', () => {
    const page = buildLearnIndexPage();
    expect(page.ogImage).toMatch(/^\/og\/[a-z0-9-]+-[0-9a-f]{10}\.png$/);
    expect(page).not.toHaveProperty('published');
    expect(page).not.toHaveProperty('modified');
    expect(page).not.toHaveProperty('markdownUrl');
  });
});
