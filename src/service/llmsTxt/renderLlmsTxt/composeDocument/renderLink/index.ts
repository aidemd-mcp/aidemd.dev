import type { LinkEntry } from '@/service/llmsTxt/types';

/**
 * Renders one bullet line in the llmstxt.org format.
 * Emits the description suffix only when the description is non-empty.
 * The line always ends in `\n`.
 */
export default function renderLink(entry: LinkEntry): string {
  if (entry.description) {
    return `- [${entry.title}](${entry.absoluteUrl}): ${entry.description}\n`;
  }
  return `- [${entry.title}](${entry.absoluteUrl})\n`;
}
