import { describe, it, expect, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Module-level mock — hoisted before imports.
// Simulates node:fs/promises so getDocMeta never touches the real filesystem.
// ---------------------------------------------------------------------------

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
}));

import { readFile } from 'node:fs/promises';
import getDocMeta from './index';
import type { DocRoute } from '@/types/docs';

const readFileMock = vi.mocked(readFile);

// ---------------------------------------------------------------------------
// Factory — minimal DocRoute that satisfies getDocMeta's contract.
// absPath is the only field the helper reads; the rest are present to satisfy
// the full DocRoute type.
// ---------------------------------------------------------------------------

function makeRoute(absPath = '/docs/test-section/test-slug.md'): DocRoute {
  return {
    section: 'methodology',
    slug: 'test-slug',
    title: 'Test Slug',
    urlPath: '/docs/methodology/test-slug',
    absPath,
    order: 0,
  };
}

// ---------------------------------------------------------------------------
// Cases — the three shapes the 33 real docs exhibit.
// ---------------------------------------------------------------------------

describe('getDocMeta', () => {
  it('(i) frontmatter with title and description — returns both verbatim', async () => {
    readFileMock.mockResolvedValueOnce(
      '---\ntitle: My Doc Title\ndescription: A short summary of the doc.\n---\n\nBody text here.' as unknown as Awaited<ReturnType<typeof readFile>>,
    );

    const result = await getDocMeta(makeRoute());

    expect(result.title).toBe('My Doc Title');
    expect(result.description).toBe('A short summary of the doc.');
  });

  it('(ii) frontmatter with title only — returns title, falls back to body first sentence', async () => {
    readFileMock.mockResolvedValueOnce(
      '---\ntitle: Title Only\n---\n\nBody without a description field. Second sentence here.' as unknown as Awaited<ReturnType<typeof readFile>>,
    );

    const result = await getDocMeta(makeRoute());

    expect(result.title).toBe('Title Only');
    expect(result.description).toBe('Body without a description field.');
  });

  it('(iii) no frontmatter, body starts with # H1 — title derived from H1, falls back to body first sentence', async () => {
    readFileMock.mockResolvedValueOnce(
      '# Getting Started\n\nThis doc has no YAML frontmatter. It has more text after.' as unknown as Awaited<ReturnType<typeof readFile>>,
    );

    const result = await getDocMeta(makeRoute());

    expect(result.title).toBe('Getting Started');
    expect(result.description).toBe('This doc has no YAML frontmatter.');
  });

  it('(iv) no frontmatter, body starts with # H1 followed by only lists — title derived from H1, description undefined', async () => {
    readFileMock.mockResolvedValueOnce(
      '# Hub Page\n\n- [link one](./one.md)\n- [link two](./two.md)\n\n## Section\n\n- [link three](./three.md)' as unknown as Awaited<ReturnType<typeof readFile>>,
    );

    const result = await getDocMeta(makeRoute());

    expect(result.title).toBe('Hub Page');
    expect(result.description).toBeUndefined();
  });

  it('(v) no frontmatter, body has a blockquote before the first paragraph — skips blockquote, uses paragraph', async () => {
    readFileMock.mockResolvedValueOnce(
      '# Command Doc\n\n> **Agent:** This command is executed by the aide-implementor agent.\n\nExecute the architect\'s implementation plan. This is the implementor phase.' as unknown as Awaited<ReturnType<typeof readFile>>,
    );

    const result = await getDocMeta(makeRoute());

    expect(result.title).toBe('Command Doc');
    expect(result.description).toBe("Execute the architect's implementation plan.");
  });

  it('(vi) frontmatter description takes priority over body first sentence', async () => {
    readFileMock.mockResolvedValueOnce(
      '---\ntitle: My Doc\ndescription: The explicit frontmatter description.\n---\n\nThe body has its own first sentence.' as unknown as Awaited<ReturnType<typeof readFile>>,
    );

    const result = await getDocMeta(makeRoute());

    expect(result.title).toBe('My Doc');
    expect(result.description).toBe('The explicit frontmatter description.');
  });
});
