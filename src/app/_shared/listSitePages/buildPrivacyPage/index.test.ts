import { describe, it, expect } from 'vitest';
import templateLabels from '@/data/learn/templateLabels';
import fixedPageCopy from '../fixedPageCopy';
import buildPrivacyPage from './index';

describe('buildPrivacyPage', () => {
  it('carries the fixed privacy copy and the privacy kind at /privacy/', () => {
    const page = buildPrivacyPage();
    expect(page.urlPath).toBe('/privacy/');
    expect(page.kind).toBe('privacy');
    expect(page.title).toBe(fixedPageCopy.privacy.title);
    expect(page.description).toBe(fixedPageCopy.privacy.description);
  });

  it('trails home then privacy', () => {
    expect(buildPrivacyPage().breadcrumb).toEqual([
      { name: templateLabels.breadcrumbHome, urlPath: '/' },
      { name: fixedPageCopy.privacy.crumb, urlPath: '/privacy/' },
    ]);
  });

  it('shares the site card and carries no dates, markdown copy or section', () => {
    const page = buildPrivacyPage();
    expect(page.ogImage).toBe('/og.png');
    expect(page).not.toHaveProperty('published');
    expect(page).not.toHaveProperty('modified');
    expect(page).not.toHaveProperty('markdownUrl');
    expect(page).not.toHaveProperty('section');
  });
});
