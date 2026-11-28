import { describe, it, expect } from 'vitest';
import templateLabels from '@/data/learn/templateLabels';
import observerCopy from '@/app/observer/_data/observerCopy';
import fixedPageCopy from '../fixedPageCopy';
import buildObserverPage from './index';

describe('buildObserverPage', () => {
  it('carries the observer copy and the observer kind at /observer/', () => {
    const page = buildObserverPage();
    expect(page.urlPath).toBe('/observer/');
    expect(page.kind).toBe('observer');
    expect(page.title).toBe(observerCopy.meta.title);
    expect(page.description).toBe(observerCopy.meta.description);
  });

  it('trails home then observer', () => {
    expect(buildObserverPage().breadcrumb).toEqual([
      { name: templateLabels.breadcrumbHome, urlPath: '/' },
      { name: fixedPageCopy.observerCrumb, urlPath: '/observer/' },
    ]);
  });

  it('shares its own hero capture and carries no dates, markdown copy or section', () => {
    const page = buildObserverPage();
    expect(page.ogImage).toBe(observerCopy.capture.src1x);
    expect(page).not.toHaveProperty('published');
    expect(page).not.toHaveProperty('modified');
    expect(page).not.toHaveProperty('markdownUrl');
    expect(page).not.toHaveProperty('section');
  });
});
