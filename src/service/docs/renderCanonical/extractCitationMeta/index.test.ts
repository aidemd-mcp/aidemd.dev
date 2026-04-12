import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node:fs");

import { readFileSync } from "node:fs";
import extractCitationMeta from "./index";

const mockReadFileSync = vi.mocked(readFileSync);

const VERSIONS_FIXTURE = JSON.stringify({
  "aide-spec": {
    publishedAt: "2026-04-11T20:06:53-07:00",
    sourceCommit: "c32e887",
  },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("extractCitationMeta", () => {
  it("happy path — returns citation meta from versions.json", () => {
    mockReadFileSync.mockReturnValue(VERSIONS_FIXTURE);

    const result = extractCitationMeta("aide-spec");

    expect(result.publishedAt).toBe("2026-04-11T20:06:53-07:00");
    expect(result.sourceCommit).toBe("c32e887");
    expect(result.versionedUrl).toBe("/docs/aide-spec?v=c32e887");
  });

  it("throws when slug is missing from versions.json", () => {
    mockReadFileSync.mockReturnValue(JSON.stringify({}));

    expect(() => extractCitationMeta("nonexistent-slug")).toThrow(
      "no version entry",
    );
  });

  it("throws with aide_upgrade hint when versions.json is missing", () => {
    const enoentError = Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    mockReadFileSync.mockImplementation(() => {
      throw enoentError;
    });

    expect(() => extractCitationMeta("aide-spec")).toThrow("aide_upgrade");
  });
});
