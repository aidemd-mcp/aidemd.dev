import { describe, it, expect } from 'vitest';
import ogImageConfig from './ogImageConfig';

// Import the orchestrator's named export and default export.
import socialShare, { ogImage } from './index';

describe('socialShare orchestrator', () => {
  it('(a) re-exports ogImage as a named export', () => {
    expect(ogImage).toBeDefined();
  });

  it('(b) named export ogImage deep-equals the return value of ogImageConfig()', () => {
    const expected = ogImageConfig();
    expect(ogImage).toEqual(expected);
  });

  it('(c) default export deep-equals the return value of ogImageConfig()', () => {
    const expected = ogImageConfig();
    expect(socialShare).toEqual(expected);
  });

  it('(d) named export and default export are the same reference', () => {
    expect(socialShare).toBe(ogImage);
  });
});
