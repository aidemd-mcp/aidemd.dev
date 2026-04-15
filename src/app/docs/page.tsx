import type { Metadata } from "next";
import listArtifacts from "@/service/scaffold/listArtifacts";
import DocHub from "@/components/DocsPage/DocHub";

const title = "Scaffold Tree -- AIDE: Autonomous Intent-Driven Engineering";
const description =
  "Browse the full AIDE scaffold tree -- canonical docs, pipeline agents, slash commands, and skills -- exactly as aide_init installs them into a project.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://aidemd.dev/docs",
    siteName: "AIDE",
    type: "website",
  },
};

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  headline: title,
  description,
  url: "https://aidemd.dev/docs",
  publisher: {
    "@type": "Organization",
    name: "TetsuKodai Group LLC",
    url: "https://tetsukod.ai",
  },
};

export default function DocsHubPage() {
  const entries = listArtifacts();
  return (
    <>
      <script
        id="ld-docs-index"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      <DocHub entries={entries} />
    </>
  );
}
