import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title:
    "AIDE: Autonomous Intent-Driven Engineering — Code is ephemeral. Intent is law.",
  description:
    "AIDE (Autonomous Intent-Driven Engineering) is a software methodology where intent specs cascade through a pipeline of specialized AI agents to produce production-quality code.",
  openGraph: {
    title:
      "AIDE: Autonomous Intent-Driven Engineering — Code is ephemeral. Intent is law.",
    description:
      "AIDE (Autonomous Intent-Driven Engineering) is a software methodology where intent specs cascade through a pipeline of specialized AI agents to produce production-quality code.",
    url: "https://aidemd.dev",
    siteName: "AIDE",
    type: "website",
  },
};

export default function Home() {
  return <LandingPage />;
}
