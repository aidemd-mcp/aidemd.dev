import type { LearnCopy, LearnSlug } from "@/types/learn";
import claudeCodeSubagentsPipeline from "@/data/learn/claudeCodeSubagentsPipeline";
import intentDrivenEngineering from "@/data/learn/intentDrivenEngineering";
import mcpServerForDevelopmentWorkflow from "@/data/learn/mcpServerForDevelopmentWorkflow";
import openSourceAgenticSdlcFramework from "@/data/learn/openSourceAgenticSdlcFramework";
import specDrivenVsIntentDrivenDevelopment from "@/data/learn/specDrivenVsIntentDrivenDevelopment";
import specKitAlternatives from "@/data/learn/specKitAlternatives";

/**
 * Every /learn copy record keyed by its slug. Exhaustive by type: a seventh
 * slug is a compile error until its record is placed here.
 */
const copyBySlug: Record<LearnSlug, LearnCopy> = {
  "intent-driven-engineering": intentDrivenEngineering,
  "spec-driven-vs-intent-driven-development": specDrivenVsIntentDrivenDevelopment,
  "spec-kit-alternatives": specKitAlternatives,
  "claude-code-subagents-pipeline": claudeCodeSubagentsPipeline,
  "mcp-server-for-development-workflow": mcpServerForDevelopmentWorkflow,
  "open-source-agentic-sdlc-framework": openSourceAgenticSdlcFramework,
};

export default copyBySlug;
