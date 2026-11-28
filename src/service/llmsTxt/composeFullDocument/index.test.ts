import { describe, it, expect } from 'vitest';
import composeFullDocument from './index';
import type { LlmsEntry, LlmsSection, LlmsTxtConfig } from '@/types/llmsTxt';

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

function makeEntry(slug: string, overrides: Partial<LlmsEntry> = {}): LlmsEntry {
  return {
    urlPath: `/${slug}/`,
    url: `https://aidemd.dev/${slug}/`,
    kind: 'doc',
    title: `Title ${slug}`,
    description: `Description ${slug}.`,
    breadcrumb: [],
    markdown: `# Title ${slug}\n\nBody of ${slug}.\n`,
    ...overrides,
  };
}

function makeSections(): LlmsSection[] {
  return [
    {
      heading: 'Methodology',
      entries: [
        makeEntry('docs/methodology', { kind: 'docsSection', markdown: undefined }),
        makeEntry('docs/methodology/intro'),
        makeEntry('docs/methodology/spec'),
      ],
    },
    {
      heading: 'Learn',
      entries: [
        makeEntry('learn', { kind: 'learnIndex', markdown: undefined }),
        makeEntry('learn/why-aide', { kind: 'learn' }),
      ],
    },
    {
      heading: 'Optional',
      entries: [
        makeEntry('observer', { kind: 'observer', markdown: undefined }),
        makeEntry('brain', { kind: 'brain', markdown: undefined }),
      ],
    },
  ];
}

describe('composeFullDocument', () => {
  const output = composeFullDocument({ config: makeConfig(), sections: makeSections() });
  const lines = output.split('\n');

  it('opens with "# <productName>" then "> <summary>"', () => {
    expect(lines[0]).toBe('# Test Product');
    expect(lines[1]).toBe('');
    expect(lines[2]).toBe('> A one-sentence blockquote summary.');
  });

  it('lists entries in section order, docs before learn', () => {
    const sources = lines.filter(l => l.startsWith('Source: '));
    expect(sources).toEqual([
      'Source: https://aidemd.dev/docs/methodology/intro/',
      'Source: https://aidemd.dev/docs/methodology/spec/',
      'Source: https://aidemd.dev/learn/why-aide/',
    ]);
  });

  it.each(['docs/methodology/', 'learn/', 'observer/', 'brain/'])(
    'index-only page %s produces no Source line',
    path => {
      expect(output).not.toContain(`Source: https://aidemd.dev/${path}\n`);
    },
  );

  it('the number of Source lines equals the number of doc + learn entries', () => {
    const sourceCount = lines.filter(l => l.startsWith('Source: ')).length;
    const included = makeSections()
      .flatMap(s => s.entries)
      .filter(e => e.kind === 'doc' || e.kind === 'learn').length;
    expect(sourceCount).toBe(included);
  });

  it('every Source URL is a trailing-slash canonical URL', () => {
    const sources = lines.filter(l => l.startsWith('Source: '));
    for (const line of sources) {
      expect(line.slice('Source: '.length)).toMatch(/^https:\/\/aidemd\.dev\/.*\/$/);
    }
  });

  it('carries each page text whole', () => {
    expect(output).toContain('Body of docs/methodology/intro.');
    expect(output).toContain('Body of learn/why-aide.');
  });

  it('output ends in exactly one "\\n"', () => {
    expect(output.endsWith('\n')).toBe(true);
    expect(output.endsWith('\n\n')).toBe(false);
  });

  it('throws when an included doc entry has no markdown', () => {
    const sections = makeSections();
    sections[0].entries[1] = makeEntry('docs/methodology/intro', { markdown: undefined });
    expect(() => composeFullDocument({ config: makeConfig(), sections })).toThrow(
      'https://aidemd.dev/docs/methodology/intro/',
    );
  });
});
