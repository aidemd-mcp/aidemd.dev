/** The slug of each /learn page; also its URL segment. */
export type LearnSlug =
  | 'intent-driven-engineering'
  | 'spec-driven-vs-intent-driven-development'
  | 'spec-kit-alternatives'
  | 'claude-code-subagents-pipeline'
  | 'mcp-server-for-development-workflow'
  | 'open-source-agentic-sdlc-framework';

/** Draft marker on a copy record; rendering never branches on it. */
export type LearnReviewStatus = 'draft' | 'reviewed';

/**
 * One run of inline prose. A link's `href` is root-relative with a trailing
 * slash for site pages (optionally with `#anchor`) or an absolute `https://`
 * URL; a run's `text` is exactly what the reader sees.
 */
export type InlineRun =
  | { kind: 'text'; text: string }
  | { kind: 'link'; text: string; href: string };

/** One piece of visible prose; its plain text is the in-order concatenation of every run's `text`. */
export type RichText = InlineRun[];

/** A glossary entry; `id` is the stable anchor and `definition` flattens to the DefinedTerm description. */
export type GlossaryTerm = { id: string; term: string; definition: RichText };

/** One content block inside a section. */
export type LearnBlock =
  | { kind: 'paragraph'; text: RichText }
  | { kind: 'list'; items: RichText[] }
  | { kind: 'code'; lang: string; code: string }
  | { kind: 'glossary'; terms: GlossaryTerm[] };

/** A headed section; `id` comes from the record, not the heading text. */
export type LearnSection = { id: string; heading: string; blocks: LearnBlock[] };

/** A plain-text table cell; `asOf` is `YYYY-MM-DD` and required on every competitor number. */
export type ComparisonCell = { text: string; asOf?: string };

/** One row of a comparison table. */
export type ComparisonRow = { cells: ComparisonCell[] };

/** A captioned comparison table. */
export type ComparisonTable = {
  caption: string;
  columns: string[];
  rows: ComparisonRow[];
};

/** One FAQ entry; the FAQPage answer text is `answer` flattened to plain text. */
export type FaqItem = { question: string; answer: RichText };

/** An outbound link in the related list; internal hrefs carry a trailing slash. */
export type RelatedLink = { label: string; href: string };

/** The one copy record per /learn page. */
export type LearnCopy = {
  slug: LearnSlug;
  status: LearnReviewStatus;
  title: string;
  description: string;
  h1: string;
  answer: RichText;
  sections: LearnSection[];
  comparison?: ComparisonTable;
  faq?: FaqItem[];
  related: RelatedLink[];
};

/** One roster entry; `sourcePath` is the repo-relative path of the page's copy module, whose git dates are the page's dates. */
export type LearnRosterEntry = Pick<LearnCopy, 'slug' | 'title' | 'description'> & {
  urlPath: `/learn/${LearnSlug}/`;
  sourcePath: string;
};

/** The /learn index page's words. */
export type LearnIndexCopy = Pick<LearnCopy, 'status' | 'title' | 'description' | 'h1' | 'answer'>;

/** The fixed words and ids every /learn page and its markdown copy share. */
export type LearnTemplateLabels = {
  faqHeading: string;
  faqId: string;
  relatedHeading: string;
  relatedId: string;
  asOfPrefix: string;
  updatedLabel: string;
  breadcrumbHome: string;
  breadcrumbLearn: string;
};

/** One visible string of a copy record and where it sits, for the copy-rules check. */
export type TextUnit = { where: string; text: string };
