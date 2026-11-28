import { describe, it, expect, beforeAll } from "vitest";
import type { MetadataRoute } from "next";
import listSitePages from "@/app/_shared/listSitePages";
import type { SitePage } from "@/types/sitePage";
import sitemap, { generateStaticParams } from "./sitemap";

const ORIGIN = "https://aidemd.dev";

const DATELESS_PATHS = [
  "/",
  "/docs/",
  "/brain/",
  "/brain/recipes/",
  "/observer/",
  "/privacy/",
  "/learn/",
];

describe("sitemap", () => {
  let entries: MetadataRoute.Sitemap;
  let pages: SitePage[];

  beforeAll(async () => {
    pages = await listSitePages();
    entries = await sitemap();
  });

  it("has one entry per listSitePages page, same URLs, same order", () => {
    expect(entries.map((e) => e.url)).toEqual(
      pages.map((p) => `${ORIGIN}${p.urlPath}`),
    );
  });

  it("emits no priority and no changeFrequency on any entry", () => {
    for (const entry of entries) {
      expect(entry).not.toHaveProperty("priority");
      expect(entry).not.toHaveProperty("changeFrequency");
    }
  });

  it.each(DATELESS_PATHS)("has no lastModified on %s", (urlPath) => {
    const matches = entries.filter((e) => e.url === `${ORIGIN}${urlPath}`);
    expect(matches).toHaveLength(1);
    expect(matches[0]).not.toHaveProperty("lastModified");
  });

  it("gives every docs and /learn entry with a modified date lastModified equal to that date byte-for-byte (same calendar day, no UTC shift)", () => {
    const dated = pages.filter(
      (p) =>
        p.modified &&
        (p.urlPath.startsWith("/docs/") || p.urlPath.startsWith("/learn/")),
    );
    expect(dated.length).toBeGreaterThan(0);
    for (const page of dated) {
      const entry = entries.find((e) => e.url === `${ORIGIN}${page.urlPath}`);
      expect(entry?.lastModified).toBe(page.modified);
      expect(String(entry?.lastModified).slice(0, 10)).toBe(
        (page.modified as string).slice(0, 10),
      );
    }
  });

  it.each([
    `${ORIGIN}/learn/intent-driven-engineering/`,
    `${ORIGIN}/docs/hooks/index/`,
  ])("has exactly one %s entry", (url) => {
    expect(entries.filter((e) => e.url === url)).toHaveLength(1);
  });

  it("generateStaticParams builds /sitemap.xml via the empty optional catch-all", () => {
    expect(generateStaticParams()).toEqual([{ __metadata_id__: [] }]);
  });
});
