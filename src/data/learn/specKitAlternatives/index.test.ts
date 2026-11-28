import { describe, expect, it } from "vitest";
import type { LearnBlock, RichText } from "@/types/learn";
import checkCopyRules from "@/data/learn/checkCopyRules";
import specKitAlternatives from ".";

const TOOL_NAMES = [
  "spec-kit",
  "OpenSpec",
  "BMAD-METHOD",
  "superpowers",
  "Kiro",
  "Tessl",
  "Agent OS",
  "Task Master",
  "AIDE (intent-driven, aidemd)",
];

const DATED_TOOLS: [string, string, string, string][] = [
  ["superpowers", "326,728", "2026-11-24", "2026-11-25"],
  ["spec-kit", "151,401", "2026-11-25", "2026-11-25"],
  ["OpenSpec", "75,742", "2026-11-25", "2026-11-25"],
  ["BMAD-METHOD", "55,759", "2026-11-25", "2026-11-25"],
  ["Task Master", "28,550", "2026-04-28", "2026-11-25"],
  ["Agent OS", "5,640", "2026-10-07", "2026-11-25"],
  ["AIDE (intent-driven, aidemd)", "4", "2026-11-26", "2026-11-26"],
];

const UNDATED_TOOLS = ["Kiro", "Tessl"];

const STARS_COLUMN = specKitAlternatives.comparison!.columns.indexOf("GitHub stars");
const PUSH_COLUMN = specKitAlternatives.comparison!.columns.indexOf("Last push");

function plain(text: RichText): string {
  return text.map((run) => run.text).join("");
}

function blockText(block: LearnBlock): string {
  if (block.kind === "paragraph") return plain(block.text);
  if (block.kind === "list") return block.items.map(plain).join(" ");
  return "";
}

function findRow(tool: string) {
  const row = specKitAlternatives.comparison!.rows.find((candidate) => candidate.cells[0].text === tool);
  if (!row) throw new Error(`no comparison row for ${tool}`);
  return row;
}

const whoFitsText = specKitAlternatives.sections
  .filter((section) => section.id.startsWith("who-fits"))
  .flatMap((section) => section.blocks.map(blockText))
  .join(" ");

describe("specKitAlternatives", () => {
  it("passes every copy rule", () => {
    expect(checkCopyRules(specKitAlternatives)).toEqual([]);
  });

  it("is a draft with the right slug", () => {
    expect(specKitAlternatives.slug).toBe("spec-kit-alternatives");
    expect(specKitAlternatives.status).toBe("draft");
  });

  it("carries the searched phrases in the h1 and a section heading", () => {
    expect(specKitAlternatives.h1.toLowerCase()).toContain("spec-kit alternatives");
    expect(specKitAlternatives.sections.some((section) => section.heading.includes("Spec-kit vs OpenSpec"))).toBe(
      true,
    );
  });

  it("names the options in the answer", () => {
    const answer = plain(specKitAlternatives.answer);
    for (const name of ["OpenSpec", "BMAD-METHOD", "superpowers", "Kiro", "Tessl", "Agent OS", "Task Master"]) {
      expect(answer).toContain(name);
    }
  });

  it("has nine rows whose first cells are the nine tools in order", () => {
    const names = specKitAlternatives.comparison!.rows.map((row) => row.cells[0].text);
    expect(names).toEqual(TOOL_NAMES);
  });

  it("has the stars and last push columns", () => {
    expect(STARS_COLUMN).toBeGreaterThan(0);
    expect(PUSH_COLUMN).toBeGreaterThan(0);
  });

  it.each(DATED_TOOLS)("%s shows stars %s as of 2026-11-25 and last push %s as of %s", (tool, stars, lastPush, pushAsOf) => {
    const row = findRow(tool);
    expect(row.cells[STARS_COLUMN]).toEqual({ text: stars, asOf: "2026-11-25" });
    expect(row.cells[PUSH_COLUMN]).toEqual({ text: lastPush, asOf: pushAsOf });
  });

  it.each(UNDATED_TOOLS)("%s shows unknown stars and last push with no asOf", (tool) => {
    const row = findRow(tool);
    expect(row.cells[STARS_COLUMN]).toEqual({ text: "unknown" });
    expect(row.cells[PUSH_COLUMN]).toEqual({ text: "unknown" });
  });

  it.each(["spec-kit", "OpenSpec", "BMAD-METHOD", "superpowers", "Kiro", "Tessl", "Agent OS", "Task Master", "AIDE"])(
    "names %s in the who-fits text",
    (tool) => {
      expect(whoFitsText.toLowerCase()).toContain(tool.toLowerCase());
    },
  );

  it("links on to the comparison and definition pages", () => {
    const hrefs = specKitAlternatives.related.map((link) => link.href);
    expect(hrefs).toContain("/learn/spec-driven-vs-intent-driven-development/");
    expect(hrefs).toContain("/learn/intent-driven-engineering/");
  });

  it("never calls a tool abandoned", () => {
    const comparisonText = specKitAlternatives.comparison!.rows.flatMap((row) => row.cells.map((cell) => cell.text));
    const allText = [...comparisonText, whoFitsText].join(" ").toLowerCase();
    expect(allText).not.toMatch(/abandon|dead|unmaintained|discontinued/);
  });
});
