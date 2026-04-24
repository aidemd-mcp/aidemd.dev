import type { LlmsTxtConfig } from '@/service/llmsTxt/types';

/**
 * Renders the three prose preamble paragraphs with no subheadings.
 * Joins overview, whyItMatters, and gettingStarted with blank-line
 * separators and terminates the block with a trailing blank line.
 */
export default function renderPreamble(config: LlmsTxtConfig): string {
  return [config.overview, config.whyItMatters, config.gettingStarted].join('\n\n') + '\n\n';
}
