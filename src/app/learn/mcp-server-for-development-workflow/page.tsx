import type { Metadata } from "next";
import buildPageMetadata from "@/app/_shared/buildPageMetadata";
import findSitePage from "@/app/_shared/listSitePages/findSitePage";
import JsonLd from "@/components/JsonLd";
import copy from "@/data/learn/mcpServerForDevelopmentWorkflow";
import buildStructuredData from "@/service/structuredData";
import LearnArticle from "../_components/LearnArticle";

const urlPath = `/learn/${copy.slug}/`;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(await findSitePage(urlPath));
}

/**
 * /learn/mcp-server-for-development-workflow/: the route is wiring. The words
 * are in the copy record and the order is the template's; the records come
 * from the structured-data builder, which decides them from the page kind and
 * slug.
 */
export default async function McpServerForDevelopmentWorkflowPage() {
  const page = await findSitePage(urlPath);

  return (
    <>
      <LearnArticle copy={copy} page={page} />
      <JsonLd document={buildStructuredData({ page, copy })} />
    </>
  );
}
