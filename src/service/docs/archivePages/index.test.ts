import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/service/docs/archive", () => ({
  default: vi.fn(),
}));

vi.mock("node:fs", () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

import archivePages from "./index";
import archiveDoc from "@/service/docs/archive";
import { existsSync, readFileSync } from "node:fs";

const mockArchiveDoc = vi.mocked(archiveDoc);
const mockExistsSync = vi.mocked(existsSync);
const mockReadFileSync = vi.mocked(readFileSync);

const WAYBACK_URL =
  "https://web.archive.org/web/20260101000000/https://aidemd.dev/docs/aide-spec?v=abc1234";

const THREE_ENTRIES = {
  "aide-spec": { publishedAt: "2026-01-01T00:00:00.000Z", sourceCommit: "abc1234" },
  "aide-workflow": { publishedAt: "2026-02-01T00:00:00.000Z", sourceCommit: "def5678" },
  "aide-agents": { publishedAt: "2026-03-01T00:00:00.000Z", sourceCommit: "ghi9012" },
};

const DOCS_INPUT = {
  contentType: "docs" as const,
  urlPrefix: "/docs",
  versionsPath: "/project/.aide/docs/versions.json",
};

const AGENTS_INPUT = {
  contentType: "agents" as const,
  urlPrefix: "/agents",
  versionsPath: "/project/.aide/agents/versions.json",
};

function mockVersionsFile(data: Record<string, unknown>) {
  mockExistsSync.mockReturnValue(true);
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

describe("archivePages", () => {
  it("happy path: all pages archived successfully", async () => {
    mockVersionsFile(THREE_ENTRIES);

    await expect(archivePages(DOCS_INPUT)).resolves.toBeUndefined();

    expect(mockArchiveDoc).toHaveBeenCalledTimes(3);
  });

  it("passes contentType through to archiveDoc in each call", async () => {
    mockVersionsFile({
      "aide-spec": { publishedAt: "2026-01-01T00:00:00.000Z", sourceCommit: "abc1234" },
    });

    await archivePages(DOCS_INPUT);

    expect(mockArchiveDoc).toHaveBeenCalledWith(
      expect.objectContaining({ contentType: "docs" })
    );
  });

  it("contentType is forwarded correctly for agents", async () => {
    mockVersionsFile({
      "aide-architect": { publishedAt: "2026-01-01T00:00:00.000Z", sourceCommit: "abc1234" },
    });

    await archivePages(AGENTS_INPUT);

    expect(mockArchiveDoc).toHaveBeenCalledWith(
      expect.objectContaining({ contentType: "agents" })
    );
  });

  it("urlPrefix: /agents produces versionedUrl with /agents prefix", async () => {
    mockVersionsFile({
      "aide-architect": { publishedAt: "2026-01-01T00:00:00.000Z", sourceCommit: "abc1234" },
    });

    await archivePages(AGENTS_INPUT);

    expect(mockArchiveDoc).toHaveBeenCalledWith(
      expect.objectContaining({
        versionedUrl: "https://aidemd.dev/agents/aide-architect?v=abc1234",
      })
    );
  });

  it("correct archiveDoc args: slug, sourceCommit, publishedAt, versionedUrl", async () => {
    mockVersionsFile(THREE_ENTRIES);

    await archivePages(DOCS_INPUT);

    const calls = mockArchiveDoc.mock.calls;
    expect(calls[0][0]).toEqual({
      slug: "aide-spec",
      sourceCommit: "abc1234",
      publishedAt: "2026-01-01T00:00:00.000Z",
      versionedUrl: "https://aidemd.dev/docs/aide-spec?v=abc1234",
      contentType: "docs",
    });
    expect(calls[1][0]).toEqual({
      slug: "aide-workflow",
      sourceCommit: "def5678",
      publishedAt: "2026-02-01T00:00:00.000Z",
      versionedUrl: "https://aidemd.dev/docs/aide-workflow?v=def5678",
      contentType: "docs",
    });
    expect(calls[2][0]).toEqual({
      slug: "aide-agents",
      sourceCommit: "ghi9012",
      publishedAt: "2026-03-01T00:00:00.000Z",
      versionedUrl: "https://aidemd.dev/docs/aide-agents?v=ghi9012",
      contentType: "docs",
    });
  });

  it("fail-fast: first failure stops processing", async () => {
    mockVersionsFile(THREE_ENTRIES);
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

    await expect(archivePages(DOCS_INPUT)).rejects.toThrow();

    expect(mockArchiveDoc).toHaveBeenCalledTimes(2);
  });

  it("index slug maps to urlPrefix not urlPrefix/index", async () => {
    mockVersionsFile({
      index: { publishedAt: "2026-01-01T00:00:00.000Z", sourceCommit: "abc1234" },
    });

    await archivePages(DOCS_INPUT);

    expect(mockArchiveDoc).toHaveBeenCalledWith(
      expect.objectContaining({
        versionedUrl: "https://aidemd.dev/docs?v=abc1234",
      })
    );
  });

  it("empty versions.json: zero pages is valid success", async () => {
    mockVersionsFile({});

    await expect(archivePages(DOCS_INPUT)).resolves.toBeUndefined();

    expect(mockArchiveDoc).not.toHaveBeenCalled();
  });

  it("missing versions.json: skips gracefully with a log message", async () => {
    mockExistsSync.mockReturnValue(false);

    await expect(archivePages(DOCS_INPUT)).resolves.toBeUndefined();

    expect(mockArchiveDoc).not.toHaveBeenCalled();
    expect(mockReadFileSync).not.toHaveBeenCalled();
  });

  it("sequential execution order: calls happen in versions.json entry order", async () => {
    mockVersionsFile(THREE_ENTRIES);

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

    await archivePages(DOCS_INPUT);

    expect(callOrder).toEqual(["aide-spec", "aide-workflow", "aide-agents"]);
  });
});
