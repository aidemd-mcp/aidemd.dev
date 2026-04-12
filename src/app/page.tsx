import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "AIDE — Autonomous Intent-Driven Engineering",
  description:
    "Install aidemd-mcp and give your AI agents byte-faithful, timestamped, archivable context. Stop pasting docs. Start shipping.",
  openGraph: {
    title: "AIDE — Autonomous Intent-Driven Engineering",
    description:
      "Install aidemd-mcp and give your AI agents byte-faithful, timestamped, archivable context. Stop pasting docs. Start shipping.",
    url: "https://aidemd.dev",
    siteName: "AIDE",
    type: "website",
  },
};

export default function Home() {
  return <LandingPage />;
}
