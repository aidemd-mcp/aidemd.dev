import type { Metadata } from "next";
import buildPageMetadata from "@/app/_shared/buildPageMetadata";
import findSitePage from "@/app/_shared/listSitePages/findSitePage";
import JsonLd from "@/components/JsonLd";
import copy from "@/data/learn/specDrivenVsIntentDrivenDevelopment";
import buildStructuredData from "@/service/structuredData";
import LearnArticle from "../_components/LearnArticle";

const urlPath = `/learn/${copy.slug}/`;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(await findSitePage(urlPath));
}

/**
 * /learn/spec-driven-vs-intent-driven-development/: the route is wiring. The
 * words are in the copy record and the order of the blocks is the template's;
 * this file holds no copy and chooses no records.
 */
export default async function SpecDrivenVsIntentDrivenDevelopmentPage() {
  const page = await findSitePage(urlPath);

  return (
    <>
      <LearnArticle copy={copy} page={page} />
      <JsonLd document={buildStructuredData({ page, copy })} />
    </>
  );
}
