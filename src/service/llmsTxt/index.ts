import type { LlmsFiles, LlmsPage } from '@/types/llmsTxt';
import llmsTxtConfig from './llmsTxtConfig';
import buildSections from './buildSections';
import composeDocument from './composeDocument';
import composeFullDocument from './composeFullDocument';

/**
 * Composes llms.txt and llms-full.txt from the page list the pre-deploy step
 * hands in. The section list is built once and given to both composers, so the
 * two documents cannot disagree about which pages exist or their order.
 *
 * Pure: no I/O, no imports of any service or of listSitePages. The caller
 * passes the page list (with `markdown` on every doc and learn page) and writes
 * the returned strings. Errors from bad input propagate to the caller so the
 * build fails.
 */
export default function composeLlmsFiles({ pages }: { pages: LlmsPage[] }): LlmsFiles {
  // Step 1: Fixed copy this module owns.
  const config = llmsTxtConfig();

  // Step 2: Group the page list into docs sections, Learn and Optional.
  const sections = buildSections({ pages });

  // Step 3: Compose both documents from the same sections.
  return {
    llmsTxt: composeDocument({ config, sections }),
    llmsFullTxt: composeFullDocument({ config, sections }),
  };
}
