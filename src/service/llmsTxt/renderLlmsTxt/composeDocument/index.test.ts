import { describe, it, expect } from 'vitest';
import composeDocument from './index';
import type { LlmsTxtConfig } from '@/service/llmsTxt/types';
import type { RouteGroup } from '@/service/llmsTxt/types';

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
    origin: 'https://aidemd.dev',
    outputPath: '/llms.txt',
    filesystemPath: 'public/llms.txt',
    ...overrides,
  };
}

function makeGroup(overrides: Partial<RouteGroup> = {}): RouteGroup {
  return {
    section: 'methodology',
    label: 'Methodology',
    entries: [
      {
        title: 'Introduction',
        absoluteUrl: 'https://aidemd.dev/docs/methodology/introduction',
        description: 'The core spec.',
      },
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('composeDocument', () => {
  const config = makeConfig();
  const groups: RouteGroup[] = [
    makeGroup({ section: 'methodology', label: 'Methodology' }),
    makeGroup({
      section: 'skills',
      label: 'Skills',
      entries: [
        {
          title: 'Deploy Skill',
          absoluteUrl: 'https://aidemd.dev/docs/skills/deploy',
          description: 'Handles deploys.',
        },
      ],
    }),
  ];

  it('first line starts with "# "', () => {
    const output = composeDocument(config, groups);
    const lines = output.split('\n');
    expect(lines[0]).toMatch(/^# /);
  });

  it('first line contains the product name', () => {
    const output = composeDocument(config, groups);
    expect(output.split('\n')[0]).toBe('# Test Product');
  });

  it('contains exactly one line starting with "> "', () => {
    const output = composeDocument(config, groups);
    const blockquoteLines = output.split('\n').filter(l => l.startsWith('> '));
    expect(blockquoteLines).toHaveLength(1);
  });

  it('blockquote line contains the summary text', () => {
    const output = composeDocument(config, groups);
    const blockquoteLine = output.split('\n').find(l => l.startsWith('> '));
    expect(blockquoteLine).toBe('> A one-sentence blockquote summary.');
  });

  it('three preamble paragraphs are present and separated by blank lines with no intervening headings', () => {
    const output = composeDocument(config, groups);
    // All three preamble text strings appear in the output
    expect(output).toContain('First preamble paragraph about what this is.');
    expect(output).toContain('Second preamble paragraph about why it matters.');
    expect(output).toContain('Third preamble paragraph about getting started.');

    // Consecutive preamble paragraphs are separated by a blank line
    expect(output).toContain(
      'First preamble paragraph about what this is.\n\nSecond preamble paragraph about why it matters.',
    );
    expect(output).toContain(
      'Second preamble paragraph about why it matters.\n\nThird preamble paragraph about getting started.',
    );

    // No heading lines (## or ###) appear between the first preamble start and the first H2
    const preambleStart = output.indexOf('First preamble paragraph');
    const firstH2 = output.indexOf('## ');
    const preambleRegion = output.slice(preambleStart, firstH2);
    expect(preambleRegion).not.toMatch(/^##/m);
  });

  it('the two H2 sections appear in the order the input array specified', () => {
    const output = composeDocument(config, groups);
    const methodologyPos = output.indexOf('## Methodology');
    const skillsPos = output.indexOf('## Skills');
    expect(methodologyPos).toBeGreaterThanOrEqual(0);
    expect(skillsPos).toBeGreaterThanOrEqual(0);
    expect(methodologyPos).toBeLessThan(skillsPos);
  });

  it('output ends in a single "\\n"', () => {
    const output = composeDocument(config, groups);
    expect(output.endsWith('\n')).toBe(true);
    expect(output.endsWith('\n\n')).toBe(false);
  });

  it('section headings are H2 (## prefix)', () => {
    const output = composeDocument(config, groups);
    expect(output).toContain('## Methodology');
    expect(output).toContain('## Skills');
  });

  it('link entries are present under their respective sections', () => {
    const output = composeDocument(config, groups);
    const methodologyIdx = output.indexOf('## Methodology');
    const skillsIdx = output.indexOf('## Skills');
    const methodologySection = output.slice(methodologyIdx, skillsIdx);
    expect(methodologySection).toContain('- [Introduction]');
    const skillsSection = output.slice(skillsIdx);
    expect(skillsSection).toContain('- [Deploy Skill]');
  });
});
