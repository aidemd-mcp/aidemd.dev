import type { Metadata } from "next";
import renderHub from "@/service/docs/renderHub";
import DocHub from "@/components/DocsPage/DocHub";

export const metadata: Metadata = {
  title: "Docs — AIDE",
  description:
    "The byte-faithful, timestamped, archivable canonical record of the AIDE methodology.",
  openGraph: {
    title: "Docs — AIDE",
    description:
      "The byte-faithful, timestamped, archivable canonical record of the AIDE methodology.",
    url: "https://aidemd.dev/docs",
    siteName: "AIDE",
    type: "website",
  },
};

export default async function DocsHubPage() {
  const docs = await renderHub();
  return <DocHub docs={docs} />;
}
