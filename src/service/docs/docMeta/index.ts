const BASE_URL = "https://aidemd.dev";
const SITE_NAME = "AIDE";

const PUBLISHER = {
  "@type": "Organization",
  name: "TetsuKodai Group LLC",
  url: "https://tetsukod.ai",
};

const AUTHOR = {
  "@type": "Organization",
  name: "TetsuKodai Group LLC",
};

/** Unique title and description for every canonical doc slug. */
const DOC_META: Record<string, { title: string; description: string }> = {
  "aide-spec": {
    title: "AIDE Spec — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The AIDE spec (.aide file) is a structured intent contract that governs a code module — defining scope, intent, desired outcomes, and failure modes for AI agent pipelines.",
  },
  "aide-template": {
    title: "AIDE Template — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The AIDE intent template is the canonical blank .aide file scaffold, providing the required fields and structure every module spec must follow in an AIDE-governed project.",
  },
  "plan-aide": {
    title: "Plan Spec — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The plan.aide file is the architect's sequenced build plan — a checked list of implementation steps the AIDE implementor executes top-to-bottom without design decisions.",
  },
  "todo-aide": {
    title: "Todo Spec — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The todo.aide file is the QA agent's output — a checklist of spec misalignments the AIDE implementor resolves one item per session to prevent context contamination.",
  },
  "progressive-disclosure": {
    title:
      "Progressive Disclosure — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "Progressive disclosure structures code in tiers — folder tree, JSDoc, inline comments — so AI agents stop at the shallowest layer that answers their question.",
  },
  "agent-readable-code": {
    title: "Agent-Readable Code — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "Agent-readable code is source structured so AI agents navigate it like humans do — by folder tree, then orchestrator imports, then inline details — without reading everything.",
  },
  "automated-qa": {
    title: "Automated QA — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "AIDE automated QA is a spec-driven validation loop where a QA agent produces todo.aide misalignment reports and the implementor resolves them one at a time in clean context.",
  },
  "cascading-alignment": {
    title: "Cascading Alignment — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "Cascading alignment ensures every child .aide spec narrows its parent's intent without contradiction, propagating project-level goals through the full AIDE intent tree.",
  },
};

type DocMetaResult = {
  title: string;
  description: string;
  canonicalUrl: string;
  siteName: string;
  jsonLd: Record<string, unknown>;
};

/**
 * Returns the unique SEO metadata and TechArticle JSON-LD for a canonical doc slug.
 *
 * Title and description pairs are hardcoded strings — not generated from templates —
 * per the spec's requirement for unique, non-near-duplicate descriptions on every page.
 * The datePublished field is supplied by the caller from citationMeta to avoid fabrication.
 */
export default function docMeta(
  slug: string,
  publishedAt: string,
): DocMetaResult {
  const entry = DOC_META[slug];
  if (!entry) {
    throw new Error(
      `docMeta: no metadata entry for doc slug "${slug}" — add it to the meta table`,
    );
  }

  const { title, description } = entry;
  const canonicalUrl = `${BASE_URL}/docs/${slug}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url: canonicalUrl,
    datePublished: publishedAt,
    author: AUTHOR,
    publisher: PUBLISHER,
  };

  return {
    title,
    description,
    canonicalUrl,
    siteName: SITE_NAME,
    jsonLd,
  };
}
