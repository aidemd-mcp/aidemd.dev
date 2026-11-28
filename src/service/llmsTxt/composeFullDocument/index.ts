import type { LlmsSection, LlmsTxtConfig } from '@/types/llmsTxt';
import renderHeading from '../shared/renderHeading';
import renderBlockquote from '../shared/renderBlockquote';
import renderEntry from './renderEntry';

/**
 * Assembles the complete llms-full.txt document: the same H1 and blockquote as
 * llms.txt, then the full text of every `doc` and `learn` entry in section
 * order. Index-only pages (section indexes, /learn index, /observer, /brain)
 * carry no entry. Pure function — no I/O. Throws when an included entry has no
 * text. Returns a string ending in exactly one `\n`.
 */
export default function composeFullDocument({
  config,
  sections,
}: {
  config: LlmsTxtConfig;
  sections: LlmsSection[];
}): string {
  // Step 1: H1 product name + one-sentence blockquote, as in llms.txt.
  const opening = renderHeading(config) + renderBlockquote(config);

  // Step 2: Full text of every doc and learn entry, in section order.
  const entries = sections
    .flatMap(section => section.entries)
    .filter(entry => entry.kind === 'doc' || entry.kind === 'learn')
    .map(renderEntry);

  // Step 3: Entries are separated by one blank line (each ends in `\n`);
  // normalize to exactly one trailing newline.
  return (opening + entries.join('\n')).trimEnd() + '\n';
}
