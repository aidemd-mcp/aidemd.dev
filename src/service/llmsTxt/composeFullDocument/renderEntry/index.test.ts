import { describe, it, expect } from 'vitest';
import renderEntry from './index';
import type { LlmsEntry } from '@/types/llmsTxt';

function makeEntry(overrides: Partial<LlmsEntry> = {}): LlmsEntry {
  return {
    urlPath: '/docs/methodology/introduction/',
    url: 'https://aidemd.dev/docs/methodology/introduction/',
    kind: 'doc',
    title: 'Introduction',
    description: 'The core spec.',
    breadcrumb: [],
    markdown: '# Introduction\n\nFirst paragraph.\n\n## Section\n\nSecond paragraph.\n',
    ...overrides,
  };
}

describe('renderEntry', () => {
  it('renders title, source line, blank line and the text with its repeated H1 dropped', () => {
    expect(renderEntry(makeEntry())).toBe(
      '# Introduction\nSource: https://aidemd.dev/docs/methodology/introduction/\n\nFirst paragraph.\n\n## Section\n\nSecond paragraph.\n',
    );
  });

  it('returns a 20,000-character body byte-identical', () => {
    const body = 'x'.repeat(20_000);
    const output = renderEntry(makeEntry({ markdown: body }));
    expect(output).toBe(
      `# Introduction\nSource: https://aidemd.dev/docs/methodology/introduction/\n\n${body}\n`,
    );
  });

  it('ignores the description entirely', () => {
    expect(renderEntry(makeEntry({ description: 'UNIQUE-DESCRIPTION' }))).not.toContain(
      'UNIQUE-DESCRIPTION',
    );
  });

  it.each([
    { name: 'undefined', markdown: undefined },
    { name: 'blank', markdown: '   \n' },
  ])('throws naming the url when markdown is $name', ({ markdown }) => {
    expect(() => renderEntry(makeEntry({ markdown }))).toThrow(
      'https://aidemd.dev/docs/methodology/introduction/',
    );
  });
});
