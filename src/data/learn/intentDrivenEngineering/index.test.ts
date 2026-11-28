import { describe, it, expect } from "vitest";
import type { LearnBlock, RichText } from "@/types/learn";
import checkCopyRules from "@/data/learn/checkCopyRules";
import intentDrivenEngineering from "./index";

const PINNED_GLOSSARY_IDS = ["intent-spec", "cascading-intent-tree", "outcomes", "brain", "pipeline-stages"];

function glossaryTerms() {
  return intentDrivenEngineering.sections
    .flatMap((section) => section.blocks)
    .flatMap((block: LearnBlock) => (block.kind === "glossary" ? block.terms : []));
}

function linkHrefs(text: RichText): string[] {
  return text.flatMap((run) => (run.kind === "link" ? [run.href] : []));
}

describe("intentDrivenEngineering copy record", () => {
  it("passes every copy rule", () => {
    expect(checkCopyRules(intentDrivenEngineering)).toEqual([]);
  });

  it("ships as a draft for the slug it is named after", () => {
    expect(intentDrivenEngineering.slug).toBe("intent-driven-engineering");
    expect(intentDrivenEngineering.status).toBe("draft");
  });

  it("names intent-driven engineering in the title and h1", () => {
    expect(intentDrivenEngineering.title.toLowerCase()).toContain("intent-driven engineering");
    expect(intentDrivenEngineering.h1.toLowerCase()).toContain("intent-driven engineering");
  });

  it("opens the answer with the definition, before any mention of AIDE", () => {
    const answer = intentDrivenEngineering.answer.map((run) => run.text).join("");
    expect(answer.startsWith("Intent-driven engineering is")).toBe(true);
    expect(answer).not.toMatch(/\bAIDE\b/);
    expect(answer).not.toMatch(/install/i);
  });

  it("pins the five core glossary ids first, in order", () => {
    // Anchors are link targets on other pages: changing one must edit this test.
    expect(glossaryTerms().map((term) => term.id).slice(0, PINNED_GLOSSARY_IDS.length)).toEqual(PINNED_GLOSSARY_IDS);
  });

  it.each(glossaryTerms().map((term) => [term.id, term.definition] as const))(
    "glossary term %s links to the doc that defines it",
    (_id, definition) => {
      expect(linkHrefs(definition).some((href) => href.startsWith("/docs/"))).toBe(true);
    },
  );

  it("has a heading in the intent-driven development phrasing", () => {
    expect(
      intentDrivenEngineering.sections.some((section) => section.heading.toLowerCase().includes("intent-driven development")),
    ).toBe(true);
  });

  it("carries 3 to 6 FAQ items", () => {
    const count = intentDrivenEngineering.faq?.length ?? 0;
    expect(count).toBeGreaterThanOrEqual(3);
    expect(count).toBeLessThanOrEqual(6);
  });

  it("has no comparison table", () => {
    expect(intentDrivenEngineering.comparison).toBeUndefined();
  });

  it.each([
    "/learn/spec-driven-vs-intent-driven-development/",
    "/learn/claude-code-subagents-pipeline/",
    "/docs/methodology/",
  ])("lists %s as related", (href) => {
    expect(intentDrivenEngineering.related.map((link) => link.href)).toContain(href);
  });
});
