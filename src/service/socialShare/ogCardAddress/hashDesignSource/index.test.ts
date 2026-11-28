import { describe, it, expect } from 'vitest';
import hashDesignSource from './index';

describe('hashDesignSource', () => {
  it('returns a 64-character lowercase hex sha256 of the real design folder', () => {
    expect(hashDesignSource()).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns the same value on every call', () => {
    expect(hashDesignSource()).toBe(hashDesignSource());
  });
});
