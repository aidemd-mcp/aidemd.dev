import path from 'node:path';
import { describe, it, expect, vi, afterEach } from 'vitest';
import getHighlighter from '@/lib/shiki';
import type { DocRoute } from '@/types/docs';
import renderMarkdown from './index';

const NO_LINKS_CONTEXT = { fromPath: '/repo/.aide/docs/x.md', routes: [] };

/**
 * Acceptance test for step 5: verifies that fenced code blocks are syntax-
 * highlighted at build time with the aide-theme colors.
 *
 * Keywords (e.g. `const`) must render in #3d6b4a (forest green).
 * Strings (e.g. `"hello"`) must render in #d6b25a (warm gold).
 * Shiki emits uppercase hex values, so the assertions normalise to lowercase.
 */
describe('renderMarkdown — heading rendering', () => {
  it('renders a markdown H1 as an <h1> element containing the heading text', async () => {
    const html = await renderMarkdown('# Title\n\nParagraph.', NO_LINKS_CONTEXT);

    expect(html).toContain('<h1>Title</h1>');
  });
});

describe('renderMarkdown — Shiki syntax highlighting', () => {
  it('renders keyword color #3d6b4a and string color #d6b25a for a fenced ts block', async () => {
    const highlighter = await getHighlighter();

    const markdown = '```ts\nconst x = "hello"\n```';
    const html = await renderMarkdown(markdown, { ...NO_LINKS_CONTEXT, highlighter });

    // Shiki emits uppercase hex; normalise for a case-insensitive assertion.
    const lower = html.toLowerCase();

    expect(lower).toContain('color:#3d6b4a');
    expect(lower).toContain('color:#d6b25a');
  });

  it('leaves code blocks as plain <pre><code> when no highlighter is supplied', async () => {
    const markdown = '```ts\nconst x = "hello"\n```';
    const html = await renderMarkdown(markdown, NO_LINKS_CONTEXT);

    expect(html).toContain('<pre>');
    expect(html).toContain('<code');
    // No inline color styles without a highlighter.
    expect(html).not.toContain('color:#');
  });
});

function makeRoute(overrides: Partial<DocRoute> & Pick<DocRoute, 'slug' | 'absPath'>): DocRoute {
  return {
    section: 'hooks',
    title: overrides.slug,
    urlPath: `/docs/hooks/${overrides.slug.toLowerCase()}`,
    order: 0,
    ...overrides,
  };
}

describe('renderMarkdown — doc links', () => {
  const hooksIndexPath = path.resolve('/repo', '.aide/reference/hooks/index.md');
  const routes = [
    makeRoute({ slug: 'index', absPath: hooksIndexPath }),
    makeRoute({ slug: 'Stop', absPath: path.resolve('/repo', '.aide/reference/hooks/Stop.md') }),
  ];

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rewrites a markdown link to a known doc to its live route without warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const html = await renderMarkdown('[Stop](./Stop.md)', { fromPath: hooksIndexPath, routes });

    expect(html).toContain('href="/docs/hooks/stop/"');
    expect(html).not.toContain('.md"');
    expect(warn).not.toHaveBeenCalled();
  });

  it('rewrites a raw-HTML anchor the same way', async () => {
    const html = await renderMarkdown('<a href="./Stop.md">Stop</a>', {
      fromPath: hooksIndexPath,
      routes,
    });

    expect(html).toContain('href="/docs/hooks/stop/"');
  });

  it('leaves a link shown as inline code or in a fenced block as text', async () => {
    const html = await renderMarkdown('`./Stop.md`\n\n```\n./Stop.md\n```', {
      fromPath: hooksIndexPath,
      routes,
    });

    expect(html).toContain('./Stop.md');
    expect(html).not.toContain('href=');
  });

  it('keeps a missing link as written, resolves, and warns once naming the link and the linking file', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fromPath = path.resolve('/repo', '.aide/reference/hooks/missing-link-test.md');

    const html = await renderMarkdown('[x](./missing.md)', { fromPath, routes });

    expect(html).toContain('href="./missing.md"');
    expect(warn).toHaveBeenCalledTimes(1);
    const message = String(warn.mock.calls[0][0]);
    expect(message).toContain('./missing.md');
    expect(message).toContain('missing-link-test.md');
    expect(message).toContain('left as written');
  });
});
