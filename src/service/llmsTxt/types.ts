import type { DocSection } from '@/types/docs';

/** Product identity and static copy surfaces for the llms.txt generator. */
export type LlmsTxtConfig = {
  /** The H1 product name line. */
  productName: string;
  /** One-sentence blockquote summary. */
  summary: string;
  /** First preamble paragraph — what AIDE and the package are. */
  overview: string;
  /** Second preamble paragraph — why this matters to the agent reading the file. */
  whyItMatters: string;
  /** Third preamble paragraph — how to install and where to find docs. */
  gettingStarted: string;
  /** Canonical origin. Literal type acts as a drift guard. */
  origin: 'https://aidemd.dev';
  /** Site-root path where the file is served. */
  outputPath: string;
  /** Repo-relative path where the render script writes the file. */
  filesystemPath: string;
};

/** One rendered bullet in the llms.txt link list. */
export type LinkEntry = {
  title: string;
  absoluteUrl: string;
  /** Required — empty string is valid, undefined is not, so the renderer never branches on presence. */
  description: string;
};

/** One H2 section's worth of links. */
export type RouteGroup = {
  section: DocSection;
  /** H2 heading text — sourced from SECTION_INDEX_META[section].label. */
  label: string;
  /** Entries in the registry's deterministic within-section order. */
  entries: LinkEntry[];
};
