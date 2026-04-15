import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./saveToWayback", () => ({
  default: vi.fn(),
}));

vi.mock("./updateManifest", () => ({
  default: vi.fn(),
}));

vi.mock("./writeFeedEntry", () => ({
  default: vi.fn(),
}));

import archiveDoc from "./index";
import saveToWayback from "./saveToWayback";
import updateManifest from "./updateManifest";
import writeFeedEntry from "./writeFeedEntry";

const mockSaveToWayback = vi.mocked(saveToWayback);
const mockUpdateManifest = vi.mocked(updateManifest);
const mockWriteFeedEntry = vi.mocked(writeFeedEntry);

const BASE_INPUT = {
  versionedUrl: "/docs/aide-spec?v=abc1234",
  slug: "aide-spec",
  sourceCommit: "abc1234",
  publishedAt: "2026-01-01T00:00:00.000Z",
  contentType: "docs" as const,
};

const WAYBACK_URL =
  "https://web.archive.org/web/20260101000000/https://aidemd.dev/docs/aide-spec?v=abc1234";

beforeEach(() => {
  vi.clearAllMocks();
  mockSaveToWayback.mockResolvedValue(WAYBACK_URL);
  mockUpdateManifest.mockResolvedValue(undefined);
  mockWriteFeedEntry.mockResolvedValue(undefined);
});

describe("archiveDoc", () => {
  it("manifest is append-only: updateManifest is called with the correct entry", async () => {
    await archiveDoc(BASE_INPUT);

    expect(mockUpdateManifest).toHaveBeenCalledOnce();
    const [slug, entry] = mockUpdateManifest.mock.calls[0];
    expect(slug).toBe("aide-spec");
    expect(entry).toMatchObject({
      live: BASE_INPUT.versionedUrl,
      sourceCommit: BASE_INPUT.sourceCommit,
      publishedAt: BASE_INPUT.publishedAt,
      wayback: WAYBACK_URL,
    });
  });

  it("feed entry matches the fixed template format", async () => {
    await archiveDoc(BASE_INPUT);

    expect(mockWriteFeedEntry).toHaveBeenCalledOnce();
    const [feedEntry] = mockWriteFeedEntry.mock.calls[0];
    expect(feedEntry.summary).toMatch(/aidemd\.dev docs:/);
    expect(feedEntry.summary).toContain("Source commit abc1234");
    expect(feedEntry.summary).toContain(BASE_INPUT.versionedUrl);
    expect(feedEntry.summary).toContain(WAYBACK_URL);
  });

  it("returns the completed BuildManifestEntry", async () => {
    const result = await archiveDoc(BASE_INPUT);
    expect(result).toMatchObject({
      live: BASE_INPUT.versionedUrl,
      sourceCommit: BASE_INPUT.sourceCommit,
      publishedAt: BASE_INPUT.publishedAt,
      wayback: WAYBACK_URL,
    });
  });

  it("retry logic: saveToWayback resolving after internal retries means archiveDoc succeeds", async () => {
    // saveToWayback encapsulates all retry logic — archiveDoc calls it exactly once.
    // This test verifies that archiveDoc propagates a successful resolution from
    // saveToWayback regardless of how many retries occurred internally.
    mockSaveToWayback.mockResolvedValue(WAYBACK_URL);

    const result = await archiveDoc(BASE_INPUT);
    expect(result.wayback).toBe(WAYBACK_URL);
    expect(mockSaveToWayback).toHaveBeenCalledTimes(1);
  });

  it("4 failures causes archiveDoc to throw and blocks the publish", async () => {
    // When saveToWayback exhausts all retries it throws — archiveDoc must not
    // swallow that error, and must not proceed to updateManifest or writeFeedEntry.
    mockSaveToWayback.mockRejectedValue(
      new Error(
        "Wayback save failed for /docs/aide-spec?v=abc1234 after 3 retries; publish blocked. Last error: HTTP 503"
      )
    );

    await expect(archiveDoc(BASE_INPUT)).rejects.toThrow(/publish blocked/);
    // updateManifest and writeFeedEntry must NOT be called when Wayback fails
    expect(mockUpdateManifest).not.toHaveBeenCalled();
    expect(mockWriteFeedEntry).not.toHaveBeenCalled();
  });

  it("steps run in correct order: saveToWayback before updateManifest before writeFeedEntry", async () => {
    const callOrder: string[] = [];
    mockSaveToWayback.mockImplementation(async () => {
      callOrder.push("saveToWayback");
      return WAYBACK_URL;
    });
    mockUpdateManifest.mockImplementation(async () => {
      callOrder.push("updateManifest");
    });
    mockWriteFeedEntry.mockImplementation(async () => {
      callOrder.push("writeFeedEntry");
    });

    await archiveDoc(BASE_INPUT);
    expect(callOrder).toEqual(["saveToWayback", "updateManifest", "writeFeedEntry"]);
  });

  it("contentType is reflected in feed summary: agents produces 'aidemd.dev agents:'", async () => {
    const agentsInput = {
      ...BASE_INPUT,
      versionedUrl: "/agents/aide-architect?v=abc1234",
      slug: "aide-architect",
      contentType: "agents" as const,
    };

    await archiveDoc(agentsInput);

    const [feedEntry] = mockWriteFeedEntry.mock.calls[0];
    expect(feedEntry.summary).toMatch(/aidemd\.dev agents:/);
    expect(feedEntry.summary).not.toMatch(/aidemd\.dev docs:/);
  });
});
