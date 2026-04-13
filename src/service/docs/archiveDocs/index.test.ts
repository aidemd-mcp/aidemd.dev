import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/service/docs/archive", () => ({
  default: vi.fn(),
}));

vi.mock("node:fs", () => ({
  readFileSync: vi.fn(),
}));

import archiveDocs from "./index";
import archiveDoc from "@/service/docs/archive";
import { readFileSync } from "node:fs";

const mockArchiveDoc = vi.mocked(archiveDoc);
const mockReadFileSync = vi.mocked(readFileSync);

const WAYBACK_URL =
  "https://web.archive.org/web/20260101000000/https://aidemd.devhttps://aidemd.dev/docs/aide-spec?v=abc1234";

const THREE_ENTRIES = {
  "aide-spec": { publishedAt: "2026-01-01T00:00:00.000Z", sourceCommit: "abc1234" },
  "aide-workflow": { publishedAt: "2026-02-01T00:00:00.000Z", sourceCommit: "def5678" },
  "aide-agents": { publishedAt: "2026-03-01T00:00:00.000Z", sourceCommit: "ghi9012" },
};

function mockVersionsJson(data: Record<string, unknown>) {
  mockReadFileSync.mockReturnValue(JSON.stringify(data));
}

beforeEach(() => {
  vi.clearAllMocks();
  mockArchiveDoc.mockResolvedValue({
    live: "https://aidemd.dev/docs/aide-spec?v=abc1234",
    sourceCommit: "abc1234",
    publishedAt: "2026-01-01T00:00:00.000Z",
    wayback: WAYBACK_URL,
  });
});

describe("archiveDocs", () => {
  it("happy path: all docs archived successfully", async () => {
    mockVersionsJson(THREE_ENTRIES);

    await expect(archiveDocs()).resolves.toBeUndefined();

    expect(mockArchiveDoc).toHaveBeenCalledTimes(3);
    expect(mockArchiveDoc).toHaveBeenNthCalledWith(1, {
      slug: "aide-spec",
      sourceCommit: "abc1234",
      publishedAt: "2026-01-01T00:00:00.000Z",
      versionedUrl: "https://aidemd.dev/docs/aide-spec?v=abc1234",
    });
    expect(mockArchiveDoc).toHaveBeenNthCalledWith(2, {
      slug: "aide-workflow",
      sourceCommit: "def5678",
      publishedAt: "2026-02-01T00:00:00.000Z",
      versionedUrl: "https://aidemd.dev/docs/aide-workflow?v=def5678",
    });
    expect(mockArchiveDoc).toHaveBeenNthCalledWith(3, {
      slug: "aide-agents",
      sourceCommit: "ghi9012",
      publishedAt: "2026-03-01T00:00:00.000Z",
      versionedUrl: "https://aidemd.dev/docs/aide-agents?v=ghi9012",
    });
  });

  it("fail-fast: first failure stops processing", async () => {
    mockVersionsJson(THREE_ENTRIES);
    mockArchiveDoc
      .mockResolvedValueOnce({
        live: "https://aidemd.dev/docs/aide-spec?v=abc1234",
        sourceCommit: "abc1234",
        publishedAt: "2026-01-01T00:00:00.000Z",
        wayback: WAYBACK_URL,
      })
      .mockRejectedValueOnce(new Error("Wayback unavailable"))
      .mockResolvedValueOnce({
        live: "https://aidemd.dev/docs/aide-agents?v=ghi9012",
        sourceCommit: "ghi9012",
        publishedAt: "2026-03-01T00:00:00.000Z",
        wayback: WAYBACK_URL,
      });

    await expect(archiveDocs()).rejects.toThrow();

    expect(mockArchiveDoc).toHaveBeenCalledTimes(2);
  });

  it("discovery reads versions.json correctly: slug, sourceCommit, publishedAt, and versionedUrl", async () => {
    mockVersionsJson(THREE_ENTRIES);

    await archiveDocs();

    const calls = mockArchiveDoc.mock.calls;
    expect(calls[0][0]).toEqual({
      slug: "aide-spec",
      sourceCommit: "abc1234",
      publishedAt: "2026-01-01T00:00:00.000Z",
      versionedUrl: "https://aidemd.dev/docs/aide-spec?v=abc1234",
    });
    expect(calls[1][0]).toEqual({
      slug: "aide-workflow",
      sourceCommit: "def5678",
      publishedAt: "2026-02-01T00:00:00.000Z",
      versionedUrl: "https://aidemd.dev/docs/aide-workflow?v=def5678",
    });
    expect(calls[2][0]).toEqual({
      slug: "aide-agents",
      sourceCommit: "ghi9012",
      publishedAt: "2026-03-01T00:00:00.000Z",
      versionedUrl: "https://aidemd.dev/docs/aide-agents?v=ghi9012",
    });
  });

  it("empty versions.json: zero docs is valid success", async () => {
    mockVersionsJson({});

    await expect(archiveDocs()).resolves.toBeUndefined();

    expect(mockArchiveDoc).not.toHaveBeenCalled();
  });

  it("missing versions.json: throws descriptive error mentioning versions.json", async () => {
    const enoentError = Object.assign(new Error("no such file or directory"), { code: "ENOENT" });
    mockReadFileSync.mockImplementation(() => {
      throw enoentError;
    });

    await expect(archiveDocs()).rejects.toThrow(/versions\.json/);
  });

  it("index slug maps to /docs not /docs/index", async () => {
    mockVersionsJson({
      index: { publishedAt: "2026-01-01T00:00:00.000Z", sourceCommit: "abc1234" },
    });

    await archiveDocs();

    expect(mockArchiveDoc).toHaveBeenCalledWith({
      slug: "index",
      sourceCommit: "abc1234",
      publishedAt: "2026-01-01T00:00:00.000Z",
      versionedUrl: "https://aidemd.dev/docs?v=abc1234",
    });
  });

  it("sequential execution order: calls happen in versions.json entry order", async () => {
    mockVersionsJson(THREE_ENTRIES);

    const callOrder: string[] = [];
    mockArchiveDoc.mockImplementation(async (input) => {
      callOrder.push(input.slug);
      return {
        live: input.versionedUrl,
        sourceCommit: input.sourceCommit,
        publishedAt: input.publishedAt,
        wayback: WAYBACK_URL,
      };
    });

    await archiveDocs();

    expect(callOrder).toEqual(["aide-spec", "aide-workflow", "aide-agents"]);
  });
});
