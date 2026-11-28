import { describe, it, expect } from "vitest";
import type { LearnCopy, RichText } from "@/types/learn";
import checkCopyRules from "@/data/learn/checkCopyRules";
import listTextUnits from "@/data/learn/checkCopyRules/listTextUnits";
import openSourceAgenticSdlcFramework from "./index";

const copy: LearnCopy = openSourceAgenticSdlcFramework;

const PHASES = ["requirements", "design", "implementation", "testing", "maintenance"];
const BANNED_ANSWER_STARTS = ["This", "It", "As above", "See above"];
const RELATED_HREFS = [
  "/learn/intent-driven-engineering/",
  "/learn/claude-code-subagents-pipeline/",
  "/docs/",
];

/** Plain text of one rich-text value, runs joined with nothing between. */
function plain(text: RichText): string {
  return text.map((run) => run.text).join("");
}

/** Every text unit of one section, joined, so a test can search the mapping prose. */
function sectionText(id: string): string {
  return listTextUnits(copy)
    .filter((unit) => unit.where.startsWith(`section:${id}:`))
    .map((unit) => unit.text)
    .join(" ")
    .toLowerCase();
}

describe("openSourceAgenticSdlcFramework", () => {
  it("passes every copy rule", () => {
    expect(checkCopyRules(copy)).toEqual([]);
  });

  it("is the open-source-agentic-sdlc-framework record, marked draft", () => {
    expect(copy.slug).toBe("open-source-agentic-sdlc-framework");
    expect(copy.status).toBe("draft");
  });

  it("puts the searched phrase in the title and the H1", () => {
    expect(copy.title.toLowerCase()).toContain("open source agentic sdlc framework");
    expect(copy.h1.toLowerCase()).toContain("open source agentic sdlc framework");
  });

  it("opens the answer by calling AIDE an open source agentic SDLC framework", () => {
    const first = plain(copy.answer).split(". ")[0];
    expect(first).toMatch(/\bAIDE\b/);
    expect(first).toMatch(/intent-driven|aidemd/i);
    expect(first).toContain("open source agentic SDLC framework");
  });

  it.each(PHASES)("names the %s phase in the stage-to-phase mapping", (phase) => {
    expect(sectionText("stage-to-phase")).toContain(phase);
  });

  it("carries a glossary term with id agentic-sdlc", () => {
    const glossaryTerms = copy.sections.flatMap((section) =>
      section.blocks.flatMap((block) => (block.kind === "glossary" ? block.terms : [])),
    );
    expect(copy.sections.some((section) => section.id === "glossary")).toBe(true);
    expect(glossaryTerms.map((term) => term.id)).toContain("agentic-sdlc");
  });

  it("has no comparison table", () => {
    expect(copy.comparison).toBeUndefined();
  });

  it("has 3 to 6 FAQ items", () => {
    expect(copy.faq?.length).toBeGreaterThanOrEqual(3);
    expect(copy.faq?.length).toBeLessThanOrEqual(6);
  });

  it.each((copy.faq ?? []).map((item) => [item.question, plain(item.answer)]))(
    "answers %s without leaning on the page around it",
    (_question, answer) => {
      const startsBanned = BANNED_ANSWER_STARTS.some((start) => answer.startsWith(start));
      expect(startsBanned).toBe(false);
    },
  );

  it("states no community size, adoption figure or user count", () => {
    const offenders = listTextUnits(copy).filter((unit) =>
      /\b\d[\d,]*\s+(users|stars|contributors|companies)\b/i.test(unit.text),
    );
    expect(offenders).toEqual([]);
  });

  it.each(RELATED_HREFS)("links related to %s", (href) => {
    expect(copy.related.map((link) => link.href)).toContain(href);
  });
});
