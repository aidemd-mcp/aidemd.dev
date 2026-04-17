import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node:fs");

import { readFileSync } from "node:fs";
import extractArtifactCitationMeta from "./index";

const mockReadFileSync = vi.mocked(readFileSync);

const PUBLISHED_AT = "2026-04-10T12:00:00-07:00";
const SOURCE_COMMIT = "abc1234";
const PREVIOUS_COMMIT = "cc881ec";

function makeVersionsFixture(key: string, previousCommit?: string): string {
  return JSON.stringify({
    [key]: {
      publishedAt: PUBLISHED_AT,
      sourceCommit: SOURCE_COMMIT,
      ...(previousCommit !== undefined ? { previousCommit } : {}),
    },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("extractArtifactCitationMeta", () => {
  it.each([
    {
      label: "command aide-init → commands/aide/init",
      slug: "aide-init",
      kind: "command",
      expectedKey: "commands/aide/init",
    },
    {
      label: "command aide → commands/aide/aide",
      slug: "aide",
      kind: "command",
      expectedKey: "commands/aide/aide",
    },
    {
      label: "agent aide-architect → agents/aide/aide-architect",
      slug: "aide-architect",
      kind: "agent",
      expectedKey: "agents/aide/aide-architect",
    },
    {
      label: "skill study-playbook → skills/study-playbook",
      slug: "study-playbook",
      kind: "skill",
      expectedKey: "skills/study-playbook",
    },
  ])("happy path — $label", ({ slug, kind, expectedKey }) => {
    mockReadFileSync.mockReturnValue(makeVersionsFixture(expectedKey));

    const result = extractArtifactCitationMeta({ slug, kind });

    expect(result.publishedAt).toBe(PUBLISHED_AT);
    expect(result.sourceCommit).toBe(SOURCE_COMMIT);
  });

  it("throws with aide_upgrade hint when versions.json is missing", () => {
    const enoentError = Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    mockReadFileSync.mockImplementation(() => {
      throw enoentError;
    });

    expect(() =>
      extractArtifactCitationMeta({ slug: "aide-init", kind: "command" }),
    ).toThrow("aide_upgrade");
  });

  it("throws with derived key in message when entry is missing", () => {
    mockReadFileSync.mockReturnValue(JSON.stringify({}));

    expect(() =>
      extractArtifactCitationMeta({ slug: "aide-init", kind: "command" }),
    ).toThrow("commands/aide/init");
  });

  it("returns previousCommit when present in the versions.json entry", () => {
    mockReadFileSync.mockReturnValue(
      makeVersionsFixture("commands/aide/init", PREVIOUS_COMMIT),
    );

    const result = extractArtifactCitationMeta({ slug: "aide-init", kind: "command" });

    expect(result.previousCommit).toBe(PREVIOUS_COMMIT);
  });

  it("returns undefined for previousCommit when absent from the versions.json entry", () => {
    mockReadFileSync.mockReturnValue(makeVersionsFixture("commands/aide/init"));

    const result = extractArtifactCitationMeta({ slug: "aide-init", kind: "command" });

    expect(result.previousCommit).toBeUndefined();
  });
});
