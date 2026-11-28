import { describe, it, expect } from 'vitest';
import fixedPageCopy from '../../fixedPageCopy';
import buildDocsIndexPage from './index';

describe('buildDocsIndexPage', () => {
  it('carries the fixed docs-index copy and the docs kind at /docs/', () => {
    const page = buildDocsIndexPage();
    expect(page.urlPath).toBe('/docs/');
    expect(page.kind).toBe('docsIndex');
    expect(page.title).toBe(fixedPageCopy.docsIndex.title);
    expect(page.description).toBe(fixedPageCopy.docsIndex.description);
  });

  it('trails AIDE then the docs crumb', () => {
    expect(buildDocsIndexPage().breadcrumb).toEqual([
      { name: 'AIDE', urlPath: '/' },
      { name: 'DOCS', urlPath: '/docs/' },
    ]);
  });

  it('uses the site share card and carries no dates, markdown copy or section', () => {
    const page = buildDocsIndexPage();
    expect(page.ogImage).toBe('/og.png');
    expect(page).not.toHaveProperty('published');
    expect(page).not.toHaveProperty('modified');
    expect(page).not.toHaveProperty('markdownUrl');
    expect(page).not.toHaveProperty('section');
  });
});
