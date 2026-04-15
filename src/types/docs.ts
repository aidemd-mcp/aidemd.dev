export type ContentType = "docs" | "agents" | "commands" | "skills";

export type CitationMeta = {
  publishedAt: string;
  sourceCommit: string;
  versionedUrl: string;
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
