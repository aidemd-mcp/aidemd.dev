import { describe, it, expect } from 'vitest';
import renderLink from './index';
import type { LinkEntry } from '@/service/llmsTxt/types';

function makeEntry(overrides: Partial<LinkEntry> = {}): LinkEntry {
  return {
    title: 'Getting Started',
    absoluteUrl: 'https://aidemd.dev/docs/methodology/getting-started',
    description: 'How to install and run the AIDE toolchain.',
    ...overrides,
  };
}

describe('renderLink', () => {
  it('entry with non-empty description → line is "- [Title](url): desc\\n"', () => {
    const entry = makeEntry({ description: 'A short description.' });
    expect(renderLink(entry)).toBe(
      `- [Getting Started](https://aidemd.dev/docs/methodology/getting-started): A short description.\n`,
    );
  });

  it('entry with empty description → line is "- [Title](url)\\n" (no trailing colon-space)', () => {
    const entry = makeEntry({ description: '' });
    expect(renderLink(entry)).toBe(
      `- [Getting Started](https://aidemd.dev/docs/methodology/getting-started)\n`,
    );
  });

  it.each([
    {
      label: 'title with opening bracket',
      title: '[Special] Topic',
      expected: `- [[Special] Topic](https://aidemd.dev/docs/methodology/getting-started)\n`,
    },
    {
      label: 'title with closing bracket',
      title: 'Topic [Advanced]',
      expected: `- [Topic [Advanced]](https://aidemd.dev/docs/methodology/getting-started)\n`,
    },
    {
      label: 'title with both brackets',
      title: '[Foo] and [Bar]',
      expected: `- [[Foo] and [Bar]](https://aidemd.dev/docs/methodology/getting-started)\n`,
    },
  ])('$label → title rendered verbatim, not sanitized', ({ title, expected }) => {
    const entry = makeEntry({ title, description: '' });
    expect(renderLink(entry)).toBe(expected);
  });
});
