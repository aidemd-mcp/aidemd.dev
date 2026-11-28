import { describe, it, expect } from "vitest";
import type { LearnCopy } from "@/types/learn";
import listTextUnits from "./index";

function makeCopy(overrides: Partial<LearnCopy> = {}): LearnCopy {
  return {
    slug: "intent-driven-engineering",
    status: "draft",
    title: "Title",
    description: "Description",
    h1: "Heading one",
    answer: [{ kind: "text", text: "Answer " }, { kind: "link", text: "linked", href: "/docs/" }, { kind: "text", text: "." }],
    sections: [
      {
        id: "first",
        heading: "First heading",
        blocks: [
          { kind: "paragraph", text: [{ kind: "text", text: "Paragraph text." }] },
          { kind: "code", lang: "bash", code: "npx never-counted" },
          {
            kind: "list",
            items: [[{ kind: "text", text: "Item zero" }], [{ kind: "text", text: "Item one" }]],
          },
          {
            kind: "glossary",
            terms: [
              { id: "term-a", term: "Term A", definition: [{ kind: "text", text: "Definition A" }] },
            ],
          },
        ],
      },
    ],
    comparison: {
      caption: "Caption",
      columns: ["Col zero", "Col one"],
      rows: [{ cells: [{ text: "r0c0" }, { text: "r0c1", asOf: "2026-11-25" }] }],
    },
    faq: [{ question: "Question?", answer: [{ kind: "text", text: "Reply." }] }],
    related: [{ label: "Related label", href: "/docs/" }],
    ...overrides,
  };
}

describe("listTextUnits", () => {
  it("lists every visible string in page order with its where label", () => {
    expect(listTextUnits(makeCopy())).toEqual([
      { where: "title", text: "Title" },
      { where: "description", text: "Description" },
      { where: "h1", text: "Heading one" },
      { where: "answer", text: "Answer linked." },
      { where: "section:first:heading", text: "First heading" },
      { where: "section:first:paragraph:0", text: "Paragraph text." },
      { where: "section:first:list:2:0", text: "Item zero" },
      { where: "section:first:list:2:1", text: "Item one" },
      { where: "section:first:glossary:term-a:term", text: "Term A" },
      { where: "section:first:glossary:term-a:definition", text: "Definition A" },
      { where: "comparison:caption", text: "Caption" },
      { where: "comparison:column:0", text: "Col zero" },
      { where: "comparison:column:1", text: "Col one" },
      { where: "comparison:cell:0:0", text: "r0c0" },
      { where: "comparison:cell:0:1", text: "r0c1" },
      { where: "faq:0:question", text: "Question?" },
      { where: "faq:0:answer", text: "Reply." },
      { where: "related:0", text: "Related label" },
    ]);
  });

  it("omits code blocks, comparison and faq when absent", () => {
    const units = listTextUnits(makeCopy({ comparison: undefined, faq: undefined, related: [] }));
    expect(units.map((unit) => unit.where)).not.toContain("comparison:caption");
    expect(units.some((unit) => unit.text.includes("never-counted"))).toBe(false);
    expect(units.some((unit) => unit.where.startsWith("faq:"))).toBe(false);
  });
});
