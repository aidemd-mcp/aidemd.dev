import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import type { InlineRun } from "@/types/learn";
import checkCopyRules from "@/data/learn/checkCopyRules";
import listTextUnits from "@/data/learn/checkCopyRules/listTextUnits";
import claudeCodeSubagentsPipeline from "./index";

const STAGES = ["spec", "research", "synthesize", "plan", "build", "QA", "fix"] as const;

const AGENT_NAME_PATTERN = /\baide-[a-z]+(?:-[a-z]+)*\b/g;
const COMMAND_PATTERN = /(?<![\w/.:-])\/aide(?::[a-z]+)?(?![\w:-])/g;

const repoRoot = process.cwd();
const copy = claudeCodeSubagentsPipeline;
const allText = listTextUnits(copy)
  .map((unit) => unit.text)
  .join("\n");

/** Every distinct match of a pattern across the record's visible text, in first-seen order. */
function collect(pattern: RegExp): string[] {
  return [...new Set(allText.match(pattern) ?? [])];
}

/** The command file a slash command names: `/aide` is aide.md, `/aide:plan` is aide/plan.md. */
function commandFile(command: string): string {
  const [, stage] = command.split(":");
  return stage ? `.claude/commands/aide/${stage}.md` : ".claude/commands/aide.md";
}

/** Every link run in the record's sections. */
function listLinkRuns(): Extract<InlineRun, { kind: "link" }>[] {
  const runs = copy.sections.flatMap((section) =>
    section.blocks.flatMap((block) => (block.kind === "paragraph" ? block.text : [])),
  );
  return runs.filter((run): run is Extract<InlineRun, { kind: "link" }> => run.kind === "link");
}

describe("claudeCodeSubagentsPipeline", () => {
  it("is a draft record for its own slug that passes the copy rules", () => {
    expect(copy.slug).toBe("claude-code-subagents-pipeline");
    expect(copy.status).toBe("draft");
    expect(checkCopyRules(copy)).toEqual([]);
  });

  it("names the Claude Code subagents pipeline in its title and h1", () => {
    expect(copy.title).toMatch(/claude code subagents? pipeline/i);
    expect(copy.h1).toMatch(/claude code subagents? pipeline/i);
  });

  it("defines the pipeline in the answer before any section", () => {
    const answer = copy.answer.map((run) => run.text).join("");
    expect(answer).toMatch(/^A Claude Code subagents pipeline is /);
  });

  it("has no comparison table and no FAQ", () => {
    expect(copy.comparison).toBeUndefined();
    expect(copy.faq).toBeUndefined();
  });

  it("walks the seven stages in section headings in the package's order", () => {
    const headings = copy.sections.map((section) => section.heading.toLowerCase());
    const positions = STAGES.map((stage) =>
      headings.findIndex((heading) => new RegExp(`\\b${stage.toLowerCase()}\\b`).test(heading)),
    );
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(new Set(positions).size).toBe(STAGES.length);
  });

  it("names the agent behind each stage in its section, as the command docs name it", () => {
    const agentByStage: Record<string, string> = {
      spec: "aide-spec-writer",
      research: "aide-domain-expert",
      synthesize: "aide-strategist",
      plan: "aide-architect",
      build: "aide-implementor",
      qa: "aide-qa",
      fix: "aide-implementor",
    };
    for (const [stage, agent] of Object.entries(agentByStage)) {
      const section = copy.sections.find((candidate) => candidate.id === stage);
      expect(section, `section ${stage}`).toBeDefined();
      expect(section!.heading).toContain(agent);
    }
  });

  it("states that research and synthesize are skipped when a feature does not need them", () => {
    const research = listTextUnits(copy).filter((unit) => unit.where.startsWith("section:research:"));
    const synthesize = listTextUnits(copy).filter((unit) => unit.where.startsWith("section:synthesize:"));
    expect(research.map((unit) => unit.text).join(" ")).toMatch(/optional/i);
    expect(synthesize.map((unit) => unit.text).join(" ")).toMatch(/optional/i);
    expect(allText).toMatch(/skipped by default/);
  });

  it("states that every stage starts fresh and hands on through files", () => {
    expect(allText).toMatch(/fresh context/);
    expect(allText).toMatch(/What passes between stages is files/);
    for (const file of [".aide", "brief.aide", "plan.aide", "todo.aide"]) {
      expect(allText).toContain(file);
    }
  });

  it("has a heading that contains AI coding agent orchestration", () => {
    expect(copy.sections.some((section) => section.heading.includes("AI coding agent orchestration"))).toBe(true);
  });

  describe("agent names", () => {
    const agents = collect(AGENT_NAME_PATTERN);

    it("finds the agents the stages name", () => {
      expect(agents).toEqual(
        expect.arrayContaining([
          "aide-spec-writer",
          "aide-domain-expert",
          "aide-strategist",
          "aide-architect",
          "aide-implementor",
          "aide-qa",
          "aide-maintainer",
        ]),
      );
    });

    it.each(agents)("%s has an agent file in the package", (name) => {
      expect(existsSync(path.join(repoRoot, ".claude/agents/aide", `${name}.md`))).toBe(true);
    });
  });

  describe("slash commands", () => {
    const commands = collect(COMMAND_PATTERN);

    it("finds /aide and the seven stage commands", () => {
      expect(commands).toEqual(
        expect.arrayContaining([
          "/aide",
          "/aide:spec",
          "/aide:research",
          "/aide:synthesize",
          "/aide:plan",
          "/aide:build",
          "/aide:qa",
          "/aide:fix",
        ]),
      );
    });

    it.each(commands)("%s has a command file in the package", (command) => {
      expect(existsSync(path.join(repoRoot, commandFile(command)))).toBe(true);
    });
  });

  it("links the Hooks docs and the observer page from the hooks section", () => {
    const hrefs = listLinkRuns().map((run) => run.href);
    expect(hrefs).toContain("/docs/hooks/");
    expect(hrefs).toContain("/observer/");
    const hooksSection = copy.sections.find((section) => section.id === "hooks-and-observer");
    const hooksHrefs = hooksSection!.blocks.flatMap((block) =>
      block.kind === "paragraph" ? block.text.flatMap((run) => (run.kind === "link" ? [run.href] : [])) : [],
    );
    expect(hooksHrefs).toEqual(expect.arrayContaining(["/docs/hooks/", "/observer/"]));
  });

  it("describes hooks and the observer no further than the shipped facts", () => {
    expect(allText).toMatch(/Hooks work with Claude Code only/);
    expect(allText).toMatch(/no desktop notifications, no telemetry and no account/);
    expect(allText).not.toMatch(/\bnotif(?:y|ies|ication)s? you\b/i);
  });

  it("ships exactly the install line from the package as its one code block", () => {
    const codeBlocks = copy.sections.flatMap((section) =>
      section.blocks.flatMap((block) => (block.kind === "code" ? [block] : [])),
    );
    expect(codeBlocks).toEqual([{ kind: "code", lang: "bash", code: "npx -y @aidemd-mcp/server@latest init" }]);
  });

  it("lists the four related links the page spec names", () => {
    expect(copy.related.map((link) => link.href)).toEqual(
      expect.arrayContaining([
        "/observer/",
        "/docs/hooks/",
        "/learn/mcp-server-for-development-workflow/",
        "/learn/intent-driven-engineering/",
      ]),
    );
  });

  it("writes no markdown backtick in any text unit, since RichText renders them literally", () => {
    const withBacktick = listTextUnits(copy).filter((unit) => unit.text.includes("`"));
    expect(withBacktick).toEqual([]);
  });
});
