import type { MetadataRoute } from "next";
import renderHub from "@/service/docs/renderHub";

const BASE_URL = "https://aidemd.dev";
const LAST_MODIFIED = new Date("2026-04-11");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await renderHub();

  const docEntries: MetadataRoute.Sitemap = docs.map((doc) => ({
    url: `${BASE_URL}/docs/${doc.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...docEntries,
  ];
}
