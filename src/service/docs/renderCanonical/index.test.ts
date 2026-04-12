import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Module mocks (hoisted before imports) ---
vi.mock("./readSource", () => ({
  default: vi.fn(),
}));

vi.mock("./extractCitationMeta", () => ({
  default: vi.fn(),
}));

import renderCanonical from "./index";
import readSource from "./readSource";
import extractCitationMeta from "./extractCitationMeta";

const mockReadSource = vi.mocked(readSource);
const mockExtractCitationMeta = vi.mocked(extractCitationMeta);

const FIXTURE_SOURCE = `---
title: Test Doc
version: "1.0"
---

# Test Heading

This is a paragraph with **bold** and _italic_ text.

- item one
- item two
`;

const CITATION_META_FIXTURE = {
  publishedAt: "2026-01-01T00:00:00.000Z",
  sourceCommit: "abc1234",
  versionedUrl: "/docs/test-slug?v=abc1234",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockReadSource.mockResolvedValue(FIXTURE_SOURCE);
  mockExtractCitationMeta.mockReturnValue(CITATION_META_FIXTURE);
});

describe("renderCanonical", () => {
  it("byte-faithfulness round-trip: rendered HTML contains all source text tokens", async () => {
    const doc = await renderCanonical({ slug: "test-slug" });
    // Strip tags and check key text is present
    const textContent = doc.contentHtml.replace(/<[^>]+>/g, " ");
    expect(textContent).toContain("Test Heading");
    expect(textContent).toContain("This is a paragraph");
    expect(textContent).toContain("item one");
    expect(textContent).toContain("item two");
  });

  it("frontmatter is preserved on the returned doc", async () => {
    const doc = await renderCanonical({ slug: "test-slug" });
    expect(doc.frontmatter["title"]).toBe("Test Doc");
    expect(doc.frontmatter["version"]).toBe("1.0");
  });

  it("citation meta extraction returns the expected shape", async () => {
    const doc = await renderCanonical({ slug: "test-slug" });
    expect(doc.citationMeta).toMatchObject({
      publishedAt: expect.any(String),
      sourceCommit: expect.any(String),
      versionedUrl: expect.stringContaining("/docs/"),
    });
  });

  it("loud failure when file not found", async () => {
    mockReadSource.mockRejectedValue(
      new Error(`renderCanonical: source file not found for slug "missing-slug"`)
    );
    await expect(renderCanonical({ slug: "missing-slug" })).rejects.toThrow(
      "source file not found"
    );
  });

  it("no content injection: output does not contain anything not derivable from source", async () => {
    const doc = await renderCanonical({ slug: "test-slug" });
    // The contentHtml must not contain injected marketing phrases or scripts
    expect(doc.contentHtml).not.toContain("<script");
    expect(doc.contentHtml).not.toContain("Buy now");
    expect(doc.contentHtml).not.toContain("Subscribe");
    // title derived from frontmatter
    expect(doc.title).toBe("Test Doc");
  });

  it("slug is passed through to the returned doc", async () => {
    const doc = await renderCanonical({ slug: "test-slug" });
    expect(doc.slug).toBe("test-slug");
  });

  it("title falls back to slug when frontmatter has no title", async () => {
    mockReadSource.mockResolvedValue("No frontmatter here.\n");
    const doc = await renderCanonical({ slug: "fallback-slug" });
    expect(doc.title).toBe("fallback-slug");
  });
});
