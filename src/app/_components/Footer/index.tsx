/**
 * Site footer.
 *
 * Left: "© 2026 TetsuKodai Group LLC · ● canonical" (● is accent-green).
 * Right: install (→ #quickstart), github ↗, privacy (→ /privacy).
 */
export default function Footer() {
  return (
    <footer
      className="flex flex-wrap items-center justify-between gap-[16px] font-mono text-[11px] text-[color:var(--color-dim-text)] px-[20px] md:px-[64px]"
      style={{ paddingTop: "30px", paddingBottom: "40px" }}
    >
      {/* Left */}
      <span>
        © 2026{" "}
        <a
          href="https://tetsukod.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--color-fg)] transition-colors"
        >
          TetsuKodai Group LLC
        </a>{" "}
        · <span className="text-[color:var(--color-accent)]">●</span>{" "}
        canonical
      </span>

      {/* Right nav */}
      <nav className="flex items-center gap-[24px]" aria-label="Footer navigation">
        <a
          href="#quickstart"
          className="hover:text-[color:var(--color-fg)] transition-colors"
        >
          install
        </a>
        <a
          href="https://github.com/aidemd-mcp/server"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--color-fg)] transition-colors"
        >
          github ↗
        </a>
        <a
          href="https://www.linkedin.com/in/jacob-carpenter-nodejs/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--color-fg)] transition-colors"
        >
          linkedin <span aria-hidden="true">↗</span>
        </a>
        <a
          href="https://discord.gg/N4NqMXuvTR"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--color-fg)] transition-colors"
        >
          discord <span aria-hidden="true">↗</span>
        </a>
        <a
          href="/privacy"
          className="hover:text-[color:var(--color-fg)] transition-colors"
        >
          privacy
        </a>
      </nav>
    </footer>
  );
}
