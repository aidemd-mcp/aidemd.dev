import { describe, expect, it } from 'vitest';
import resolveArticleType from './index';

describe('resolveArticleType', () => {
  it('maps doc to TechArticle', () => {
    expect(resolveArticleType('doc')).toBe('TechArticle');
  });

  it('maps learn to Article', () => {
    expect(resolveArticleType('learn')).toBe('Article');
  });

  it('throws for a kind that has no article', () => {
    expect(() => resolveArticleType('home' as never)).toThrow('no article for page kind home');
  });
});
