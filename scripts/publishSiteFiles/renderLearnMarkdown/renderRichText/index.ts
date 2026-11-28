import siteIdentity from '@/data/siteIdentity';
import type { InlineRun, RichText } from '@/types/learn';

/** Markdown-significant characters a visible text run must not smuggle into the copy. */
const SIGNIFICANT = /[\\*_[\]<>]/g;

/** Backslash-escapes the characters that would change how the visible words parse, and a leading `#`. */
function escapeText(text: string): string {
  const escaped = text.replace(SIGNIFICANT, (character) => `\\${character}`);
  return escaped.startsWith('#') ? `\\${escaped}` : escaped;
}

/** Turns a record href into the absolute URL the markdown copy links to. */
function toAbsoluteUrl(href: string): string {
  return href.startsWith('/') ? `${siteIdentity.url}${href}` : href;
}

/** Writes one run: a text run as written (escaped), a link run as a markdown link to an absolute URL. */
function renderRun(run: InlineRun): string {
  if (run.kind === 'text') return escapeText(run.text);
  return `[${escapeText(run.text)}](${toAbsoluteUrl(run.href)})`;
}

/**
 * Renders one piece of visible prose for the /learn markdown copy. The words
 * are exactly the runs' `text` in order; only link runs gain markup, and every
 * link is absolute so the copy reads the same wherever it is fetched from.
 */
export default function renderRichText(text: RichText): string {
  return text.map(renderRun).join('');
}
