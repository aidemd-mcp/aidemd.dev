import {
  FOOTER_TRIO,
  EXTERNAL_GITHUB_URL,
  EXTERNAL_NPM_URL,
} from "@/app/brain/_data/brainCopy";

/**
 * Section footer for /brain and /brain/recipes.
 *
 * Layout (horizontal flex, justify-between):
 *   Left  — attribution line with the accent-green static authority dot
 *   Right — three trio links (github ↗, npm ↗, discuss)
 *
 * This is the SIMPLE attribution footer rendered by the brain layout under
 * both routes. The RICHER WalkthroughFooter (FooterCard grid + trio row)
 * lives inside <Walkthrough /> and only appears on /brain.
 *
 * FOOTER_LINE value: "© 2026 TetsuKodai Group LLC · ● brain plugin interface"
 * The dot is inlined as a span so the accent color token can apply.
 */
export default function BrainFooter() {
  const [github, npm, discuss] = FOOTER_TRIO;

  return (
    <footer
      className="flex flex-wrap items-center justify-between gap-[16px] px-[36px] font-mono text-[11px] text-[color:var(--color-dim-2)]"
      style={{
        paddingTop: "24px",
        paddingBottom: "24px",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* Left: "© 2026 TetsuKodai Group LLC · ● brain plugin interface" */}
      <div>
        {"© 2026 TetsuKodai Group LLC · "}
        <span className="text-[color:var(--color-accent)]" aria-hidden="true">
          ●
        </span>
        {" brain plugin interface"}
      </div>

      {/* Right: trio links */}
      <nav
        className="flex items-center gap-[20px]"
        aria-label="Brain section footer navigation"
      >
        <a
          href={EXTERNAL_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--color-fg)] transition-colors"
        >
          {github}
        </a>
        <a
          href={EXTERNAL_NPM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--color-fg)] transition-colors"
        >
          {npm}
        </a>
        <a
          href={EXTERNAL_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--color-fg)] transition-colors"
        >
          {discuss}
        </a>
      </nav>
    </footer>
  );
}
