// Variant B — Terminal / IDE dark.
// Everything looks like it belongs in a terminal. Mono everywhere. Amber accent.

function VariantTerminal({ tweaks }) {
  // Terminal variant overrides: if the user picks ink/terracotta, swap to amber for readability on dark.
  const userAccent = tweaks.accent;
  const accent = (userAccent === '#1a1410' || userAccent === '#c25a3a') ? '#e8a43a' : userAccent;
  const t = typeStack(tweaks.typePairing === 'editorial' ? 'terminal' : tweaks.typePairing);

  const palette = {
    bg: '#0d0b08',
    card: '#16120d',
    fg: '#e8dfce',
    dim: 'rgba(232,223,206,0.55)',
    border: 'rgba(232,223,206,0.12)',
    hover: 'rgba(232,223,206,0.05)',
    terminal: '#0a0906',
    plan: '#7aa6d6',
    todo: '#d6b25a',
    code: 'rgba(232,223,206,0.4)',
    deep: true,
  };

  return (
    <div style={{ background: palette.bg, color: palette.fg, fontFamily: t.mono, width: '100%', height: '100%', overflow: 'auto', position: 'relative' }}>
      {/* TOP BAR — like a terminal tab */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: palette.card, borderBottom: `1px solid ${palette.border}` }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c93f' }} />
        <span style={{ marginLeft: 18, fontSize: 12, color: palette.dim }}>aidemd.dev — zsh</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: palette.dim, display: 'flex', gap: 20 }}>
          <a href="docs.html" style={{ color: 'inherit', textDecoration: 'none' }}>docs</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>pipeline</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>brain</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>github ↗</a>
        </span>
      </div>

      {/* HERO — shell session */}
      <div style={{ padding: '50px 64px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 12, color: accent, letterSpacing: 2, marginBottom: 16 }}>~/aidemd.dev ∙ main ∙ a6f9c3d</div>
            <h1 style={{ fontSize: 56, margin: 0, fontWeight: 500, lineHeight: 1.1, letterSpacing: -0.5 }}>
              <span style={{ color: accent }}>$</span> describe intent.<br />
              <span style={{ color: palette.dim }}>#</span> the pipeline does the rest.
            </h1>
            <pre style={{ fontSize: 14, lineHeight: 1.7, marginTop: 28, color: palette.dim, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
{`# AIDE is Autonomous Intent-Driven Engineering.
# a spec-first framework for agentic development.
# heavier than OpenSpec. more opinionated.
# designed to leave you at 0% code review.`}
            </pre>
            <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
              <TermInstall accent={accent} palette={palette} />
            </div>
            <div style={{ marginTop: 22, fontSize: 11, color: palette.dim, display: 'flex', gap: 20 }}>
              <span style={{ color: accent }}>[✓]</span><span>works with Claude Code</span>
              <span style={{ color: accent }}>[✓]</span><span>MCP-native</span>
              <span style={{ color: accent }}>[✓]</span><span>Obsidian vault as the brain</span>
            </div>
          </div>
          <div>
            <TermFrame title="src/service/retention/.aide" accent={accent} palette={palette}>
              <div style={{ color: palette.dim }}>---</div>
              <div><span style={{ color: palette.dim }}>scope:</span> src/service/retention</div>
              <div><span style={{ color: palette.dim }}>intent: </span>{'>'}</div>
              <div style={{ paddingLeft: 12 }}>Bring lapsed customers back by referencing something</div>
              <div style={{ paddingLeft: 12 }}>they actually did — not a templated "we miss you".</div>
              <div style={{ color: palette.dim }}>outcomes:</div>
              <div style={{ paddingLeft: 12, color: palette.dim }}>desired:</div>
              <div style={{ paddingLeft: 24 }}><span style={{ color: accent }}>- </span>Opens with factual order-history reference</div>
              <div style={{ paddingLeft: 24 }}><span style={{ color: accent }}>- </span>Body under 80 words</div>
              <div style={{ paddingLeft: 12, color: palette.dim }}>undesired:</div>
              <div style={{ paddingLeft: 24 }}><span style={{ color: palette.todo }}>- </span>Fabricated references</div>
              <div style={{ paddingLeft: 24 }}><span style={{ color: palette.todo }}>- </span>Guilt-trip language</div>
              <div style={{ color: palette.dim }}>---</div>
              <div style={{ marginTop: 8 }}>## Strategy</div>
              <div style={{ color: palette.dim, paddingLeft: 0 }}>Opener specificity drives 64% of reopens...</div>
            </TermFrame>
          </div>
        </div>
      </div>

      <AsciiDivider palette={palette} />

      {/* THREE-LAYER MODEL */}
      <div style={{ padding: '40px 64px' }}>
        <TermHeader num="01" title="three-layer model" palette={palette} accent={accent} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 28 }}>
          <LayerBox n="brain/" label="durable knowledge" body="External to project. Obsidian vault or MCP store. research/ for domain expertise, coding-playbook/ for your conventions." accent={accent} palette={palette} />
          <LayerBox n=".aide" label="the contract" body="Short structured brief next to the orchestrator. scope, intent, outcomes.desired, outcomes.undesired. No code." accent={accent} palette={palette} />
          <LayerBox n="src/" label="ephemeral code" body="If the intent changes, the code changes. The spec persists; the code is its current expression." accent={accent} palette={palette} />
        </div>
      </div>

      <AsciiDivider palette={palette} />

      {/* PIPELINE */}
      <div style={{ padding: '40px 64px' }}>
        <TermHeader num="02" title="the agent pipeline" palette={palette} accent={accent} />
        <div style={{ fontSize: 13, color: palette.dim, marginTop: 8, marginBottom: 28, lineHeight: 1.6, maxWidth: 780 }}>
          # each stage runs in a fresh context. no agent carries conversation from<br />
          # the last. handoff is via files: .aide, plan.aide, todo.aide, brain notes.<br />
          # click a stage to see its i/o.
        </div>
        <Pipeline accent={accent} palette={palette} mono={t.mono} sans={t.mono} />
      </div>

      <AsciiDivider palette={palette} />

      {/* INTENT TREE */}
      <div style={{ padding: '40px 64px' }}>
        <TermHeader num="03" title="the cascading intent tree" palette={palette} accent={accent} />
        <div style={{ fontSize: 13, color: palette.dim, marginTop: 8, marginBottom: 24, lineHeight: 1.6, maxWidth: 780 }}>
          # hierarchy of .aide specs rooted at the project level. each child<br />
          # narrows its parent. agents walk root→leaf before judging validity.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
          <IntentTree accent={accent} palette={palette} mono={t.mono} roots={[INTENT_TREE, SRC_TREE]} />
          <div>
            <TermFrame title="aide_discover --path src/service/retention/draftOpener" accent={accent} palette={palette}>
              <div style={{ color: palette.dim }}># ancestor chain (root → leaf):</div>
              <div style={{ color: accent, marginTop: 6 }}>◆ .aide/intent.aide</div>
              <div style={{ color: palette.dim, paddingLeft: 12, fontSize: 12 }}>project-level intent</div>
              <div style={{ color: palette.fg, paddingLeft: 12, fontSize: 12 }}>status: <span style={{ color: '#8cbe5a' }}>aligned</span></div>
              <div style={{ color: accent, marginTop: 6 }}>◆ src/.aide</div>
              <div style={{ color: palette.dim, paddingLeft: 12, fontSize: 12 }}>orchestrate email pipeline</div>
              <div style={{ color: palette.fg, paddingLeft: 12, fontSize: 12 }}>status: <span style={{ color: '#8cbe5a' }}>aligned</span></div>
              <div style={{ color: accent, marginTop: 6 }}>◆ src/service/retention/.aide</div>
              <div style={{ color: palette.dim, paddingLeft: 12, fontSize: 12 }}>retention email strategy</div>
              <div style={{ color: palette.fg, paddingLeft: 12, fontSize: 12 }}>status: <span style={{ color: '#8cbe5a' }}>aligned</span></div>
              <div style={{ color: accent, marginTop: 6 }}>◆ src/service/retention/draftOpener/.aide</div>
              <div style={{ color: palette.dim, paddingLeft: 12, fontSize: 12 }}>opener specificity</div>
              <div style={{ color: palette.fg, paddingLeft: 12, fontSize: 12 }}>status: <span style={{ color: palette.todo }}>pending</span></div>
              <div style={{ marginTop: 8, color: palette.dim }}>{'---'}</div>
              <div style={{ color: palette.dim, fontSize: 12 }}># 4 specs. inherited outcomes: 7 desired, 9 undesired.</div>
            </TermFrame>
          </div>
        </div>
      </div>

      <AsciiDivider palette={palette} />

      {/* BRAIN */}
      <div style={{ padding: '40px 64px' }}>
        <TermHeader num="04" title="the brain — your obsidian vault" palette={palette} accent={accent} />
        <div style={{ fontSize: 13, color: palette.dim, marginTop: 8, marginBottom: 28, lineHeight: 1.6 }}>
          # research/ — domain notes read by the strategist.<br />
          # coding-playbook/ — convention notes read by the architect + implementor.
        </div>
        <VaultBlock accent={accent} palette={palette} mono={t.mono} sans={t.mono} />
      </div>

      <AsciiDivider palette={palette} />

      {/* CLI DEMO */}
      <div style={{ padding: '40px 64px' }}>
        <TermHeader num="05" title="a full session" palette={palette} accent={accent} />
        <div style={{ marginTop: 20 }}>
          <CLIDemo accent={accent} palette={palette} mono={t.mono} />
        </div>
      </div>

      <AsciiDivider palette={palette} />

      {/* QUICKSTART */}
      <div style={{ padding: '40px 64px' }}>
        <TermHeader num="06" title="quickstart" palette={palette} accent={accent} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>
          <TermStep n="1" cmd="npx @aidemd-mcp/server@latest init" note="scaffolds .aide/ and connects obsidian" accent={accent} palette={palette} />
          <TermStep n="2" cmd="/aide:research <domain>" note="or drop your own notes into the vault" accent={accent} palette={palette} />
          <TermStep n="3" cmd="/aide" note="interview → spec → research → plan → build → qa" accent={accent} palette={palette} />
        </div>
      </div>

      <AsciiDivider palette={palette} />

      {/* FOOTER */}
      <div style={{ padding: '30px 64px 40px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: palette.dim }}>
        <div>© 2026 TetsuKodai Group LLC · <span style={{ color: accent }}>●</span> all systems nominal</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a style={{ color: 'inherit' }}>github ↗</a>
          <a style={{ color: 'inherit' }}>npm ↗</a>
          <a style={{ color: 'inherit' }}>waitlist</a>
        </div>
      </div>

      <AideyGuide accent={accent} palette={palette} variant="dark" />
    </div>
  );
}

function TermInstall({ accent, palette }) {
  const [copied, setCopied] = React.useState(false);
  const cmd = 'npx @aidemd-mcp/server@latest init';
  return (
    <>
      <div
        onClick={() => { navigator.clipboard?.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        style={{ padding: '12px 14px', background: palette.card, border: `1px solid ${palette.border}`, borderRadius: 4, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <span style={{ color: accent }}>$</span>
        <span>{cmd}</span>
        <span style={{ color: palette.dim, fontSize: 11, marginLeft: 4 }}>{copied ? '✓ copied' : '⧉'}</span>
      </div>
      <button style={{ padding: '12px 20px', background: accent, color: '#0d0b08', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
        read the spec →
      </button>
    </>
  );
}

function TermFrame({ title, accent, palette, children }) {
  return (
    <div style={{ background: palette.card, border: `1px solid ${palette.border}`, borderRadius: 6, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${palette.border}` }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: palette.dim }} />
        <span style={{ fontSize: 11, color: palette.dim, marginLeft: 6 }}>{title}</span>
      </div>
      <div style={{ padding: '16px 18px', fontSize: 13, lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  );
}

function TermHeader({ num, title, palette, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
      <span style={{ color: accent, fontSize: 14 }}>§{num}</span>
      <span style={{ fontSize: 22, fontWeight: 600, color: palette.fg }}>{title}</span>
    </div>
  );
}

function AsciiDivider({ palette }) {
  return (
    <div style={{ padding: '6px 64px', color: palette.dim, fontSize: 12, letterSpacing: 0 }}>
      <div style={{ borderTop: `1px dashed ${palette.border}` }} />
    </div>
  );
}

function LayerBox({ n, label, body, accent, palette }) {
  return (
    <div style={{ background: palette.card, border: `1px solid ${palette.border}`, borderLeft: `2px solid ${accent}`, borderRadius: 4, padding: '16px 18px' }}>
      <div style={{ fontSize: 13, color: accent, marginBottom: 4 }}>{n}</div>
      <div style={{ fontSize: 11, color: palette.dim, marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: palette.fg }}>{body}</div>
    </div>
  );
}

function TermStep({ n, cmd, note, accent, palette }) {
  return (
    <div style={{ background: palette.card, border: `1px solid ${palette.border}`, borderRadius: 4, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, color: accent, marginBottom: 8 }}>step {n}</div>
      <div style={{ fontSize: 13, marginBottom: 10 }}><span style={{ color: accent }}>$ </span>{cmd}</div>
      <div style={{ fontSize: 12, color: palette.dim, lineHeight: 1.5 }}># {note}</div>
    </div>
  );
}

Object.assign(window, { VariantTerminal });
