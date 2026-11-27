import { describe, it, expect, beforeAll } from "vitest";
import type { MetadataRoute } from "next";
import sitemap, { generateStaticParams } from "./sitemap";

// The real sitemap walks the real docs roots and shells out to git once per
// leaf route, which takes longer than vitest's 5s default.
const SITEMAP_BUILD_TIMEOUT_MS = 60_000;

describe("sitemap", () => {
  let entries: MetadataRoute.Sitemap;

  beforeAll(async () => {
    entries = await sitemap();
  }, SITEMAP_BUILD_TIMEOUT_MS);

  it("has exactly one /observer/ entry with no priority and a valid or absent lastModified", () => {
    const matches = entries.filter((e) => e.url === "https://aidemd.dev/observer/");
    expect(matches).toHaveLength(1);
    const [entry] = matches;
    expect(entry.priority).toBeUndefined();
    if (entry.lastModified !== undefined) {
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(Number.isNaN((entry.lastModified as Date).getTime())).toBe(false);
    }
  });

  it.each([
    "https://aidemd.dev/docs/tools/",
    "https://aidemd.dev/docs/hooks/",
    "https://aidemd.dev/docs/hooks/index/",
  ])("has exactly one %s entry", (url) => {
    expect(entries.filter((e) => e.url === url)).toHaveLength(1);
  });

  it("generateStaticParams builds /sitemap.xml via the empty optional catch-all", () => {
    expect(generateStaticParams()).toEqual([{ __metadata_id__: [] }]);
  });
});
