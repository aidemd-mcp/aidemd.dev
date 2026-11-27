import { describe, it, expect } from "vitest";
import buildRegistry from "@/service/docsRegistry";
import observerCopy from ".";

/** Collects every string value in a nested object/array, so contract checks cover the whole page copy. */
function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value !== null && typeof value === "object")
    return Object.values(value).flatMap(collectStrings);
  return [];
}

const allStrings = collectStrings(observerCopy);
const halt = observerCopy.own.replies.halt;
const blocked = observerCopy.own.replies.blocked;

describe("observerCopy — install command", () => {
  it("is the approved npx line", () => {
    expect(observerCopy.install).toBe("npx -y @aidemd-mcp/server@latest init");
  });
});

describe("observerCopy — forbidden strings", () => {
  it.each([
    "DRAFT",
    "TO CONFIRM",
    "placeholder",
    "[INSTALL",
    "AIDE Pipeline Viewer",
    "docs.html",
    "#hooks",
  ])("no string contains %s", (forbidden) => {
    expect(allStrings.filter((s) => s.includes(forbidden))).toEqual([]);
  });

  it("no string looks like a real token or hash", () => {
    expect(allStrings.filter((s) => /[0-9a-f]{32,}/.test(s))).toEqual([]);
  });
});

describe("observerCopy — HALT reply", () => {
  const lines = (halt.word + halt.rest).split("\n");

  it("has exactly three lines", () => {
    expect(lines).toHaveLength(3);
  });

  it("opens with the server's first line", () => {
    expect(lines[0]).toBe(
      "HALT: another session of this project is open. Nothing proceeds until the user approves ending it with aide_observer_end_session, or closes this session.",
    );
  });

  it("describes the open session in the server's format", () => {
    expect(lines[1]).toMatch(
      /^- \S+ · (working|waiting on the user) · (active|quiet \d+ min(, maybe stuck)?) · last activity \S+ · pipeline \S+ · phase \S+$/,
    );
  });

  it("ends with the observer link carrying a shortened token", () => {
    expect(lines[2]).toMatch(
      /^Observer: http:\/\/127\.0\.0\.1:2468\d\/p\/\S+\/s\/\S+\?token=…$/,
    );
  });
});

describe("observerCopy — BLOCKED reply", () => {
  const text = blocked.word + blocked.rest;

  it("starts with the server's wording and the first port", () => {
    expect(
      text.startsWith(
        "BLOCKED: the observer could not start, so nothing proceeds. No port could be bound: 24680 (in use)",
      ),
    ).toBe(true);
  });

  it("lists every port through 24689", () => {
    expect(text.endsWith("24689 (in use)")).toBe(true);
  });
});

describe("observerCopy — hooks", () => {
  it("lists the five events in order with their states", () => {
    expect(
      observerCopy.how.hooks.map(({ event, state }) => [event, state]),
    ).toEqual([
      ["SessionStart", "working"],
      ["UserPromptSubmit", "working"],
      ["PostToolUse", "working"],
      ["Stop", "waiting"],
      ["SessionEnd", "ended"],
    ]);
  });
});

describe("observerCopy — approved fact fixes", () => {
  it("rests the local claim on the 127.0.0.1 binding", () => {
    expect(observerCopy.local.body).toContain(
      "127.0.0.1, so your session data stays on your machine",
    );
    expect(observerCopy.local.body).not.toContain("behind an access token, so");
  });

  it("says the observer usually starts at the default port", () => {
    expect(observerCopy.then.trail).toContain("usually");
  });
});

describe("observerCopy — setup docs link", () => {
  it("points at the hooks reference page", () => {
    expect(observerCopy.setup.docsLink.href).toBe("/docs/hooks/index/");
  });

  it("resolves to a real docs registry route", async () => {
    const registry = await buildRegistry();
    const route = registry.getByKey("hooks/index");
    expect(route).toBeDefined();
    expect(route!.urlPath + "/").toBe(observerCopy.setup.docsLink.href);
  });
});

describe("observerCopy — meta", () => {
  it("uses the subhead as the description", () => {
    expect(observerCopy.meta.description).toBe(observerCopy.sub);
  });
});
