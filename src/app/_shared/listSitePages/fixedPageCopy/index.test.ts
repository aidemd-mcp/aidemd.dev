import { describe, it, expect } from 'vitest';
import fixedPageCopy from './index';

const pages = [
  ['home', fixedPageCopy.home],
  ['docsIndex', fixedPageCopy.docsIndex],
  ['privacy', fixedPageCopy.privacy],
] as const;

describe('fixedPageCopy', () => {
  it.each(pages)('%s title is at most 70 characters and single-line', (_name, page) => {
    expect(page.title.length).toBeLessThanOrEqual(70);
    expect(page.title).not.toMatch(/\s{2,}|[\r\n\t]/);
  });

  it.each(pages)('%s description is 70 to 170 characters and single-line', (_name, page) => {
    expect(page.description.length).toBeGreaterThanOrEqual(70);
    expect(page.description.length).toBeLessThanOrEqual(170);
    expect(page.description).not.toMatch(/\s{2,}|[\r\n\t]/);
  });

  it.each(pages)('%s names AIDE only alongside intent-driven or aidemd', (_name, page) => {
    for (const text of [page.title, page.description]) {
      if (text.includes('AIDE')) expect(text).toMatch(/intent-driven|aidemd/);
    }
  });

  it.each(pages)('%s crumb is a non-empty single line', (_name, page) => {
    expect(page.crumb).toMatch(/^\S+$/);
  });

  it('carries the crumbs of the pages whose words live elsewhere', () => {
    expect(fixedPageCopy.brainCrumb).toBe('brain');
    expect(fixedPageCopy.brainRecipesCrumb).toBe('recipes');
    expect(fixedPageCopy.observerCrumb).toBe('observer');
  });
});
