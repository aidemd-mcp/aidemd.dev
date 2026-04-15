import type { Metadata } from "next";
import listArtifacts from "@/service/scaffold/listArtifacts";
import DocHub from "@/components/DocsPage/DocHub";

export const metadata: Metadata = {
  title: "Scaffold Tree — AIDE: Autonomous Intent-Driven Engineering",
  description:
    "Browse the full AIDE scaffold tree — canonical docs, pipeline agents, slash commands, and skills — exactly as aide_init installs them into a project.",
  openGraph: {
    title: "Scaffold Tree — AIDE: Autonomous Intent-Driven Engineering",
    description:
      "Browse the full AIDE scaffold tree — canonical docs, pipeline agents, slash commands, and skills — exactly as aide_init installs them into a project.",
    url: "https://aidemd.dev/docs",
    siteName: "AIDE",
    type: "website",
  },
};

export default function DocsHubPage() {
  const entries = listArtifacts();
  return <DocHub entries={entries} />;
}
