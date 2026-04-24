import type { Metadata } from "next";
import TopBar from "@/app/_components/TopBar";
import Footer from "@/app/_components/Footer";
import { LAST_UPDATED } from "./constants";

export const metadata: Metadata = {
  title: "Privacy Policy — aidemd.dev",
  description:
    "aidemd.dev collects only GA4 page-view analytics — no form inputs, no ad pixels, no PII beyond what GA4 records by default — and honors Do Not Track.",
  alternates: { canonical: "https://aidemd.dev/privacy" },
  robots: { index: true, follow: true },
};

/**
 * Static privacy policy route. Single-file leaf — no helpers or sub-components.
 * Uses the marketing shell (TopBar + Footer), not the docs template.
 */
export default function PrivacyPage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <TopBar />

      <main
        id="main"
        className="max-w-[var(--layout-max-width)] mx-auto px-[20px] md:px-[64px] py-[40px]"
      >
        <h1
          className="font-mono text-[color:var(--color-fg)] mb-[32px]"
          style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.5px" }}
        >
          Privacy Policy
        </h1>

        <div
          className="font-mono text-[color:var(--color-dim-text)] leading-[1.75]"
          style={{ fontSize: 14, maxWidth: 720 }}
        >
          {/* Last updated */}
          <p className="mb-[28px] text-[color:var(--color-dim-text)]" style={{ fontSize: 12 }}>
            Last updated:{" "}
            <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
          </p>

          {/* What is tracked */}
          <section aria-label="What is tracked" className="mb-[32px]">
            <h2
              className="font-mono text-[color:var(--color-fg)] mb-[12px]"
              style={{ fontSize: 15, fontWeight: 600 }}
            >
              ## what is tracked
            </h2>
            <p className="mb-[12px]">
              This site sends GA4 page-view events to Google Analytics. Each hit
              carries standard GA4 fields: page path, referrer, device and browser
              metadata. IP addresses are truncated by GA4 before storage — this
              site does not log or store full IPs. The site has no forms; no user
              input is collected.
            </p>
            <p>
              GA4 sets first-party cookies (<code className="text-[color:var(--color-fg)]">_ga</code>,{" "}
              <code className="text-[color:var(--color-fg)]">_ga_*</code>) in your
              browser to distinguish sessions. These cookies are not shared with
              any ad network.
            </p>
          </section>

          {/* Do Not Track */}
          <section aria-label="Do Not Track" className="mb-[32px]">
            <h2
              className="font-mono text-[color:var(--color-fg)] mb-[12px]"
              style={{ fontSize: 15, fontWeight: 600 }}
            >
              ## do not track
            </h2>
            <p>
              If your browser signals{" "}
              <code className="text-[color:var(--color-fg)]">DNT: 1</code>, no
              GA4 event fires for your session. The check runs client-side before
              the analytics script initializes; no hit reaches Google if DNT is
              set.
            </p>
          </section>

          {/* No ad pixels */}
          <section aria-label="No ad or retargeting pixels" className="mb-[32px]">
            <h2
              className="font-mono text-[color:var(--color-fg)] mb-[12px]"
              style={{ fontSize: 15, fontWeight: 600 }}
            >
              ## no ad or retargeting pixels
            </h2>
            <p>
              This site loads no Meta pixel, no LinkedIn Insight Tag, and no
              third-party ad-network beacon of any kind. The only external
              analytics call is the single GA4 measurement hit described above.
            </p>
          </section>

          {/* Data controller */}
          <section aria-label="Data controller" className="mb-[32px]">
            <h2
              className="font-mono text-[color:var(--color-fg)] mb-[12px]"
              style={{ fontSize: 15, fontWeight: 600 }}
            >
              ## data controller
            </h2>
            <p>
              The data controller for this site is{" "}
              <strong className="text-[color:var(--color-fg)] font-semibold">
                TetsuKodai Group LLC
              </strong>
              . The sole data processor beyond this site&apos;s own hosting is
              Google Analytics (Google LLC). No other third party receives data
              collected through this site.
            </p>
          </section>

          {/* Contact */}
          <section aria-label="Contact" className="mb-[32px]">
            <h2
              className="font-mono text-[color:var(--color-fg)] mb-[12px]"
              style={{ fontSize: 15, fontWeight: 600 }}
            >
              ## contact
            </h2>
            <p>
              Privacy questions and data requests can be submitted via the
              project&apos;s GitHub repository:{" "}
              <a
                href="https://github.com/aidemd-mcp/server"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--color-accent)] hover:underline"
              >
                github.com/aidemd-mcp/server
              </a>
              . Open an issue and label it <code className="text-[color:var(--color-fg)]">privacy</code>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
