import type { LearnSlug } from "@/types/learn";

/**
 * The repo-relative path (forward slashes) of each page's copy module. The
 * module's git dates are the page's published and modified dates.
 */
const sourcePathBySlug: Record<LearnSlug, string> = {
  "intent-driven-engineering": "src/data/learn/intentDrivenEngineering/index.ts",
  "spec-driven-vs-intent-driven-development": "src/data/learn/specDrivenVsIntentDrivenDevelopment/index.ts",
  "spec-kit-alternatives": "src/data/learn/specKitAlternatives/index.ts",
  "claude-code-subagents-pipeline": "src/data/learn/claudeCodeSubagentsPipeline/index.ts",
  "mcp-server-for-development-workflow": "src/data/learn/mcpServerForDevelopmentWorkflow/index.ts",
  "open-source-agentic-sdlc-framework": "src/data/learn/openSourceAgenticSdlcFramework/index.ts",
};

export default sourcePathBySlug;
