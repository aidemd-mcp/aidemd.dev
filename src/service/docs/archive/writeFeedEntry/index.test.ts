import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock node:fs/promises so no real files are written
vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

import writeFeedEntry from "./index";
import { readFile, writeFile } from "node:fs/promises";

const mockReadFile = vi.mocked(readFile);
const mockWriteFile = vi.mocked(writeFile);

const SAMPLE_ENTRY = {
  title: "aide-spec.md",
  id: "/docs/aide-spec?v=abc1234",
  publishedAt: "2026-01-01T00:00:00.000Z",
  liveUrl: "/docs/aide-spec?v=abc1234",
  waybackUrl:
    "https://web.archive.org/web/20260101000000/https://aidemd.dev/docs/aide-spec",
  summary:
    "aidemd.dev docs: aide-spec.md updated. Source commit abc1234. Live: /docs/aide-spec?v=abc1234. Archived: https://web.archive.org/web/20260101000000/https://aidemd.dev/docs/aide-spec.",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockWriteFile.mockResolvedValue(undefined);
});

describe("writeFeedEntry", () => {
  it("output is valid Atom XML structure when creating a new feed", async () => {
    // Simulate no existing feed
    const notFoundError = Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    mockReadFile.mockRejectedValue(notFoundError);

    await writeFeedEntry(SAMPLE_ENTRY);

    expect(mockWriteFile).toHaveBeenCalledOnce();
    const [, xml] = mockWriteFile.mock.calls[0] as [string, string, string];

    // Must be valid Atom 1.0
    expect(xml).toContain('<?xml version="1.0" encoding="utf-8"?>');
    expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
    expect(xml).toContain("</feed>");
    expect(xml).toContain("<entry>");
    expect(xml).toContain("</entry>");
    expect(xml).toContain("<title>");
    expect(xml).toContain("<id>");
    expect(xml).toContain("<published>");
    expect(xml).toContain("<summary>");
  });

  it("feed envelope uses unified title and ID for all content types", async () => {
    const notFoundError = Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    mockReadFile.mockRejectedValue(notFoundError);

    await writeFeedEntry(SAMPLE_ENTRY);

    const [, xml] = mockWriteFile.mock.calls[0] as [string, string, string];
    expect(xml).toContain("<id>https://aidemd.dev/feed</id>");
    expect(xml).toContain("<title>aidemd.dev canonical pages</title>");
  });

  it("GUID/id is the versioned URL", async () => {
    const notFoundError = Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    mockReadFile.mockRejectedValue(notFoundError);

    await writeFeedEntry(SAMPLE_ENTRY);

    const [, xml] = mockWriteFile.mock.calls[0] as [string, string, string];
    // The <id> element should contain the versioned URL (XML-escaped)
    expect(xml).toContain(
      `<id>/docs/aide-spec?v=abc1234</id>`
    );
  });

  it("entry summary matches the fixed template format", async () => {
    const notFoundError = Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    mockReadFile.mockRejectedValue(notFoundError);

    await writeFeedEntry(SAMPLE_ENTRY);

    const [, xml] = mockWriteFile.mock.calls[0] as [string, string, string];
    expect(xml).toContain("aidemd.dev docs: aide-spec.md updated.");
    expect(xml).toContain("Source commit abc1234.");
    expect(xml).toContain("Live: /docs/aide-spec?v=abc1234.");
    expect(xml).toContain("Archived: https://web.archive.org");
  });

  it("no marketing copy in feed entry", async () => {
    const notFoundError = Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    mockReadFile.mockRejectedValue(notFoundError);

    await writeFeedEntry(SAMPLE_ENTRY);

    const [, xml] = mockWriteFile.mock.calls[0] as [string, string, string];
    const BANNED = ["Buy now", "Subscribe", "Free trial", "Sign up", "Get started", "Click here"];
    for (const phrase of BANNED) {
      expect(xml.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  it("inserts new entry before </feed> when feed already exists", async () => {
    const existingFeed = [
      `<?xml version="1.0" encoding="utf-8"?>`,
      `<feed xmlns="http://www.w3.org/2005/Atom">`,
      `  <id>https://aidemd.dev/feed</id>`,
      `  <title>aidemd.dev canonical pages</title>`,
      `  <updated>2025-12-01T00:00:00.000Z</updated>`,
      `  <entry>`,
      `    <title>old-doc.md</title>`,
      `    <id>/docs/old-doc?v=prev123</id>`,
      `    <published>2025-12-01T00:00:00.000Z</published>`,
      `    <summary>old summary</summary>`,
      `  </entry>`,
      `</feed>`,
    ].join("\n");

    mockReadFile.mockResolvedValue(existingFeed);

    await writeFeedEntry(SAMPLE_ENTRY);

    const [, xml] = mockWriteFile.mock.calls[0] as [string, string, string];
    // Existing entry preserved
    expect(xml).toContain("old-doc.md");
    expect(xml).toContain("/docs/old-doc?v=prev123");
    // New entry present
    expect(xml).toContain("aide-spec.md");
    expect(xml).toContain("/docs/aide-spec?v=abc1234");
    // New entry is before closing tag
    const newEntryPos = xml.indexOf("/docs/aide-spec?v=abc1234");
    const closingTagPos = xml.lastIndexOf("</feed>");
    expect(newEntryPos).toBeLessThan(closingTagPos);
  });
});
