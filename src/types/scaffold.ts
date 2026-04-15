/**
 * Types for scaffold artifact pages and their SEO metadata.
 * Scaffold artifacts are the agents, commands, and skills installed by aide_init.
 */

/** A fully rendered scaffold artifact ready for page display. */
export type ScaffoldArtifact = {
  /** URL segment used in the dynamic route, e.g. "aide-architect". */
  slug: string;
  /** Human-readable display name, e.g. "AIDE Architect". */
  title: string;
  /** 140-160 character meta description for the artifact page. */
  description: string;
  /** Discriminates the artifact category. */
  kind: "agent" | "command" | "skill";
  /** Markdown source rendered to HTML for page display. */
  contentHtml: string;
  /** Raw markdown source text. */
  sourceText: string;
  /** ISO 8601 date string sourced from git history, e.g. "2026-04-11T17:38:56-07:00". */
  publishedAt: string;
  /** Short (7-char) SHA of the git commit that last modified the source file. */
  commitSha: string;
};

/** A single entry in the scaffold tree displayed on the docs index. */
export type ScaffoldTreeEntry = {
  /** Source filename as it appears on disk, e.g. "aide-architect.md". */
  filename: string;
  /** URL segment for the rendered page, e.g. "aide-architect". */
  slug: string;
  /** Human-readable display name, e.g. "AIDE Architect". */
  title: string;
  /** Discriminates the entry category for routing and grouping. */
  kind: "doc" | "agent" | "command" | "skill";
};

/** Shared SEO metadata shape for per-page metadata generation. */
export type PageSeo = {
  /** Page title tag value. */
  title: string;
  /** 140-160 character meta description. */
  description: string;
  /** Fully-qualified canonical URL, e.g. "https://aidemd.dev/agents/aide-architect". */
  canonicalUrl: string;
  /** Open Graph type: "website" for index pages, "article" for content pages. */
  ogType: "website" | "article";
  /** TechArticle or other JSON-LD structured data object for this page. */
  jsonLd: Record<string, unknown>;
};
