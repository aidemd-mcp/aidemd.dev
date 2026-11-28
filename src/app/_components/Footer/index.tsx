/**
 * Site footer.
 *
 * Left: "© 2026 Lowmeadow LLC · ● canonical" (● is accent-green); no link
 * around the company name and no personal profile anywhere in the footer.
 * Right: install (→ npm package), github ↗, discord ↗, learn (→ /learn/),
 * privacy (→ /privacy).
 */
export default function Footer() {
  return (
    <footer
      className="flex flex-wrap items-center justify-between gap-[16px] font-mono text-[11px] text-[color:var(--color-dim-text)] px-[20px] md:px-[64px]"
      style={{ paddingTop: "30px", paddingBottom: "40px" }}
    >
      {/* Left */}
      <span>
        © 2026 Lowmeadow LLC · <span className="text-[color:var(--color-accent)]">●</span>{" "}
        canonical
      </span>

      {/* Right nav */}
      <nav className="flex items-center gap-[24px]" aria-label="Footer navigation">
        <a
          href="https://www.npmjs.com/package/@aidemd-mcp/server"
          target="_blank"
          rel="noopener noreferrer"
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
          href="https://discord.gg/N4NqMXuvTR"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--color-fg)] transition-colors"
        >
          discord <span aria-hidden="true">↗</span>
        </a>
        <a
          href="/learn/"
          className="hover:text-[color:var(--color-fg)] transition-colors"
        >
          learn
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
