import type { Metadata } from "next";
import buildPageMetadata from "@/app/_shared/buildPageMetadata";
import findSitePage from "@/app/_shared/listSitePages/findSitePage";
import JsonLd from "@/components/JsonLd";
import copy from "@/data/learn/intentDrivenEngineering";
import buildStructuredData from "@/service/structuredData";
import LearnArticle from "../_components/LearnArticle";

const urlPath = `/learn/${copy.slug}/`;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(await findSitePage(urlPath));
}

/**
 * /learn/intent-driven-engineering/: the definition page for intent-driven
 * engineering. The route is wiring: the words are in the copy record and the
 * order of the blocks is the template's.
 */
export default async function IntentDrivenEngineeringPage() {
  const page = await findSitePage(urlPath);

  return (
    <>
      <LearnArticle copy={copy} page={page} />
      <JsonLd document={buildStructuredData({ page, copy })} />
    </>
  );
}
