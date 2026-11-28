import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { LearnBlock, LearnCopy } from "@/types/learn";
import checkCopyRules from "@/data/learn/checkCopyRules";
import listTextUnits from "@/data/learn/checkCopyRules/listTextUnits";
import mcpServerForDevelopmentWorkflow from "./index";

const INSTALL_LINE = "npx -y @aidemd-mcp/server@latest init";
const TOOLS_DIR = join(process.cwd(), ".aide", "reference", "tools");

/** Every block of every section, in page order. */
function listBlocks(copy: LearnCopy): LearnBlock[] {
  return copy.sections.flatMap((section) => section.blocks);
}

/** The tool names the shipped tools index lists, read from its table links. */
function listIndexedTools(): string[] {
  const index = readFileSync(join(TOOLS_DIR, "index.md"), "utf8");
  return [...index.matchAll(/\[(aide_[a-z_]+)\]\(\.\//g)].map((match) => match[1]);
}

/** The plain text of the section with this id, joined as the checker joins it. */
function sectionText(copy: LearnCopy, id: string): string {
  const alone = { ...copy, sections: copy.sections.filter((section) => section.id === id) };
  return listTextUnits(alone)
    .filter((unit) => unit.where.startsWith("section:") && !unit.where.endsWith(":heading"))
    .map((unit) => unit.text)
    .join(" ");
}

describe("mcpServerForDevelopmentWorkflow", () => {
  it("passes every copy rule", () => {
    expect(checkCopyRules(mcpServerForDevelopmentWorkflow)).toEqual([]);
  });

  it("is the draft record for its slug", () => {
    expect(mcpServerForDevelopmentWorkflow.slug).toBe("mcp-server-for-development-workflow");
    expect(mcpServerForDevelopmentWorkflow.status).toBe("draft");
  });

  it.each(["title", "h1"] as const)("%s names the searched phrase", (field) => {
    expect(mcpServerForDevelopmentWorkflow[field]).toContain("MCP server for development workflow");
  });

  it("carries no comparison and no faq", () => {
    expect(mcpServerForDevelopmentWorkflow.comparison).toBeUndefined();
    expect(mcpServerForDevelopmentWorkflow.faq).toBeUndefined();
  });

  it("has exactly one code block, the install line, in bash", () => {
    const codeBlocks = listBlocks(mcpServerForDevelopmentWorkflow).filter(
      (block) => block.kind === "code",
    );
    expect(codeBlocks).toEqual([{ kind: "code", lang: "bash", code: INSTALL_LINE }]);
  });

  it("names every tool the tools index lists, and only those", () => {
    const indexed = listIndexedTools();
    const named = [
      ...new Set(sectionText(mcpServerForDevelopmentWorkflow, "tools").match(/(?<![a-z_])aide_[a-z]+(?:_[a-z]+)*/g) ?? []),
    ];
    expect(indexed).toHaveLength(14);
    expect([...named].sort()).toEqual([...indexed].sort());
  });

  it.each(listIndexedTools())("has a reference page for tool %s", (name) => {
    expect(existsSync(join(TOOLS_DIR, `${name}.md`))).toBe(true);
  });

  it("links to the tools docs", () => {
    const links = listBlocks(mcpServerForDevelopmentWorkflow).flatMap((block) =>
      block.kind === "paragraph"
        ? block.text.flatMap((run) => (run.kind === "link" ? [run.href] : []))
        : [],
    );
    expect(links).toContain("/docs/tools/");
  });

  it.each(["/learn/claude-code-subagents-pipeline/", "/docs/"])("lists %s as related", (href) => {
    expect(mcpServerForDevelopmentWorkflow.related.map((link) => link.href)).toContain(href);
  });
});
