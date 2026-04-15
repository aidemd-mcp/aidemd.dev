import type { MetadataRoute } from "next";
import renderHub from "@/service/docs/renderHub";
import listArtifacts from "@/service/scaffold/listArtifacts";

export const dynamic = "force-static";

const BASE_URL = "https://aidemd.dev";
const LAST_MODIFIED = new Date("2026-04-11");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await renderHub();
  const artifacts = listArtifacts();

  const docEntries: MetadataRoute.Sitemap = docs.map((doc) => ({
    url: `${BASE_URL}/docs/${doc.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const agentEntries: MetadataRoute.Sitemap = artifacts
    .filter((a) => a.kind === "agent")
    .map((a) => ({
      url: `${BASE_URL}/agents/${a.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const commandEntries: MetadataRoute.Sitemap = artifacts
    .filter((a) => a.kind === "command")
    .map((a) => ({
      url: `${BASE_URL}/commands/${a.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const skillEntries: MetadataRoute.Sitemap = artifacts
    .filter((a) => a.kind === "skill")
    .map((a) => ({
      url: `${BASE_URL}/skills/${a.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
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
    ...agentEntries,
    ...commandEntries,
    ...skillEntries,
  ];
}
