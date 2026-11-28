import { describe, it, expect } from "vitest";
import checkCopyRules from "@/data/learn/checkCopyRules";
import specDrivenVsIntentDrivenDevelopment from ".";

const copy = specDrivenVsIntentDrivenDevelopment;

describe("specDrivenVsIntentDrivenDevelopment", () => {
  it("passes every copy rule", () => {
    expect(checkCopyRules(copy)).toEqual([]);
  });

  it("is the draft record for its slug", () => {
    expect(copy.slug).toBe("spec-driven-vs-intent-driven-development");
    expect(copy.status).toBe("draft");
  });

  it.each([copy.title, copy.h1])("names both approaches in %s", (text) => {
    expect(text.toLowerCase()).toContain("spec-driven development");
    expect(text.toLowerCase()).toContain("intent-driven development");
  });

  it("compares the two approaches in three columns", () => {
    expect(copy.comparison?.columns).toEqual([
      "Dimension",
      "Spec-driven development",
      "Intent-driven development (AIDE)",
    ]);
  });

  it("compares on five to eight dimensions", () => {
    const rows = copy.comparison?.rows ?? [];
    expect(rows.length).toBeGreaterThanOrEqual(5);
    expect(rows.length).toBeLessThanOrEqual(8);
  });

  it("states a cost the two approaches share", () => {
    const labels = (copy.comparison?.rows ?? []).map((row) => row.cells[0].text);
    expect(labels).toContain("What both still cost");
  });

  it.each(["waterfall", "markdown"])("has a section heading in the searchers' wording: %s", (word) => {
    expect(copy.sections.some((section) => section.heading.toLowerCase().includes(word))).toBe(true);
  });

  it.each([
    "/learn/intent-driven-engineering/",
    "/learn/spec-kit-alternatives/",
    "/docs/methodology/",
  ])("links on to %s", (href) => {
    expect(copy.related.map((link) => link.href)).toContain(href);
  });
});
