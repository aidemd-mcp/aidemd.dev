import { describe, it, expect } from "vitest";
import type { LearnCopy } from "@/types/learn";
import listSlots from "./index";

function makeCopy(overrides: Partial<LearnCopy> = {}): LearnCopy {
  return {
    slug: "intent-driven-engineering",
    status: "draft",
    title: "Title",
    description: "Description",
    h1: "Heading one",
    answer: [{ kind: "link", text: "Answer", href: "/docs/" }],
    sections: [
      {
        id: "first",
        heading: "First heading",
        blocks: [
          { kind: "code", lang: "bash", code: "npx skipped" },
          { kind: "paragraph", text: [{ kind: "text", text: "Paragraph." }] },
        ],
      },
    ],
    related: [{ label: "Related", href: "/docs/" }],
    ...overrides,
  };
}

describe("listSlots", () => {
  it("keeps rich text as runs and plain strings as strings", () => {
    const slots = listSlots(makeCopy());
    expect(slots.find((slot) => slot.where === "title")?.value).toBe("Title");
    expect(slots.find((slot) => slot.where === "answer")?.value).toEqual([
      { kind: "link", text: "Answer", href: "/docs/" },
    ]);
  });

  it("numbers blocks by position so a code block shifts later labels but is not a slot", () => {
    const wheres = listSlots(makeCopy()).map((slot) => slot.where);
    expect(wheres).toContain("section:first:paragraph:1");
    expect(wheres.some((where) => where.includes("skipped"))).toBe(false);
  });
});
