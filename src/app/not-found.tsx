import type { Metadata } from "next";
import TopBar from "@/app/_components/TopBar";
import Footer from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "404 — Not Found",
  robots: { index: false, follow: true },
};

/**
 * 404 not-found page — minimal terminal-aesthetic fallback.
 * Uses the marketing variant of TopBar (no active prop).
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--color-bg)] text-[color:var(--color-fg)]">
      <a href="#main" className="skip-link">Skip to main content</a>
      <TopBar />
      <main id="main" className="flex flex-1 items-center justify-center">
        <h1
          className="font-mono text-[color:var(--color-fg)]"
          style={{ fontSize: 15, fontWeight: "inherit", margin: 0 }}
        >
          {"> route not found (404) — try /docs"}
        </h1>
      </main>
      <Footer />
    </div>
  );
}
