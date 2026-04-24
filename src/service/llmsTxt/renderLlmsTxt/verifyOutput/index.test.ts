import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Module-level mocks — hoisted before imports.
// The verifier reads the file via node:fs/promises; we intercept both
// stat (for size) and readFile (for content) so no real file is needed.
// ---------------------------------------------------------------------------

vi.mock('node:fs/promises', () => ({
  stat: vi.fn(),
  readFile: vi.fn(),
}));

import { stat, readFile } from 'node:fs/promises';
import verifyOutput from './index';
import type { DocSection } from '@/types/docs';

const mockStat = vi.mocked(stat);
const mockReadFile = vi.mocked(readFile);

// ---------------------------------------------------------------------------
// The standard expected section order used by the render pipeline.
// Skills-before-methodology is the wrong order used to test the order check.
// ---------------------------------------------------------------------------

const STANDARD_ORDER: DocSection[] = ['methodology', 'commands', 'agents', 'skills'];
const REVERSED_ORDER: DocSection[] = ['skills', 'commands', 'agents', 'methodology'];

// ---------------------------------------------------------------------------
// Factory — builds a fully valid llms.txt document string by default.
// Pass overrides to vary exactly one dimension per test.
//
// The verifier checks:
//   1. stat.size > 0
//   2. lines[0] starts with "# "
//   3. first non-blank line after H1 starts with "> "
//   4. H2 headings present, in expectedSectionOrder, no extras
//   5. bullet lines match LINK_LINE_RE
//   6. URLs: no .md, not relative, correct section prefix
//   7. each section has at least one bullet
//   8. no AIDEY, no " AID "
//   9. no forbidden companion-file phrases
// ---------------------------------------------------------------------------

interface FixtureOptions {
  /** Override the entire document string — bypasses field-level options. */
  raw?: string;
  /** Override the H1 line (default: "# AIDE — Autonomous Intent-Driven Engineering"). */
  h1?: string;
  /** Override the blockquote line (default: "> A valid blockquote."). */
  blockquote?: string;
  /**
   * Replace the bullet lines for a specific section.
   * Key is a DocSection; value is the replacement block (already formatted lines).
   */
  sectionLinks?: Partial<Record<DocSection, string>>;
  /**
   * Inject arbitrary extra text at the end of the document
   * (useful for forbidden-phrase tests).
   */
  appendText?: string;
  /**
   * Override the section order used to build the H2 headings.
   * Default follows STANDARD_ORDER.
   */
  sectionOrder?: DocSection[];
}

/** Labels for each section — must match SECTION_INDEX_META exactly. */
const SECTION_LABELS: Record<DocSection, string> = {
  methodology: 'Methodology',
  commands: 'Commands',
  agents: 'Agents',
  skills: 'Skills',
};

/** Valid link lines for each section. */
const DEFAULT_LINKS: Record<DocSection, string> = {
  methodology: '- [Intro](https://aidemd.dev/docs/methodology/intro): The spec.\n',
  commands:    '- [Plan](https://aidemd.dev/docs/commands/plan): Plan command.\n',
  agents:      '- [Builder](https://aidemd.dev/docs/agents/builder): Builder agent.\n',
  skills:      '- [Deploy](https://aidemd.dev/docs/skills/deploy): Deploy skill.\n',
};

function makeDocumentFixture(opts: FixtureOptions = {}): string {
  if (opts.raw !== undefined) return opts.raw;

  const order = opts.sectionOrder ?? STANDARD_ORDER;
  const h1 = opts.h1 ?? '# AIDE — Autonomous Intent-Driven Engineering';
  const blockquote = opts.blockquote ?? '> A valid summary of the methodology.';

  const sections = order.map(section => {
    const label = SECTION_LABELS[section];
    const links = opts.sectionLinks?.[section] ?? DEFAULT_LINKS[section];
    return `## ${label}\n\n${links}`;
  });

  const parts = [
    h1,
    '',
    blockquote,
    '',
    'Overview paragraph about what AIDE and the package are.',
    '',
    'Why it matters paragraph addressed to the agent reading.',
    '',
    'Getting started paragraph with install instructions.',
    '',
    sections.join('\n'),
  ];

  const doc = parts.join('\n') + '\n';
  if (opts.appendText) return doc.trimEnd() + '\n' + opts.appendText + '\n';
  return doc;
}

/** Configures the fs mocks to simulate reading `content` from disk. */
function mockFile(content: string) {
  const bytes = Buffer.byteLength(content, 'utf8');
  mockStat.mockResolvedValueOnce({ size: bytes } as Awaited<ReturnType<typeof stat>>);
  mockReadFile.mockResolvedValueOnce(content as unknown as Awaited<ReturnType<typeof readFile>>);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

describe('verifyOutput', () => {
  describe('fully valid document', () => {
    it('returns { bytes, routeCount } and does not throw', async () => {
      const doc = makeDocumentFixture();
      mockFile(doc);

      const result = await verifyOutput('/fake/llms.txt', STANDARD_ORDER);

      expect(result.bytes).toBeGreaterThan(0);
      expect(result.routeCount).toBe(4); // one link per section × 4 sections
    });
  });

  describe('missing H1', () => {
    it('throws with a message matching /missing H1/i', async () => {
      const doc = makeDocumentFixture({ h1: 'No hash prefix here' });
      mockFile(doc);

      await expect(verifyOutput('/fake/llms.txt', STANDARD_ORDER)).rejects.toThrow(/missing H1/i);
    });

    it('throws when H1 line is empty', async () => {
      const doc = makeDocumentFixture({ h1: '' });
      mockFile(doc);

      await expect(verifyOutput('/fake/llms.txt', STANDARD_ORDER)).rejects.toThrow(/missing H1/i);
    });
  });

  describe('missing blockquote', () => {
    it('throws with a message matching /missing blockquote/i', async () => {
      const doc = makeDocumentFixture({ blockquote: 'No angle bracket here' });
      mockFile(doc);

      await expect(verifyOutput('/fake/llms.txt', STANDARD_ORDER)).rejects.toThrow(
        /missing blockquote/i,
      );
    });
  });

  describe('wrong section order', () => {
    it('throws with a message matching /section order mismatch/i when skills appears before methodology', async () => {
      // Build a document with skills-first H2 order, then pass STANDARD_ORDER as
      // the expectedSectionOrder so the verifier detects the mismatch.
      const doc = makeDocumentFixture({ sectionOrder: REVERSED_ORDER });
      mockFile(doc);

      await expect(verifyOutput('/fake/llms.txt', STANDARD_ORDER)).rejects.toThrow(
        /section order mismatch/i,
      );
    });
  });

  describe('link with .md extension', () => {
    it('throws with a message matching /\\.md extension/i', async () => {
      const doc = makeDocumentFixture({
        sectionLinks: {
          methodology:
            '- [Intro](https://aidemd.dev/docs/methodology/intro.md): The spec.\n',
        },
      });
      mockFile(doc);

      await expect(verifyOutput('/fake/llms.txt', STANDARD_ORDER)).rejects.toThrow(
        /\.md extension/i,
      );
    });
  });

  describe('relative link', () => {
    it('throws when a link uses a ./ relative path', async () => {
      // A relative link fails the LINK_LINE_RE because the regex requires
      // https://aidemd.dev — the verifier reports it as a "malformed link line".
      const doc = makeDocumentFixture({
        sectionLinks: {
          methodology: '- [Intro](./docs/methodology/intro): The spec.\n',
        },
      });
      mockFile(doc);

      await expect(verifyOutput('/fake/llms.txt', STANDARD_ORDER)).rejects.toThrow();
    });
  });

  describe('link missing https://aidemd.dev prefix', () => {
    it('throws when a link uses a different origin', async () => {
      // Any URL that doesn't match https://aidemd.dev/docs/... fails LINK_LINE_RE.
      const doc = makeDocumentFixture({
        sectionLinks: {
          methodology:
            '- [Intro](https://example.com/docs/methodology/intro): The spec.\n',
        },
      });
      mockFile(doc);

      await expect(verifyOutput('/fake/llms.txt', STANDARD_ORDER)).rejects.toThrow();
    });
  });

  describe('empty section', () => {
    it('throws with a message matching /has no links/i when a section has no bullet lines', async () => {
      const doc = makeDocumentFixture({
        sectionLinks: {
          methodology: '', // no bullet lines → empty section
        },
      });
      mockFile(doc);

      await expect(verifyOutput('/fake/llms.txt', STANDARD_ORDER)).rejects.toThrow(
        /has no links/i,
      );
    });
  });

  describe('document containing AIDEY', () => {
    it('throws with a message matching /AIDEY/i', async () => {
      const doc = makeDocumentFixture({ appendText: 'Built with AIDEY the mascot.' });
      mockFile(doc);

      await expect(verifyOutput('/fake/llms.txt', STANDARD_ORDER)).rejects.toThrow(/AIDEY/i);
    });
  });

  describe('document containing " AID " token', () => {
    it('throws with a message matching / AID /  (standalone token)', async () => {
      const doc = makeDocumentFixture({ appendText: 'Powered by AID tooling.' });
      mockFile(doc);

      await expect(verifyOutput('/fake/llms.txt', STANDARD_ORDER)).rejects.toThrow(/ AID /);
    });
  });

  describe('document containing /llms-full.txt', () => {
    it('throws with a message matching /companion file/i', async () => {
      const doc = makeDocumentFixture({ appendText: 'See also /llms-full.txt for details.' });
      mockFile(doc);

      await expect(verifyOutput('/fake/llms.txt', STANDARD_ORDER)).rejects.toThrow(
        /companion file/i,
      );
    });
  });
});
