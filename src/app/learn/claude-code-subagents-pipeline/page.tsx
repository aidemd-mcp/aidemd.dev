import type { Metadata } from "next";
import buildPageMetadata from "@/app/_shared/buildPageMetadata";
import findSitePage from "@/app/_shared/listSitePages/findSitePage";
import JsonLd from "@/components/JsonLd";
import copy from "@/data/learn/claudeCodeSubagentsPipeline";
import buildStructuredData from "@/service/structuredData";
import LearnArticle from "../_components/LearnArticle";

const urlPath = `/learn/${copy.slug}/`;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(await findSitePage(urlPath));
}

/**
 * /learn/claude-code-subagents-pipeline/: the route is wiring. The words are in
 * the copy record and the order of the blocks is the template's, so this file
 * holds no copy and chooses no records; the structured-data builder decides them
 * from the page list entry.
 */
export default async function ClaudeCodeSubagentsPipelinePage() {
  const page = await findSitePage(urlPath);

  return (
    <>
      <LearnArticle copy={copy} page={page} />
      <JsonLd document={buildStructuredData({ page, copy })} />
    </>
  );
}
