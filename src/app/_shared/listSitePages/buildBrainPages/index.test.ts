import { describe, it, expect } from 'vitest';
import templateLabels from '@/data/learn/templateLabels';
import { OG_DESCRIPTION, PAGE_TITLE_A, PAGE_TITLE_B } from '@/app/brain/_data/brainCopy';
import fixedPageCopy from '../fixedPageCopy';
import buildBrainPages from './index';

describe('buildBrainPages', () => {
  const [brain, recipes] = buildBrainPages();

  it('returns /brain then /brain/recipes with their kinds', () => {
    expect([brain.urlPath, brain.kind]).toEqual(['/brain/', 'brain']);
    expect([recipes.urlPath, recipes.kind]).toEqual(['/brain/recipes/', 'brainRecipes']);
  });

  it('titles and describes from the brain copy module', () => {
    expect(brain.title).toBe(PAGE_TITLE_A);
    expect(brain.description).toBe(OG_DESCRIPTION);
    expect(recipes.title).toBe(PAGE_TITLE_B);
    expect(recipes.description).toBe(OG_DESCRIPTION);
  });

  it('trails home then brain, and home then brain then recipes', () => {
    const home = { name: templateLabels.breadcrumbHome, urlPath: '/' };
    const crumb = { name: fixedPageCopy.brainCrumb, urlPath: '/brain/' };
    expect(brain.breadcrumb).toEqual([home, crumb]);
    expect(recipes.breadcrumb).toEqual([
      home,
      crumb,
      { name: fixedPageCopy.brainRecipesCrumb, urlPath: '/brain/recipes/' },
    ]);
  });

  it.each([
    ['/brain/', brain],
    ['/brain/recipes/', recipes],
  ])('%s shares the site card and carries no dates, markdown copy or section', (_path, page) => {
    expect(page.ogImage).toBe('/og.png');
    expect(page).not.toHaveProperty('published');
    expect(page).not.toHaveProperty('modified');
    expect(page).not.toHaveProperty('markdownUrl');
    expect(page).not.toHaveProperty('section');
  });
});
