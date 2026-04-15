import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

const description =
  "AIDE (Autonomous Intent-Driven Engineering) is a software methodology where intent specs cascade through a pipeline of specialized AI agents to produce production-quality code.";

export const metadata: Metadata = {
  title:
    "AIDE: Autonomous Intent-Driven Engineering -- Code is ephemeral. Intent is law.",
  description,
  openGraph: {
    title:
      "AIDE: Autonomous Intent-Driven Engineering -- Code is ephemeral. Intent is law.",
    description,
    url: "https://aidemd.dev",
    siteName: "AIDE",
    type: "website",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AIDE",
  url: "https://aidemd.dev",
  description,
  publisher: {
    "@type": "Organization",
    name: "TetsuKodai Group LLC",
    url: "https://tetsukod.ai",
  },
};

export default function Home() {
  return (
    <>
      <script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <LandingPage />
    </>
  );
}
