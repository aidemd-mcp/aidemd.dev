import { describe, it, expect } from 'vitest';
import templateLabels from '@/data/learn/templateLabels';
import fixedPageCopy from '../fixedPageCopy';
import buildHomePage from './index';

describe('buildHomePage', () => {
  it('carries the fixed home copy and the home kind at /', () => {
    const page = buildHomePage();
    expect(page.urlPath).toBe('/');
    expect(page.kind).toBe('home');
    expect(page.title).toBe(fixedPageCopy.home.title);
    expect(page.description).toBe(fixedPageCopy.home.description);
  });

  it('trails home alone', () => {
    expect(buildHomePage().breadcrumb).toEqual([
      { name: templateLabels.breadcrumbHome, urlPath: '/' },
    ]);
  });

  it('shares the site card and carries no dates, markdown copy or section', () => {
    const page = buildHomePage();
    expect(page.ogImage).toBe('/og.png');
    expect(page).not.toHaveProperty('published');
    expect(page).not.toHaveProperty('modified');
    expect(page).not.toHaveProperty('markdownUrl');
    expect(page).not.toHaveProperty('section');
  });
});
