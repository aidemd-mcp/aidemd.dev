import { describe, it, expect } from "vitest";
import type { LearnCopy, LearnSection, RichText } from "@/types/learn";
import checkCopyRules from "./index";

function filler(count: number): string {
  return Array.from({ length: count }, () => "word").join(" ");
}

function plain(text: string): RichText {
  return [{ kind: "text", text }];
}

function makeSection(id: string, wordCount: number): LearnSection {
  return {
    id,
    heading: `Heading for ${id}`,
    blocks: [{ kind: "paragraph", text: plain(filler(wordCount)) }],
  };
}

function makeCopy(overrides: Partial<LearnCopy> = {}): LearnCopy {
  return {
    slug: "intent-driven-engineering",
    status: "draft",
    title: "Intent-driven engineering explained",
    description: "A plain definition of intent-driven engineering, how it differs from spec-driven work, and where to start.",
    h1: "What is intent-driven engineering?",
    answer: plain(filler(30)),
    sections: [makeSection("alpha", 150)],
    comparison: {
      caption: "Tools compared",
      columns: ["Tool", "Stars"],
      rows: [{ cells: [{ text: "spec-kit" }, { text: "151,401", asOf: "2026-11-25" }] }],
    },
    faq: [{ question: "What is it?", answer: plain("An answer that stands alone.") }],
    related: [{ label: "Methodology", href: "/docs/methodology/" }],
    ...overrides,
  };
}

describe("checkCopyRules", () => {
  it("returns no messages for a clean record", () => {
    expect(checkCopyRules(makeCopy())).toEqual([]);
  });

  it("accepts AIDE paired with intent-driven or aidemd, and the allowed markers", () => {
    const copy = makeCopy({
      title: "AIDE is intent-driven engineering",
      h1: "AIDE from aidemd",
      sections: [
        {
          id: "alpha",
          heading: "Open facts",
          blocks: [{ kind: "paragraph", text: plain(`${filler(148)} [VERIFY] [NEEDS COLLECTION]`) }],
        },
      ],
    });
    expect(checkCopyRules(copy)).toEqual([]);
  });

  it.each<[string, Partial<LearnCopy>, string]>([
    ["empty answer", { answer: [] }, "answer"],
    ["24-word answer", { answer: plain(filler(24)) }, "answer"],
    ["91-word answer", { answer: plain(filler(91)) }, "answer"],
    ["119-word section", { sections: [makeSection("alpha", 119)] }, "section:alpha"],
    ["181-word section", { sections: [makeSection("alpha", 181)] }, "section:alpha"],
    ["uppercase section id", { sections: [makeSection("Bad_Id", 150)] }, "section:Bad_Id"],
    ["section id faq", { sections: [makeSection("faq", 150)] }, "section:faq"],
    ["section id related", { sections: [makeSection("related", 150)] }, "section:related"],
    [
      "duplicate section id",
      { sections: [makeSection("alpha", 150), makeSection("alpha", 150)] },
      "section:alpha",
    ],
    [
      "glossary id clashing with a section id",
      {
        sections: [
          makeSection("alpha", 150),
          {
            id: "terms",
            heading: "Terms",
            blocks: [
              {
                kind: "glossary",
                terms: [{ id: "alpha", term: "Alpha", definition: plain(filler(150)) }],
              },
            ],
          },
        ],
      },
      "section:terms:glossary:alpha",
    ],
    ["unpaired AIDE", { title: "AIDE ships specs" }, "title"],
    ["AIDEY", { title: "AIDEY ships specs" }, "title"],
    ["standalone AID", { title: "AID ships specs" }, "title"],
    [
      "number without asOf",
      {
        comparison: {
          caption: "Tools compared",
          columns: ["Tool", "Stars"],
          rows: [{ cells: [{ text: "spec-kit" }, { text: "151,401" }] }],
        },
      },
      "comparison:cell:0:1",
    ],
    [
      "malformed asOf",
      {
        comparison: {
          caption: "Tools compared",
          columns: ["Tool", "Stars"],
          rows: [{ cells: [{ text: "spec-kit" }, { text: "151,401", asOf: "25-11-2026" }] }],
        },
      },
      "comparison:cell:0:1",
    ],
    [
      "row with the wrong cell count",
      {
        comparison: {
          caption: "Tools compared",
          columns: ["Tool", "Stars"],
          rows: [{ cells: [{ text: "spec-kit" }] }],
        },
      },
      "comparison:row:0",
    ],
    ["internal href without trailing slash", { related: [{ label: "Hooks", href: "/docs/hooks" }] }, "related:0"],
    ["anchor without trailing slash", { related: [{ label: "Hooks", href: "/docs/hooks#events" }] }, "related:0"],
    ["http href", { related: [{ label: "Site", href: "http://example.com/" }] }, "related:0"],
    ["href containing .md", { related: [{ label: "Doc", href: "https://example.com/readme.md" }] }, "related:0"],
    [
      "link run href without trailing slash",
      {
        sections: [
          {
            id: "alpha",
            heading: "Linked",
            blocks: [
              {
                kind: "paragraph",
                text: [
                  { kind: "text", text: filler(149) },
                  { kind: "link", text: "hooks", href: "/docs/hooks" },
                ],
              },
            ],
          },
        ],
      },
      "section:alpha:paragraph:0",
    ],
    ["newline in h1", { h1: "What is\nintent-driven engineering?" }, "h1"],
    ["newline in a section heading", { sections: [{ ...makeSection("alpha", 150), heading: "Two\nlines" }] }, "section:alpha:heading"],
    [
      "newline in a faq question",
      { faq: [{ question: "Two\nlines?", answer: plain("An answer that stands alone.") }] },
      "faq:0:question",
    ],
    ["title over 70 characters", { title: "t".repeat(71) }, "title"],
    ["description under 70 characters", { description: "Too short." }, "description"],
    ["description over 170 characters", { description: "d".repeat(171) }, "description"],
    ["person name", { title: "Built by tetsukod.ai" }, "title"],
    ["profile link text", { h1: "Find me at linkedin.com/in/someone" }, "h1"],
    ["status outside draft and reviewed", { status: "final" as unknown as LearnCopy["status"] }, "status"],
  ])("reports %s once, naming its location", (_name, overrides, where) => {
    const messages = checkCopyRules(makeCopy(overrides));
    expect(messages).toHaveLength(1);
    expect(messages[0].startsWith(`intent-driven-engineering ${where}: `)).toBe(true);
  });

  it("reports violations in rule order", () => {
    const messages = checkCopyRules(makeCopy({ answer: [], title: "AIDE ships specs", status: "final" as unknown as LearnCopy["status"] }));
    expect(messages.map((message) => message.split(": ")[0])).toEqual([
      "intent-driven-engineering answer",
      "intent-driven-engineering title",
      "intent-driven-engineering status",
    ]);
  });
});
