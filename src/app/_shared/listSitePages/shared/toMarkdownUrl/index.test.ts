import { describe, it, expect } from 'vitest';
import toMarkdownUrl from './index';

describe('toMarkdownUrl', () => {
  it.each([
    ['/docs/hooks/stop/', '/docs/hooks/stop.md'],
    ['/learn/spec-kit-alternatives/', '/learn/spec-kit-alternatives.md'],
  ])('turns %s into %s', (urlPath, expected) => {
    expect(toMarkdownUrl(urlPath)).toBe(expected);
  });

  it.each(['/', '/docs/x', 'docs/x/'])('throws for %s', (urlPath) => {
    expect(() => toMarkdownUrl(urlPath)).toThrow(`listSitePages: no markdown copy address for ${urlPath}`);
  });
});
