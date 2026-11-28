import type { LearnSlug } from "@/types/learn";

/**
 * The one ordering every /learn listing follows: the six pages in research
 * priority order. The roster, the page list, the llms files, the sitemap and
 * the feed all read pages in this order.
 */
const priorityOrder = [
  "intent-driven-engineering",
  "spec-driven-vs-intent-driven-development",
  "spec-kit-alternatives",
  "claude-code-subagents-pipeline",
  "mcp-server-for-development-workflow",
  "open-source-agentic-sdlc-framework",
] as const satisfies readonly LearnSlug[];

export default priorityOrder;
