import type { LlmsEntry } from '@/types/llmsTxt';

/**
 * Renders one bullet line in the llmstxt.org format.
 * Title and description are emitted byte for byte — never trimmed, split or
 * escaped. A newline in either would break the one-line link format, so it
 * throws rather than silently rewriting the page's words.
 * Emits the description suffix only when the description is non-empty.
 * The line always ends in `\n`.
 */
export default function renderLink(entry: LlmsEntry): string {
  if (entry.title.includes('\n')) {
    throw new Error(`llms.txt entry ${entry.url} has a newline in its title`);
  }
  if (entry.description.includes('\n')) {
    throw new Error(`llms.txt entry ${entry.url} has a newline in its description`);
  }
  if (entry.description === '') return `- [${entry.title}](${entry.url})\n`;
  return `- [${entry.title}](${entry.url}): ${entry.description}\n`;
}
