import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "AIDEMD — Code is ephemeral. Intent is law.",
  description:
    "Intent in, working code out. Eight specialized agents and a persistent brain turn what you describe into what you ship. Self-serve install via npx.",
  openGraph: {
    title: "AIDEMD — Code is ephemeral. Intent is law.",
    description:
      "Intent in, working code out. Eight specialized agents and a persistent brain turn what you describe into what you ship. Self-serve install via npx.",
    url: "https://aidemd.dev",
    siteName: "AIDEMD",
    type: "website",
  },
};

export default function Home() {
  return <LandingPage />;
}
