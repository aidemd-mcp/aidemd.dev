import { describe, it, expect } from 'vitest';
import composeDocument from './index';
import type { LlmsEntry, LlmsSection, LlmsTxtConfig } from '@/types/llmsTxt';

// ---------------------------------------------------------------------------
// Factories — minimal valid fixtures; each test varies one dimension.
// ---------------------------------------------------------------------------

function makeConfig(overrides: Partial<LlmsTxtConfig> = {}): LlmsTxtConfig {
  return {
    productName: 'Test Product',
    summary: 'A one-sentence blockquote summary.',
    overview: 'First preamble paragraph about what this is.',
    whyItMatters: 'Second preamble paragraph about why it matters.',
    gettingStarted: 'Third preamble paragraph about getting started.',
    ...overrides,
  };
}

function makeEntry(overrides: Partial<LlmsEntry> = {}): LlmsEntry {
  return {
    urlPath: '/docs/methodology/introduction/',
    url: 'https://aidemd.dev/docs/methodology/introduction/',
    kind: 'doc',
    title: 'Introduction',
    description: 'The core spec.',
    breadcrumb: [],
    ...overrides,
  };
}

function makeSection(overrides: Partial<LlmsSection> = {}): LlmsSection {
  return {
    heading: 'Methodology',
    entries: [makeEntry()],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('composeDocument', () => {
  const config = makeConfig();
  const sections: LlmsSection[] = [
    makeSection({ heading: 'Methodology' }),
    makeSection({
      heading: 'Skills',
      entries: [
        makeEntry({
          urlPath: '/docs/skills/deploy/',
          url: 'https://aidemd.dev/docs/skills/deploy/',
          title: 'Deploy Skill',
          description: 'Handles deploys.',
        }),
        makeEntry({
          urlPath: '/docs/skills/lint/',
          url: 'https://aidemd.dev/docs/skills/lint/',
          title: 'Lint Skill',
          description: '',
        }),
      ],
    }),
  ];
  const output = composeDocument({ config, sections });
  const lines = output.split('\n');

  it('first line is "# <productName>"', () => {
    expect(lines[0]).toBe('# Test Product');
  });

  it('contains exactly one line starting with "> ", equal to "> <summary>"', () => {
    const blockquoteLines = lines.filter(l => l.startsWith('> '));
    expect(blockquoteLines).toEqual(['> A one-sentence blockquote summary.']);
  });

  it('three preamble paragraphs are separated by one blank line with no heading before the first H2', () => {
    expect(output).toContain(
      'First preamble paragraph about what this is.\n\nSecond preamble paragraph about why it matters.\n\nThird preamble paragraph about getting started.\n\n## ',
    );
    const preambleRegion = output.slice(output.indexOf('First preamble paragraph'), output.indexOf('## '));
    expect(preambleRegion).not.toMatch(/^#/m);
  });

  it('H2 sections appear in the order the input array specified', () => {
    const headings = lines.filter(l => l.startsWith('## '));
    expect(headings).toEqual(['## Methodology', '## Skills']);
  });

  it('no line starts with "### "', () => {
    expect(lines.some(l => l.startsWith('### '))).toBe(false);
  });

  it('every link line is a trailing-slash HTML link with an optional description', () => {
    const linkLines = lines.filter(l => l.startsWith('- ['));
    expect(linkLines).toHaveLength(3);
    for (const line of linkLines) {
      expect(line).toMatch(/^- \[[^\]]+\]\(https:\/\/aidemd\.dev\/[^)]*\/\)(: .+)?$/);
    }
  });

  it('no link ends in .md', () => {
    expect(output).not.toMatch(/\.md\)/);
  });

  it('link entries sit under their own sections', () => {
    const skillsIdx = output.indexOf('## Skills');
    expect(output.slice(0, skillsIdx)).toContain('- [Introduction]');
    expect(output.slice(skillsIdx)).toContain('- [Deploy Skill]');
    expect(output.slice(skillsIdx)).toContain('- [Lint Skill]');
  });

  it('contains no AIDEY and no standalone AID', () => {
    expect(output).not.toContain('AIDEY');
    expect(output).not.toMatch(/\bAID\b/);
  });

  it('output ends in exactly one "\\n"', () => {
    expect(output.endsWith('\n')).toBe(true);
    expect(output.endsWith('\n\n')).toBe(false);
  });

  it('an empty section list still ends in exactly one "\\n"', () => {
    const bare = composeDocument({ config, sections: [] });
    expect(bare.endsWith('Third preamble paragraph about getting started.\n')).toBe(true);
  });
});
