import TopBar from "@/app/_components/TopBar";
import Footer from "@/app/_components/Footer";

/**
 * 404 not-found page — minimal terminal-aesthetic fallback.
 * Uses the marketing variant of TopBar (no active prop).
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--color-bg)] text-[color:var(--color-fg)]">
      <TopBar />
      <main className="flex flex-1 items-center justify-center">
        <p
          className="font-mono text-[color:var(--color-fg)]"
          style={{ fontSize: 15 }}
        >
          {"> route not found (404) — try /docs"}
        </p>
      </main>
      <Footer />
    </div>
  );
}
