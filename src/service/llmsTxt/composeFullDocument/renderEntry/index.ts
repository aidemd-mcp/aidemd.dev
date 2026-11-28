import type { LlmsEntry } from '@/types/llmsTxt';
import stripLeadingTitle from './stripLeadingTitle';

/**
 * Renders one llms-full.txt entry: `# <title>`, `Source: <url>`, a blank line,
 * then the page text whole. Throws naming the url when the page arrives without
 * text — a partial entry would silently hide a broken upstream render.
 */
export default function renderEntry(entry: LlmsEntry): string {
  const { markdown, title, url } = entry;
  if (markdown === undefined || markdown.trim() === '') {
    throw new Error(`llms-full.txt entry has no text: ${url}`);
  }

  const body = stripLeadingTitle({ markdown, title }).trimEnd();
  return `# ${title}\nSource: ${url}\n\n${body}\n`;
}
