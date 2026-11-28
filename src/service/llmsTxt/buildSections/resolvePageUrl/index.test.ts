import { describe, it, expect } from 'vitest';
import resolvePageUrl from './index';

describe('resolvePageUrl', () => {
  it.each([
    ['/docs/methodology/aide-spec/', 'https://aidemd.dev/docs/methodology/aide-spec/'],
    ['/', 'https://aidemd.dev/'],
  ])('resolves %s to %s', (urlPath, expected) => {
    expect(resolvePageUrl({ urlPath })).toBe(expected);
  });

  it.each([
    '/docs/methodology/aide-spec',
    '/docs/methodology/aide-spec.md',
    'docs/methodology/',
    '/docs/hooks/Stop/',
  ])('throws naming the path for %s', (urlPath) => {
    expect(() => resolvePageUrl({ urlPath })).toThrow(urlPath);
  });
});
