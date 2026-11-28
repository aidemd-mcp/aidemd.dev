import type { LearnIndexCopy } from "@/types/learn";

/**
 * The /learn index page's words: the section's title, description, h1 and the
 * short answer that says what its six pages cover. Drafted from the six page
 * records' own descriptions; it adds no fact they do not already state. Status
 * stays "draft" until the founder has reviewed the page live.
 */
const learnIndex: LearnIndexCopy = {
  status: "draft",
  title: "Intent-driven engineering guides and comparisons",
  description:
    "Guides and comparisons on intent-driven engineering: definition, spec-driven development, spec-kit alternatives, Claude Code subagents, MCP install and agentic SDLC.",
  h1: "Intent-driven engineering guides and comparisons",
  answer: [
    {
      kind: "text",
      text: "These six pages answer what intent-driven engineering is, how it differs from spec-driven development, which spec-kit alternatives exist, how a Claude Code subagents pipeline runs, how to install the AIDE MCP server (intent-driven, aidemd), and how it maps to an agentic SDLC.",
    },
  ],
};

export default learnIndex;
