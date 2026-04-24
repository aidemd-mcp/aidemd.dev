import type { LlmsTxtConfig } from '@/service/llmsTxt/types';

/**
 * Produces the one-sentence blockquote summary line.
 * Returns `> <summary>` followed by a blank line separator.
 */
export default function renderBlockquote(config: LlmsTxtConfig): string {
  return `> ${config.summary}\n\n`;
}
