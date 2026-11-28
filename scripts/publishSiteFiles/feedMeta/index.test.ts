import { describe, expect, it } from 'vitest';
import siteIdentity from '@/data/siteIdentity';
import feedMeta from './index';

describe('feedMeta', () => {
  it('carries the fixed feed copy and paths', () => {
    expect(feedMeta).toEqual({
      title: 'aidemd.dev',
      subtitle: 'New and updated pages in the intent-driven AIDE docs and /learn',
      siteUrl: siteIdentity.url,
      feedUrlPath: '/feed.xml',
      authorName: 'Lowmeadow LLC',
    });
  });

  it('credits Lowmeadow LLC as the author', () => {
    expect(feedMeta.authorName).toBe('Lowmeadow LLC');
  });
});
