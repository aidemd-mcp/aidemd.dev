import { describe, it, expect } from 'vitest';
import buildAbsoluteUrl from './index';

describe('buildAbsoluteUrl', () => {
  it('joins the origin and a page path, keeping its trailing slash', () => {
    expect(buildAbsoluteUrl({ siteUrl: 'https://aidemd.dev', urlPath: '/docs/hooks/stop/' })).toBe(
      'https://aidemd.dev/docs/hooks/stop/',
    );
  });

  it('joins the origin and the feed path, which has no trailing slash', () => {
    expect(buildAbsoluteUrl({ siteUrl: 'https://aidemd.dev', urlPath: '/feed.xml' })).toBe('https://aidemd.dev/feed.xml');
  });

  it('throws when siteUrl ends with a slash', () => {
    expect(() => buildAbsoluteUrl({ siteUrl: 'https://aidemd.dev/', urlPath: '/feed.xml' })).toThrow(/siteUrl/);
  });

  it('throws when urlPath does not start with a slash', () => {
    expect(() => buildAbsoluteUrl({ siteUrl: 'https://aidemd.dev', urlPath: 'feed.xml' })).toThrow(/urlPath/);
  });
});
