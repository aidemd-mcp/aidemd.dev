import { describe, it, expect } from 'vitest';
import getHighlighter from '@/lib/shiki';
import renderMarkdown from './index';

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
    const html = await renderMarkdown('# Title\n\nParagraph.');

    expect(html).toContain('<h1>Title</h1>');
  });
});

describe('renderMarkdown — Shiki syntax highlighting', () => {
  it('renders keyword color #3d6b4a and string color #d6b25a for a fenced ts block', async () => {
    const highlighter = await getHighlighter();

    const markdown = '```ts\nconst x = "hello"\n```';
    const html = await renderMarkdown(markdown, highlighter);

    // Shiki emits uppercase hex; normalise for a case-insensitive assertion.
    const lower = html.toLowerCase();

    expect(lower).toContain('color:#3d6b4a');
    expect(lower).toContain('color:#d6b25a');
  });

  it('leaves code blocks as plain <pre><code> when no highlighter is supplied', async () => {
    const markdown = '```ts\nconst x = "hello"\n```';
    const html = await renderMarkdown(markdown);

    expect(html).toContain('<pre>');
    expect(html).toContain('<code');
    // No inline color styles without a highlighter.
    expect(html).not.toContain('color:#');
  });
});
