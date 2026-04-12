import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "AIDE — Autonomous Intent-Driven Engineering",
  description:
    "Intent in, working code out. Six specialized agents and a persistent brain turn what you describe into what you ship. Self-serve install via npx.",
  openGraph: {
    title: "AIDE — Autonomous Intent-Driven Engineering",
    description:
      "Intent in, working code out. Six specialized agents and a persistent brain turn what you describe into what you ship. Self-serve install via npx.",
    url: "https://aidemd.dev",
    siteName: "AIDE",
    type: "website",
  },
};

export default function Home() {
  return <LandingPage />;
}
