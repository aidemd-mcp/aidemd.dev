import type { Metadata } from "next";
import buildPageMetadata from "@/app/_shared/buildPageMetadata";
import findSitePage from "@/app/_shared/listSitePages/findSitePage";
import JsonLd from "@/components/JsonLd";
import copy from "@/data/learn/openSourceAgenticSdlcFramework";
import buildStructuredData from "@/service/structuredData";
import LearnArticle from "../_components/LearnArticle";

const urlPath = `/learn/${copy.slug}/`;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(await findSitePage(urlPath));
}

/**
 * /learn/open-source-agentic-sdlc-framework/: the route is wiring. The words
 * are in the copy record and the order is the template's; this file holds no
 * copy, no robots override and no read of the record's review status.
 */
export default async function OpenSourceAgenticSdlcFrameworkPage() {
  const page = await findSitePage(urlPath);

  return (
    <>
      <LearnArticle copy={copy} page={page} />
      <JsonLd document={buildStructuredData({ page, copy })} />
    </>
  );
}
