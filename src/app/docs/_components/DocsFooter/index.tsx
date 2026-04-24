/**
 * Docs-variant footer. Links: install (→ npm package), github ↗, privacy (→ /privacy).
 * Left: copyright + canonical-dot authority signal.
 */
export default function DocsFooter() {
  return (
    <footer
      style={{
        marginTop: 40,
        paddingTop: 20,
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 11,
        color: 'var(--color-dim-2)',
      }}
    >
      <span>
        © 2026 TetsuKodai Group LLC ·{' '}
        <span style={{ color: 'var(--color-accent)' }}>●</span> canonical
      </span>
      <nav style={{ display: 'flex', gap: 20 }} aria-label="Docs footer navigation">
        <a
          href="https://www.npmjs.com/package/@aidemd-mcp/server"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          install
        </a>
        <a
          href="https://github.com/aidemd-mcp/server"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          github ↗
        </a>
        <a
          href="/privacy"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          privacy
        </a>
      </nav>
    </footer>
  );
}
