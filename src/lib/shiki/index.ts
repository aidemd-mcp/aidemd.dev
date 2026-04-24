import { createHighlighter } from 'shiki';
import type { Highlighter, ThemeRegistration } from 'shiki';
import aideThemeJson from './theme/aideTheme.json';

// JSON imports don't narrow string literals; cast to the required type so
// TypeScript accepts the `type: "dark"` field as the literal union member.
const aideTheme = aideThemeJson as ThemeRegistration;

/** Module-level singleton — one Highlighter instance for the entire build. */
let cached: Highlighter | null = null;

/**
 * Returns a Shiki Highlighter pre-loaded with the aide-theme and the
 * language set needed to highlight all docs code blocks. The result is
 * memoized so the expensive WASM + grammar initialization only runs once
 * per build process, regardless of how many docs pages call this function.
 */
export default async function getHighlighter(): Promise<Highlighter> {
  if (cached) return cached;

  cached = await createHighlighter({
    themes: [aideTheme],
    langs: ['ts', 'tsx', 'js', 'jsx', 'bash', 'yaml', 'json', 'md', 'mdx', 'css', 'html', 'python'],
  });

  return cached;
}
