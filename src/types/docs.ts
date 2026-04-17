export type ContentType = "docs" | "agents" | "commands" | "skills";

export type CitationMeta = {
  publishedAt: string;
  sourceCommit: string;
  versionedUrl: string;
  /** Short SHA of the prior version from `.aide/versions.json` upstream canonical history. */
  previousCommit?: string;
  waybackUrl?: string;
};

export type CanonicalDoc = {
  slug: string;
  title: string;
  contentHtml: string;
  sourceText: string;
  frontmatter: Record<string, unknown>;
  citationMeta: CitationMeta;
};

export type BuildManifestEntry = {
  live: string;
  sourceCommit: string;
  publishedAt: string;
  wayback: string;
};

export type BuildManifest = Record<string, BuildManifestEntry>;
