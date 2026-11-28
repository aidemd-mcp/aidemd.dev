import type { Metadata } from "next";
import buildPageMetadata from "@/app/_shared/buildPageMetadata";
import findSitePage from "@/app/_shared/listSitePages/findSitePage";
import JsonLd from "@/components/JsonLd";
import learnRoster from "@/data/learn";
import learnIndex from "@/data/learn/learnIndex";
import buildStructuredData from "@/service/structuredData";
import LearnBreadcrumb from "./_components/LearnBreadcrumb";
import LearnHeader from "./_components/LearnHeader";
import LearnIndexList from "./_components/LearnIndexList";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(await findSitePage("/learn/"));
}

/**
 * /learn: the section index. Lists the six answer pages in roster (research
 * priority) order under the index record's H1 and answer. It has no single
 * content source, so it shows no date and its records are the CollectionPage
 * and BreadcrumbList that the structured-data builder makes from the page-list
 * entry. Every word comes from the records; this file holds no copy.
 */
export default async function LearnIndexPage() {
  const page = await findSitePage("/learn/");

  return (
    <>
      <article className="docs-body">
        <LearnBreadcrumb breadcrumb={page.breadcrumb} />
        <LearnHeader h1={learnIndex.h1} answer={learnIndex.answer} />
        <LearnIndexList entries={learnRoster} />
      </article>
      <JsonLd document={buildStructuredData({ page })} />
    </>
  );
}
