import type { LlmsFiles } from '@/types/llmsTxt';
import type { OgCardImage } from '@/types/socialShare';
import type { SitePage } from '@/types/sitePage';

/** One file the pre-deploy step writes; path relative to public/. */
export type SiteFile = { path: string; content: string | Buffer };

/** Everything the pre-deploy step composes its files from. */
export type OutputSources = {
  pages: SitePage[];
  llms: LlmsFiles;
  feedXml: string;
  securityTxt: string;
  markdown: Map<string, string>;
  images: OgCardImage[];
};

/** What one pre-deploy run wrote, by kind. */
export type PublishReport = {
  files: number;
  markdownCopies: number;
  shareImages: number;
  feedEntries: number;
};
