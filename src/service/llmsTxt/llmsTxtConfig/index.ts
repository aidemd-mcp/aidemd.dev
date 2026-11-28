import type { LlmsTxtConfig } from '@/types/llmsTxt';

/**
 * Returns the frozen canonical LlmsTxtConfig for aidemd.dev/llms.txt and
 * llms-full.txt. Every static copy surface the composers emit — product name,
 * blockquote summary, and three prose preamble paragraphs — is centralised
 * here. Link-list text comes from the page list handed to the orchestrator;
 * this file never names a page. The site origin comes from siteIdentity, and
 * writing the files belongs to the pre-deploy step, so neither lives here.
 *
 * Object.freeze ensures mutation attempts throw in strict mode, matching the
 * drift-guard pattern established by ogImageConfig.
 */
export default function llmsTxtConfig(): LlmsTxtConfig {
  return Object.freeze({
    productName: 'AIDE — Autonomous Intent-Driven Engineering',

    summary:
      'The canonical home of the AIDE methodology and the @aidemd-mcp/server package — a short `.aide` intent spec lives next to the code it governs, and that spec is the contract every agent plans, builds, and QAs against.',

    overview:
      'AIDE (Autonomous Intent-Driven Engineering) treats intent as a first-class artifact. A short `.aide` doc sits next to each orchestrator, declares the module\'s scope, intent, and outcomes, and becomes the contract downstream agents work from. `@aidemd-mcp/server` is the MCP server that ships AIDE as a set of commands, subagents, and skills a Claude Code (or compatible) host can install in one step.',

    whyItMatters:
      'If you are an agent operating inside a codebase that ships `.aide` files, this methodology governs how you read those specs, plan from them, build against them, and validate your output. The docs below are the authoritative reference for every stage of that pipeline.',

    gettingStarted:
      'To install the methodology into a host project, run `npx @aidemd-mcp/server init`. To browse the docs in a human-readable form, visit https://aidemd.dev/.',
  });
}
