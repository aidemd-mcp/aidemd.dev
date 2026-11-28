import type { SitePage } from '@/types/sitePage';

/** The fixed llms.txt copy; no origin, no paths. */
export type LlmsTxtConfig = {
  productName: string;
  summary: string;
  overview: string;
  whyItMatters: string;
  gettingStarted: string;
};

/** One page as publishSiteFiles hands it in; `markdown` is the page's full markdown text. */
export type LlmsPage = Pick<SitePage, 'urlPath' | 'title' | 'description' | 'kind' | 'breadcrumb'> & {
  markdown?: string;
};

/** A listed page with its absolute canonical URL. */
export type LlmsEntry = LlmsPage & { url: string };

/** One H2 of llms.txt. */
export type LlmsSection = { heading: string; entries: LlmsEntry[] };

/** The two composed documents. */
export type LlmsFiles = { llmsTxt: string; llmsFullTxt: string };
