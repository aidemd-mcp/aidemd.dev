import { describe, it, expect } from 'vitest';
import hashCardInputs from './index';

const base = { designHash: 'a'.repeat(64), title: 'AIDE spec', section: 'methodology' };

describe('hashCardInputs', () => {
  it('returns 10 lowercase hex characters', () => {
    expect(hashCardInputs(base)).toMatch(/^[0-9a-f]{10}$/);
  });

  it('is stable for equal input', () => {
    expect(hashCardInputs({ ...base })).toBe(hashCardInputs({ ...base }));
  });

  it.each([
    ['title', { title: 'AIDE plan' }],
    ['section', { section: 'tools' }],
    ['designHash', { designHash: 'b'.repeat(64) }],
  ])('changes when the %s changes', (_field, override) => {
    expect(hashCardInputs({ ...base, ...override })).not.toBe(hashCardInputs(base));
  });

  it('hashes an absent section and an undefined section the same', () => {
    const { section: _omitted, ...withoutSection } = base;
    expect(hashCardInputs(withoutSection)).toBe(hashCardInputs({ ...withoutSection, section: undefined }));
  });

  it('distinguishes no section from a section', () => {
    const { section: _omitted, ...withoutSection } = base;
    expect(hashCardInputs(withoutSection)).not.toBe(hashCardInputs(base));
  });
});
