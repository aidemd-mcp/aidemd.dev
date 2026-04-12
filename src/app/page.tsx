import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "AIDE — Autonomous Intent-Driven Engineering",
  description:
    "Six specialized agents — spec-writer, researcher, domain expert, architect, implementor, QA — share a persistent brain across every session. Self-serve install via npx.",
  openGraph: {
    title: "AIDE — Autonomous Intent-Driven Engineering",
    description:
      "Six specialized agents — spec-writer, researcher, domain expert, architect, implementor, QA — share a persistent brain across every session. Self-serve install via npx.",
    url: "https://aidemd.dev",
    siteName: "AIDE",
    type: "website",
  },
};

export default function Home() {
  return <LandingPage />;
}
