// Docs shell — terminal aesthetic. Left sidebar, main column, tiny AIDEY helper.

const DOCS_PAGES = [
  { slug: 'aide-spec', title: 'aide-spec.md', num: 1 },
  { slug: 'aide-template', title: 'aide-template.md', num: 2 },
  { slug: 'plan-aide', title: 'plan-aide.md', num: 3 },
  { slug: 'todo-aide', title: 'todo-aide.md', num: 4 },
  { slug: 'progressive-disclosure', title: 'progressive-disclosure.md', num: 5 },
  { slug: 'agent-readable-code', title: 'agent-readable-code.md', num: 6 },
  { slug: 'automated-qa', title: 'automated-qa.md', num: 7 },
  { slug: 'cascading-alignment', title: 'cascading-alignment.md', num: 8 },
];

const DOCS_ACCENT = '#3d6b4a';
const DOCS_PAL = {
  bg: '#0d0b08',
  card: '#16120d',
  fg: '#e8dfce',
  dim: 'rgba(232,223,206,0.55)',
  dim2: 'rgba(232,223,206,0.38)',
  border: 'rgba(232,223,206,0.12)',
  hover: 'rgba(232,223,206,0.05)',
  accent: DOCS_ACCENT,
  todo: '#d6b25a',
  plan: '#7aa6d6',
};

function DocsShell({ current, children }) {
  const p = DOCS_PAL;
  return (
    <div style={{ background: p.bg, color: p.fg, fontFamily: '"JetBrains Mono", monospace', minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: p.card, borderBottom: `1px solid ${p.border}`, position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c93f' }} />
        <a href="Terminal.html" style={{ marginLeft: 18, fontSize: 13, color: p.fg, textDecoration: 'none', fontWeight: 600 }}>
          <span style={{ color: p.accent }}>$</span> aidemd.dev<span style={{ color: p.dim }}>/docs</span>
        </a>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: p.dim, display: 'flex', gap: 20 }}>
          <a href="Terminal.html" style={{ color: 'inherit', textDecoration: 'none' }}>home</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>github ↗</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>npm ↗</a>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 44px)' }}>
        {/* Sidebar */}
        <aside style={{ borderRight: `1px solid ${p.border}`, padding: '28px 0', background: p.bg, position: 'sticky', top: 44, height: 'calc(100vh - 44px)', overflow: 'auto' }}>
          <div style={{ padding: '0 24px 14px', fontSize: 11, color: p.dim2, letterSpacing: 1.5 }}># canonical docs</div>
          <nav>
            {DOCS_PAGES.map((pg) => {
              const active = pg.slug === current;
              return (
                <a key={pg.slug} href={`docs-${pg.slug}.html`} style={{
                  display: 'flex', alignItems: 'baseline', gap: 12,
                  padding: '7px 24px',
                  fontSize: 13,
                  color: active ? p.accent : p.fg,
                  background: active ? 'rgba(61,107,74,0.12)' : 'transparent',
                  borderLeft: `2px solid ${active ? p.accent : 'transparent'}`,
                  textDecoration: 'none',
                }}>
                  <span style={{ color: p.dim2, width: 14 }}>{String(pg.num).padStart(2, '0')}</span>
                  <span>{pg.title}</span>
                </a>
              );
            })}
          </nav>

          <div style={{ margin: '28px 24px 0', padding: '16px 14px', background: p.card, border: `1px solid ${p.border}`, borderRadius: 6, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <img src="assets/aidey-teach.png" alt="AIDEY" style={{ width: 58, height: 'auto', marginTop: -22, marginLeft: -4, filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: p.accent, marginBottom: 4 }}>AIDEY says:</div>
                <div style={{ fontSize: 11, color: p.fg, lineHeight: 1.5 }}>
                  Every page here is a <em style={{ color: p.accent, fontStyle: 'normal' }}>byte-faithful</em> render of the source file in your <code>.aide/</code> hub.
                </div>
              </div>
            </div>
          </div>

          <div style={{ margin: '20px 24px 0', fontSize: 10, color: p.dim2, lineHeight: 1.8 }}>
            <div># tip: every page has a</div>
            <div># commit hash for citation.</div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ padding: '40px 64px 80px', maxWidth: 1000 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// ─────────── Page-level primitives ───────────

function DocMeta({ published, commit, slug }) {
  const p = DOCS_PAL;
  const citeUrl = `https://aidemd.dev/docs/${slug}?v=${commit}`;
  const [copied, setCopied] = React.useState(false);
  return (
    <div style={{ padding: '14px 18px', background: p.card, border: `1px solid ${p.border}`, borderLeft: `2px solid ${p.accent}`, borderRadius: 4, fontSize: 12, marginBottom: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '4px 12px' }}>
        <div style={{ color: p.dim }}>Published</div>
        <div>{published}</div>
        <div style={{ color: p.dim }}>Source commit</div>
        <div><span style={{ padding: '1px 6px', background: 'rgba(232,223,206,0.05)', border: `1px solid ${p.border}`, borderRadius: 3 }}>{commit}</span></div>
        <div style={{ color: p.dim }}>Cite as</div>
        <div
          onClick={() => { navigator.clipboard?.writeText(citeUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          style={{ cursor: 'pointer', color: p.accent, display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <span style={{ borderBottom: `1px dotted ${p.accent}` }}>{citeUrl}</span>
          <span style={{ fontSize: 10, color: p.dim }}>{copied ? '✓ copied' : '⧉'}</span>
        </div>
      </div>
    </div>
  );
}

function H1({ children }) { return <h1 style={{ fontSize: 36, margin: '8px 0 22px', fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.1 }}>{children}</h1>; }
function H2({ children, id }) {
  const p = DOCS_PAL;
  return (
    <h2 id={id} style={{ fontSize: 22, margin: '44px 0 16px', fontWeight: 600, paddingBottom: 6, borderBottom: `1px solid ${p.border}`, letterSpacing: -0.2 }}>
      <span style={{ color: p.accent, marginRight: 10 }}>##</span>{children}
    </h2>
  );
}
function H3({ children, id }) {
  const p = DOCS_PAL;
  return <h3 id={id} style={{ fontSize: 16, margin: '28px 0 12px', fontWeight: 600 }}><span style={{ color: p.accent, marginRight: 8 }}>###</span>{children}</h3>;
}
function P({ children }) { return <p style={{ fontSize: 14, lineHeight: 1.75, margin: '0 0 14px', color: DOCS_PAL.fg }}>{children}</p>; }
function Lede({ children }) {
  return <p style={{ fontSize: 16, lineHeight: 1.7, margin: '0 0 20px', color: DOCS_PAL.fg, fontWeight: 400 }}>{children}</p>;
}
function UL({ children }) { return <ul style={{ margin: '0 0 16px', paddingLeft: 24, fontSize: 14, lineHeight: 1.75 }}>{children}</ul>; }
function LI({ children }) { return <li style={{ marginBottom: 6 }}>{children}</li>; }
function C({ children }) { return <code style={{ fontFamily: 'inherit', fontSize: 13, padding: '1px 6px', background: 'rgba(232,223,206,0.06)', border: `1px solid ${DOCS_PAL.border}`, borderRadius: 3, color: DOCS_PAL.accent }}>{children}</code>; }
function Strong({ children }) { return <strong style={{ color: DOCS_PAL.fg, fontWeight: 700 }}>{children}</strong>; }
function A({ href, children }) { return <a href={href} style={{ color: DOCS_PAL.accent, textDecoration: 'underline', textDecorationColor: 'rgba(61,107,74,0.4)', textUnderlineOffset: 3 }}>{children}</a>; }

function CodeBlock({ children, label }) {
  const p = DOCS_PAL;
  const [copied, setCopied] = React.useState(false);
  const text = Array.isArray(children) ? children.join('') : String(children);
  return (
    <div style={{ margin: '16px 0 20px', border: `1px solid ${p.border}`, borderRadius: 6, overflow: 'hidden', background: '#0a0906' }}>
      {label && (
        <div style={{ padding: '8px 14px', borderBottom: `1px solid ${p.border}`, fontSize: 11, color: p.dim, display: 'flex', justifyContent: 'space-between', background: p.card }}>
          <span>{label}</span>
          <span onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }} style={{ cursor: 'pointer', color: copied ? p.accent : p.dim }}>{copied ? '✓ copied' : 'copy'}</span>
        </div>
      )}
      <pre style={{ margin: 0, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, overflow: 'auto', color: p.fg, whiteSpace: 'pre' }}>{children}</pre>
    </div>
  );
}

function Table({ headers, rows }) {
  const p = DOCS_PAL;
  return (
    <div style={{ margin: '14px 0 22px', border: `1px solid ${p.border}`, borderRadius: 4, overflow: 'hidden', fontSize: 13 }}>
      <div style={{ display: 'grid', gridTemplateColumns: headers.map(() => '1fr').join(' '), background: p.card, borderBottom: `1px solid ${p.border}` }}>
        {headers.map((h, i) => <div key={i} style={{ padding: '10px 14px', color: p.accent, fontWeight: 600, borderRight: i < headers.length - 1 ? `1px solid ${p.border}` : 'none' }}>{h}</div>)}
      </div>
      {rows.map((row, r) => (
        <div key={r} style={{ display: 'grid', gridTemplateColumns: headers.map(() => '1fr').join(' '), borderBottom: r < rows.length - 1 ? `1px solid ${p.border}` : 'none' }}>
          {row.map((cell, i) => <div key={i} style={{ padding: '10px 14px', borderRight: i < headers.length - 1 ? `1px solid ${p.border}` : 'none', color: i === 0 ? p.fg : p.dim, lineHeight: 1.55 }}>{cell}</div>)}
        </div>
      ))}
    </div>
  );
}

function Callout({ kind = 'note', children }) {
  const p = DOCS_PAL;
  const colors = { note: p.accent, warn: p.todo, info: p.plan };
  const c = colors[kind];
  return (
    <div style={{ margin: '16px 0 20px', padding: '12px 16px', background: 'rgba(232,223,206,0.03)', border: `1px solid ${p.border}`, borderLeft: `3px solid ${c}`, borderRadius: 4, fontSize: 13, lineHeight: 1.7 }}>
      <div style={{ fontSize: 10, color: c, letterSpacing: 1.5, marginBottom: 4 }}>{kind.toUpperCase()}</div>
      {children}
    </div>
  );
}

function PrevNext({ prev, next }) {
  const p = DOCS_PAL;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 60, paddingTop: 24, borderTop: `1px solid ${p.border}` }}>
      {prev ? (
        <a href={`docs-${prev.slug}.html`} style={{ padding: '14px 16px', border: `1px solid ${p.border}`, borderRadius: 4, textDecoration: 'none', color: p.fg, background: p.card }}>
          <div style={{ fontSize: 11, color: p.dim, marginBottom: 4 }}>← prev</div>
          <div style={{ fontSize: 14, color: p.accent }}>{prev.title}</div>
        </a>
      ) : <div />}
      {next ? (
        <a href={`docs-${next.slug}.html`} style={{ padding: '14px 16px', border: `1px solid ${p.border}`, borderRadius: 4, textDecoration: 'none', color: p.fg, background: p.card, textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: p.dim, marginBottom: 4 }}>next →</div>
          <div style={{ fontSize: 14, color: p.accent }}>{next.title}</div>
        </a>
      ) : <div />}
    </div>
  );
}

function DocsFooter() {
  const p = DOCS_PAL;
  return (
    <div style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${p.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: p.dim2 }}>
      <div>© 2026 TetsuKodai Group LLC · <span style={{ color: p.accent }}>●</span> canonical</div>
      <div style={{ display: 'flex', gap: 20 }}>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>install</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>github ↗</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>privacy</a>
      </div>
    </div>
  );
}

Object.assign(window, {
  DocsShell, DocMeta, H1, H2, H3, P, Lede, UL, LI, C, Strong, A,
  CodeBlock, Table, Callout, PrevNext, DocsFooter,
  DOCS_PAGES, DOCS_PAL,
});
