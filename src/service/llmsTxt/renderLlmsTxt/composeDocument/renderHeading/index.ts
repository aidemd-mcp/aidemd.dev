import type { LlmsTxtConfig } from '@/service/llmsTxt/types';

/**
 * Produces the H1 line for the llms.txt document.
 * Returns `# <productName>` followed by a blank line separator.
 */
export default function renderHeading(config: LlmsTxtConfig): string {
  return `# ${config.productName}\n\n`;
}
