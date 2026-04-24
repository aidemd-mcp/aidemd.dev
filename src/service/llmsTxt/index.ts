import type { LlmsTxtConfig } from './types';
import llmsTxtConfig from './llmsTxtConfig';

/**
 * llms.txt orchestrator for aidemd.dev.
 *
 * Resolves the canonical LlmsTxtConfig once at module load and re-exports it
 * for any consumer that needs the content contract — the config carries all
 * static copy surfaces (product name, blockquote summary, three prose
 * preamble paragraphs, canonical origin, and output paths) that the
 * llmstxt.org document shape requires.
 *
 * The render script at renderLlmsTxt/ is a sibling helper invoked only via
 * `npm run llms:render` (through the `prebuild` hook). It is deliberately not
 * imported here — keeping `node:fs/promises` writes out of the Next.js build
 * graph is the load-bearing constraint that preserves the zero-runtime-Node-
 * dependency contract. docsRegistry is similarly absent at this layer: the
 * orchestrator is pure config, no registry walk required.
 */
export const llmsTxt: LlmsTxtConfig = llmsTxtConfig();

export default llmsTxt;
