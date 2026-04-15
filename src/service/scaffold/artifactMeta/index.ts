import type { ScaffoldArtifact, PageSeo } from "@/types/scaffold";

type ArtifactMetaInput = {
  slug: string;
  kind: ScaffoldArtifact["kind"];
};

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

/** Title and description for every agent artifact. */
const AGENT_META: Record<string, { title: string; description: string }> = {
  "aide-spec-writer": {
    title: "AIDE Spec Writer — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The AIDE spec writer agent interviews stakeholders and domain experts to draft a structured .aide intent spec that governs a code module through the full agent pipeline.",
  },
  "aide-domain-expert": {
    title: "AIDE Domain Expert — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The AIDE domain expert agent supplies business-domain knowledge to the spec and strategy phases, ensuring agent pipeline decisions reflect real-world constraints and terminology.",
  },
  "aide-strategist": {
    title: "AIDE Strategist — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The AIDE strategist agent reads an intent spec and produces a high-level approach document that resolves ambiguities before the architect writes a single implementation step.",
  },
  "aide-architect": {
    title: "AIDE Architect — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The AIDE architect agent reads a strategy spec and brain research, then produces a step-by-step plan.aide that the implementor executes without further design decisions.",
  },
  "aide-implementor": {
    title: "AIDE Implementor — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The AIDE implementor agent executes plan.aide steps top-to-bottom, writing production-quality code with zero architectural drift from the architect's specification.",
  },
  "aide-qa": {
    title: "AIDE QA — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The AIDE QA agent validates implemented code against the intent spec, producing a todo.aide of misalignments for the implementor to fix one item per session.",
  },
  "aide-aligner": {
    title: "AIDE Aligner — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The AIDE aligner agent checks that child .aide specs do not contradict their parent specs, enforcing cascading alignment across the full intent tree of a project.",
  },
  "aide-auditor": {
    title: "AIDE Auditor — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The AIDE auditor agent performs a final code review against the intent spec, catching drift, dead code, and contract violations before a feature is marked complete.",
  },
  "aide-explorer": {
    title: "AIDE Explorer — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The AIDE explorer agent navigates an unfamiliar codebase using progressive disclosure tiers, building a minimal context map before any implementation work begins.",
  },
};

/** Title and description for every command artifact. */
const COMMAND_META: Record<string, { title: string; description: string }> = {
  aide: {
    title: "aide — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide slash command is the root dispatcher in the AIDE Claude Code toolchain, routing to spec, plan, build, qa, and other pipeline subcommands from a single entry point.",
  },
  "aide-spec": {
    title: "aide:spec — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide:spec command launches the AIDE spec writer agent to produce or update a .aide intent spec for the current module through an interactive interview process.",
  },
  "aide-research": {
    title: "aide:research — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide:research command invokes the AIDE domain expert agent to gather and synthesize domain knowledge into the brain vault before spec or strategy work begins.",
  },
  "aide-synthesize": {
    title: "aide:synthesize — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide:synthesize command runs the AIDE strategist agent to transform a finalized intent spec into a high-level strategy document that resolves open design questions.",
  },
  "aide-plan": {
    title: "aide:plan — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide:plan command runs the AIDE architect agent to convert a strategy document into a sequenced plan.aide that the implementor can execute step by step.",
  },
  "aide-build": {
    title: "aide:build — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide:build command runs the AIDE implementor agent to execute the current plan.aide, writing production-quality code for each unchecked step in sequence.",
  },
  "aide-qa": {
    title: "aide:qa — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide:qa command runs the AIDE QA agent to validate implemented code against its intent spec, writing a todo.aide of misalignments for the fix loop.",
  },
  "aide-fix": {
    title: "aide:fix — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide:fix command runs the AIDE implementor in fix mode, resolving exactly one unchecked item from todo.aide per session to avoid context contamination.",
  },
  "aide-refactor": {
    title: "aide:refactor — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide:refactor command guides a controlled refactor under AIDE governance, updating the intent spec first so code changes remain aligned with documented intent.",
  },
  "aide-align": {
    title: "aide:align — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide:align command runs the AIDE aligner agent to verify that all child .aide specs in a project do not contradict or exceed their parent spec's scope.",
  },
  "aide-init": {
    title: "aide:init — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide:init command bootstraps the full AIDE scaffold into a project: .aide/ docs, .claude/agents/, .claude/commands/, and .claude/skills/ with all canonical files.",
  },
  "aide-upgrade": {
    title: "aide:upgrade — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide:upgrade command syncs all AIDE scaffold files — docs, agents, commands, and skills — to the latest canonical versions without touching project-specific .aide specs.",
  },
  "aide-update-playbook": {
    title: "aide:update-playbook — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The /aide:update-playbook command pulls the latest coding playbook notes from the brain vault into the active session context so agents work from current conventions.",
  },
};

/** Title and description for every skill artifact. */
const SKILL_META: Record<string, { title: string; description: string }> = {
  "study-playbook": {
    title: "study-playbook — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The study-playbook AIDE skill navigates the coding playbook hub top-down, loading only the section notes relevant to the current task rather than the entire playbook.",
  },
  brain: {
    title: "brain — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "The brain AIDE skill reads from a persistent external knowledge store (Obsidian vault via MCP) to load domain research and engineering conventions into the agent session.",
  },
};

function lookupMeta(
  slug: string,
  kind: ScaffoldArtifact["kind"],
): { title: string; description: string } {
  const table =
    kind === "agent"
      ? AGENT_META
      : kind === "command"
        ? COMMAND_META
        : SKILL_META;

  const entry = table[slug];
  if (!entry) {
    throw new Error(
      `artifactMeta: no metadata entry for ${kind} "${slug}" — add it to the meta table`,
    );
  }

  return entry;
}

/**
 * Returns the complete SEO metadata object for a given scaffold artifact.
 *
 * Title and description pairs are hardcoded strings — not generated from templates —
 * per the spec's requirement for unique, non-near-duplicate descriptions on every page.
 * Generates the TechArticle JSON-LD, canonical URL, and OG type.
 */
export default function artifactMeta({
  slug,
  kind,
}: ArtifactMetaInput): PageSeo {
  const { title, description } = lookupMeta(slug, kind);

  const routePrefix =
    kind === "agent" ? "agents" : kind === "command" ? "commands" : "skills";
  const canonicalUrl = `${BASE_URL}/${routePrefix}/${slug}`;

  // datePublished is intentionally omitted here — it is filled in at the page
  // level using the artifact's publishedAt field, which is sourced from the
  // file's actual modification time rather than a hardcoded constant.
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url: canonicalUrl,
    author: AUTHOR,
    publisher: PUBLISHER,
  };

  return {
    title,
    description,
    canonicalUrl,
    ogType: "article",
    jsonLd,
  };
}
