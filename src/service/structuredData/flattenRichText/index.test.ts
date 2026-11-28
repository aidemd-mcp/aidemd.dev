import { describe, expect, it } from 'vitest';
import type { RichText } from '@/types/learn';
import flattenRichText from './index';

describe('flattenRichText', () => {
  it('returns the text of a single text run', () => {
    const text: RichText = [{ kind: 'text', text: 'Intent-driven engineering.' }];

    expect(flattenRichText(text)).toBe('Intent-driven engineering.');
  });

  it('joins text and link runs into the visible words and drops the href', () => {
    const text: RichText = [
      { kind: 'text', text: 'Read ' },
      { kind: 'link', text: 'the hooks docs', href: '/docs/hooks/' },
      { kind: 'text', text: ' first.' },
    ];

    const flattened = flattenRichText(text);

    expect(flattened).toBe('Read the hooks docs first.');
    expect(flattened).not.toContain('/docs/hooks/');
  });

  it('joins runs byte-exact, adding or removing no whitespace', () => {
    const text: RichText = [
      { kind: 'text', text: '  leading ' },
      { kind: 'link', text: ' padded  ', href: 'https://example.com/' },
      { kind: 'text', text: 'trailing  ' },
    ];

    expect(flattenRichText(text)).toBe('  leading  padded  trailing  ');
  });

  it('returns an empty string for an empty array', () => {
    expect(flattenRichText([])).toBe('');
  });
});
