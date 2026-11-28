import { describe, expect, it } from 'vitest';
import resolveAbsoluteUrl from './index';

describe('resolveAbsoluteUrl', () => {
  it('resolves the home path against the site origin', () => {
    expect(resolveAbsoluteUrl('/')).toBe('https://aidemd.dev/');
  });

  it('keeps the trailing slash of a nested path', () => {
    expect(resolveAbsoluteUrl('/docs/hooks/stop/')).toBe('https://aidemd.dev/docs/hooks/stop/');
  });

  it('keeps a fragment', () => {
    expect(resolveAbsoluteUrl('/learn/x/#term')).toBe('https://aidemd.dev/learn/x/#term');
  });

  it('throws when the path is not root-relative', () => {
    expect(() => resolveAbsoluteUrl('docs/')).toThrow(
      'structuredData: urlPath must be root-relative: docs/',
    );
  });
});
