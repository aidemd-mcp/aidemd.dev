import { describe, it, expect } from "vitest";
import renderMarkdown from "./index";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function expectPass(body: string): Promise<string> {
  return renderMarkdown(body, "test.md");
}

async function expectFail(body: string, pattern: RegExp): Promise<void> {
  await expect(renderMarkdown(body, "test.md")).rejects.toThrow(pattern);
}

// ---------------------------------------------------------------------------
// Allowed constructs — must pass without error
// ---------------------------------------------------------------------------

describe("renderMarkdown — allowed constructs pass", () => {
  it("headings (h1–h6)", async () => {
    const html = await expectPass("# H1\n\n## H2\n\n### H3\n");
    expect(html).toContain("<h1>");
    expect(html).toContain("<h2>");
    expect(html).toContain("<h3>");
  });

  it("paragraph with bold, italic, and strikethrough", async () => {
    const html = await expectPass(
      "This has **bold**, _italic_, and ~~strike~~."
    );
    expect(html).toContain("<strong>");
    expect(html).toContain("<em>");
    expect(html).toContain("<del>");
  });

  it("inline code and fenced code block", async () => {
    const html = await expectPass(
      "Use `npm install`.\n\n```js\nconsole.log('hi');\n```\n"
    );
    expect(html).toContain("<code>");
    expect(html).toContain("<pre>");
  });

  it("unordered and ordered lists", async () => {
    const html = await expectPass("- a\n- b\n\n1. x\n2. y\n");
    expect(html).toContain("<ul>");
    expect(html).toContain("<ol>");
  });

  it("links and images", async () => {
    const html = await expectPass(
      "[link](https://example.com) ![alt](img.png)"
    );
    expect(html).toContain('<a href="https://example.com">');
    expect(html).toContain("<img");
  });

  it("GFM table", async () => {
    const html = await expectPass(
      "| A | B |\n|---|---|\n| 1 | 2 |\n"
    );
    expect(html).toContain("<table>");
    expect(html).toContain("<th>");
    expect(html).toContain("<td>");
  });

  it("blockquote", async () => {
    const html = await expectPass("> quoted text\n");
    expect(html).toContain("<blockquote>");
  });

  it("thematic break (---)", async () => {
    const html = await expectPass("before\n\n---\n\nafter\n");
    expect(html).toContain("<hr>");
  });

  it("hard line break", async () => {
    const html = await expectPass("line one  \nline two\n");
    expect(html).toContain("<br>");
  });

  it("HTML comments pass through", async () => {
    const html = await expectPass("<!-- for agents: internal note -->\n\ntext\n");
    expect(html).toContain("<!-- for agents: internal note -->");
  });

  it("inline HTML passes through", async () => {
    const html = await expectPass("<br />\n\ntext\n");
    expect(html).toContain("<br");
  });

  it("relative .md links are rewritten to /docs/ routes", async () => {
    const html = await expectPass("[see foo](./foo.md)");
    expect(html).toContain('href="/docs/foo"');
  });
});

// ---------------------------------------------------------------------------
// Unknown node type — must throw with file name and line number
// ---------------------------------------------------------------------------

describe("renderMarkdown — unknown node types throw", () => {
  it("includes the source file name in the error", async () => {
    // Simulate a future remark plugin producing an unknown node type by
    // monkey-patching; instead, verify the error format for a directive pattern
    // which currently degrades to a paragraph with text matching :::
    await expect(
      renderMarkdown(":::note\ncontent\n:::\n", "src/docs/foo.md")
    ).rejects.toThrow("src/docs/foo.md");
  });

  it("includes a line number in the error", async () => {
    await expect(
      renderMarkdown("# Intro\n\n:::note\ncontent\n:::\n", "src/docs/foo.md")
    ).rejects.toThrow(/:[\d]+/); // colon followed by digits = :line
  });

  it("container directive :::note throws", async () => {
    await expectFail(
      ":::note\nThis is a note.\n:::\n",
      /unknown construct/
    );
  });

  it("container directive ::: warning throws", async () => {
    await expectFail(
      "::: warning\nDo not do this.\n:::\n",
      /unknown construct/
    );
  });

  it("container directive on a later line throws", async () => {
    await expectFail(
      "# Valid heading\n\nNormal paragraph.\n\n:::tip\nTip content.\n:::\n",
      /unknown construct/
    );
  });

  it("error message includes the offending text (up to 40 chars)", async () => {
    await expect(
      renderMarkdown(":::note\ncontent\n:::\n", "test.md")
    ).rejects.toThrow(":::note");
  });
});

// ---------------------------------------------------------------------------
// sourceName defaults gracefully
// ---------------------------------------------------------------------------

describe("renderMarkdown — sourceName default", () => {
  it("omitting sourceName still produces an error mentioning <unknown>", async () => {
    await expect(
      renderMarkdown(":::note\ncontent\n:::\n")
    ).rejects.toThrow("<unknown>");
  });

  it("omitting sourceName does not affect successful renders", async () => {
    const html = await renderMarkdown("# Hello\n\nWorld.\n");
    expect(html).toContain("<h1>");
    expect(html).toContain("<p>");
  });
});
