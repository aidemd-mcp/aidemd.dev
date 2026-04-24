import type { LlmsTxtConfig } from '@/service/llmsTxt/types';
import type { RouteGroup } from '@/service/llmsTxt/types';
import renderHeading from './renderHeading';
import renderBlockquote from './renderBlockquote';
import renderPreamble from './renderPreamble';
import renderSection from './renderSection';

/**
 * Assembles the complete llms.txt document from config and route groups.
 * Pipeline order matches the llmstxt.org spec exactly:
 *   H1 → blockquote → preamble (3 paragraphs) → H2 link lists (one per section).
 * Pure function — no I/O. Returns a UTF-8 string ending in exactly one `\n`.
 */
export default function composeDocument(config: LlmsTxtConfig, groups: RouteGroup[]): string {
  // Step 1: H1 product name line + blank separator.
  const heading = renderHeading(config);

  // Step 2: One-sentence blockquote + blank separator.
  const blockquote = renderBlockquote(config);

  // Step 3: Three bare prose paragraphs + trailing blank line.
  const preamble = renderPreamble(config);

  // Step 4: One H2 section per RouteGroup; sections join without extra whitespace
  // because renderSection already appends the inter-section blank line.
  const sections = groups.map(renderSection).join('');

  // Step 5: Concatenate the pipeline parts, then normalize so the document
  // ends in exactly one `\n` — trim trailing whitespace then re-add the newline.
  const raw = heading + blockquote + preamble + sections;
  return raw.trimEnd() + '\n';
}
