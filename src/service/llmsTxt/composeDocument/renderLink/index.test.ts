import { describe, it, expect } from 'vitest';
import renderLink from './index';
import type { LlmsEntry } from '@/types/llmsTxt';

function makeEntry(overrides: Partial<LlmsEntry> = {}): LlmsEntry {
  return {
    urlPath: '/docs/methodology/getting-started/',
    url: 'https://aidemd.dev/docs/methodology/getting-started/',
    kind: 'doc',
    title: 'Getting Started',
    description: 'How to install and run the AIDE toolchain.',
    breadcrumb: [],
    ...overrides,
  };
}

describe('renderLink', () => {
  it('entry with non-empty description → line is "- [Title](url): desc\\n"', () => {
    const entry = makeEntry({ description: 'A short description.' });
    expect(renderLink(entry)).toBe(
      `- [Getting Started](https://aidemd.dev/docs/methodology/getting-started/): A short description.\n`,
    );
  });

  it('entry with empty description → line is "- [Title](url)\\n" (no trailing colon-space)', () => {
    const entry = makeEntry({ description: '' });
    expect(renderLink(entry)).toBe(
      `- [Getting Started](https://aidemd.dev/docs/methodology/getting-started/)\n`,
    );
  });

  it.each([
    {
      label: 'title with opening bracket',
      title: '[Special] Topic',
      expected: `- [[Special] Topic](https://aidemd.dev/docs/methodology/getting-started/)\n`,
    },
    {
      label: 'title with closing bracket',
      title: 'Topic [Advanced]',
      expected: `- [Topic [Advanced]](https://aidemd.dev/docs/methodology/getting-started/)\n`,
    },
    {
      label: 'title with both brackets',
      title: '[Foo] and [Bar]',
      expected: `- [[Foo] and [Bar]](https://aidemd.dev/docs/methodology/getting-started/)\n`,
    },
  ])('$label → title rendered verbatim, not sanitized', ({ title, expected }) => {
    const entry = makeEntry({ title, description: '' });
    expect(renderLink(entry)).toBe(expected);
  });

  it('keeps surrounding whitespace in title and description byte for byte', () => {
    const entry = makeEntry({ title: ' Padded ', description: ' spaced  ' });
    expect(renderLink(entry)).toBe(
      `- [ Padded ](https://aidemd.dev/docs/methodology/getting-started/):  spaced  \n`,
    );
  });

  it('throws naming the url for a newline in the title', () => {
    const entry = makeEntry({ title: 'Two\nLines' });
    expect(() => renderLink(entry)).toThrow('https://aidemd.dev/docs/methodology/getting-started/');
  });

  it('throws naming the url for a newline in the description', () => {
    const entry = makeEntry({ description: 'First line\nSecond line' });
    expect(() => renderLink(entry)).toThrow('https://aidemd.dev/docs/methodology/getting-started/');
  });
});
