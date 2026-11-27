import "./observer.css";
import Footer from "@/app/_components/Footer";
import TopBar from "@/app/_components/TopBar";
import CaptureFigure from "./_components/CaptureFigure";
import ClosePanel from "./_components/ClosePanel";
import Hero from "./_components/Hero";
import Sections from "./_components/Sections";
import observerMetadata from "./_data/observerMetadata";

export const metadata = observerMetadata;

/**
 * The /observer feature page, built from Variant A of the observer design
 * handoff (`design-handoff/observer/`).
 *
 * Orchestrator only: it lays the regions out in order and holds no copy.
 * The site TopBar (observer active) and Footer replace the handoff's own
 * nav and footer; every visible string lives in `_data/observerCopy`; the
 * handoff stylesheet is ported to `observer.css`, scoped under `.o2`.
 * The copy button inside the install box is the only client component.
 */
export default function ObserverPage() {
  return (
    <>
      {/* Bypass block (WCAG 2.4.1): first focusable element on the page. */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      {/* Site navigation with the observer entry active. */}
      <TopBar sticky active="observer" />
      <main id="main" className="o2 va">
        <div className="o2-in">
          {/* Headline, install command and fact list. */}
          <Hero />
          {/* Hero capture beside the state legend. */}
          <CaptureFigure />
          {/* The six sections plus Setup. */}
          <Sections />
          {/* Closing panel repeating the install command. */}
          <ClosePanel />
        </div>
      </main>
      {/* Site footer. */}
      <Footer />
    </>
  );
}
