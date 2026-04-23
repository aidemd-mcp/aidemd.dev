// Variant C — Quiet confidence / Linear-style.
// Warm off-white, single strong accent, generous space, understated.
// Feels like Linear / Vercel / Rauno's work.

function VariantLinear({ tweaks }) {
  const accent = tweaks.accent;
  const t = typeStack(tweaks.typePairing === 'editorial' ? 'linear' : tweaks.typePairing);

  const palette = {
    bg: '#fbf9f4',
    card: '#ffffff',
    fg: '#1a1612',
    dim: 'rgba(26,22,18,0.58)',
    border: 'rgba(26,22,18,0.08)',
    hover: 'rgba(26,22,18,0.03)',
    terminal: '#14110c',
    plan: '#6b8ab8',
    todo: '#c7a04a',
    code: 'rgba(26,22,18,0.4)',
    deep: true,
  };

  return (
    <div style={{ background: palette.bg, color: palette.fg, fontFamily: t.sans, width: '100%', height: '100%', overflow: 'auto', position: 'relative', fontFeatureSettings: '"ss01", "cv11"' }}>
      {/* NAV — minimal, Linear-style */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 56px', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(251,249,244,0.85)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${palette.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, letterSpacing: -0.2 }}>
          <svg width="18" height="18" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="2" fill="none" stroke={accent} strokeWidth="1.5" /><rect x="5" y="5" width="8" height="8" rx="1" fill={accent} /></svg>
          <span>aidemd</span>
          <span style={{ color: palette.dim, fontWeight: 400 }}>/dev</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: palette.dim }}>
          <a style={navLink(palette)}>Docs</a>
          <a style={navLink(palette)}>Pipeline</a>
          <a style={navLink(palette)}>Brain</a>
          <a style={navLink(palette)}>Changelog</a>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={ghostBtn(palette, t)}>GitHub</button>
          <button style={primaryBtn(accent, t)}>Install →</button>
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: '100px 56px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: palette.card, border: `1px solid ${palette.border}`, borderRadius: 999, fontSize: 12, color: palette.dim, marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
          <span>v0.4 · Autonomous Intent-Driven Engineering</span>
        </div>
        <h1 style={{ fontFamily: t.display, fontSize: 68, lineHeight: 1.02, margin: 0, fontWeight: 600, letterSpacing: -2, maxWidth: 920 }}>
          Spend 0% reviewing code.<br />
          <span style={{ color: palette.dim }}>100% describing intent.</span>
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.5, marginTop: 28, color: palette.dim, maxWidth: 640 }}>
          AIDE is a spec-first framework for agentic development. Six specialized agents convert your intent into production code — with a domain-expert agent that levels up every project by researching the problem space for you.
        </p>
        <div style={{ marginTop: 36, display: 'flex', gap: 12, alignItems: 'center' }}>
          <SoftInstall accent={accent} palette={palette} t={t} />
        </div>
        <div style={{ marginTop: 22, fontSize: 13, color: palette.dim, display: 'flex', gap: 26, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check accent={accent} /> Works with Claude Code</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check accent={accent} /> MCP-native</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check accent={accent} /> Obsidian vault as the brain</span>
        </div>
      </div>

      {/* HERO ARTIFACT — the .aide rendered on a plinth */}
      <div style={{ padding: '0 56px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ position: 'relative' }}>
          <AidePlinth accent={accent} palette={palette} t={t} />
        </div>
      </div>

      {/* THREE LAYERS */}
      <div style={{ padding: '80px 56px', borderTop: `1px solid ${palette.border}`, background: palette.card }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SoftEyebrow label="The model" accent={accent} palette={palette} t={t} />
          <h2 style={{ fontFamily: t.display, fontSize: 40, fontWeight: 600, letterSpacing: -1, margin: '10px 0 50px' }}>Three layers. Clear roles.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            <LayerCard n="01" title="The brain" sub="durable" body="External. An Obsidian vault or MCP memory store. Two rooms: research/ for domain knowledge, coding-playbook/ for your conventions. Fill it once — reuse it forever." accent={accent} palette={palette} t={t} />
            <LayerCard n="02" title="The .aide" sub="contract" body="A short structured brief next to the orchestrator it governs. scope, intent, outcomes.desired, outcomes.undesired. If it doesn't serve the intent, it's cut." accent={accent} palette={palette} t={t} />
            <LayerCard n="03" title="The code" sub="ephemeral" body="The implementation. If the intent changes, the code changes. The spec persists; the code is just its current expression." accent={accent} palette={palette} t={t} />
          </div>
        </div>
      </div>

      {/* PIPELINE */}
      <div style={{ padding: '100px 56px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SoftEyebrow label="The pipeline" accent={accent} palette={palette} t={t} />
          <h2 style={{ fontFamily: t.display, fontSize: 40, fontWeight: 600, letterSpacing: -1, margin: '10px 0 14px' }}>Six agents. One pipeline.</h2>
          <p style={{ fontSize: 16, color: palette.dim, maxWidth: 640, margin: '0 0 44px', lineHeight: 1.55 }}>
            Each stage runs in a fresh context. Handoff is via files only — no shared conversation, no bloat. Pick any stage to see what it reads and what it writes.
          </p>
          <Pipeline accent={accent} palette={palette} mono={t.mono} sans={t.sans} />
        </div>
      </div>

      {/* INTENT TREE */}
      <div style={{ padding: '80px 56px', background: palette.card, borderTop: `1px solid ${palette.border}`, borderBottom: `1px solid ${palette.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SoftEyebrow label="The intent tree" accent={accent} palette={palette} t={t} />
          <h2 style={{ fontFamily: t.display, fontSize: 40, fontWeight: 600, letterSpacing: -1, margin: '10px 0 14px' }}>Your app becomes queryable by agents.</h2>
          <p style={{ fontSize: 16, color: palette.dim, maxWidth: 640, margin: '0 0 32px', lineHeight: 1.55 }}>
            A cascading hierarchy of .aide specs rooted at <code style={{ fontFamily: t.mono, background: palette.bg, padding: '1px 6px', borderRadius: 3, color: accent }}>.aide/intent.aide</code>. Each child narrows the intent of its parent. Agents walk root→leaf to understand any module in full context.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28, alignItems: 'start' }}>
            <IntentTree accent={accent} palette={palette} mono={t.mono} roots={[INTENT_TREE, SRC_TREE]} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <TreeCallout title="Placement rule" body="Specs live next to orchestrator index.ts files. Never next to helpers. Helpers are self-explanatory by name." accent={accent} palette={palette} t={t} />
              <TreeCallout title="Inheritance" body="A child .aide never restates parent context — it narrows it. If a child could be copy-pasted into a sibling folder and still make sense, it's too generic." accent={accent} palette={palette} t={t} />
              <TreeCallout title="Strict cascading" body="A child's outcomes don't replace the parent's — they narrow them. Every ancestor's outcomes still apply." accent={accent} palette={palette} t={t} />
            </div>
          </div>
        </div>
      </div>

      {/* BRAIN */}
      <div style={{ padding: '100px 56px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SoftEyebrow label="The brain" accent={accent} palette={palette} t={t} />
          <h2 style={{ fontFamily: t.display, fontSize: 40, fontWeight: 600, letterSpacing: -1, margin: '10px 0 14px' }}>An Obsidian vault with two rooms.</h2>
          <p style={{ fontSize: 16, color: palette.dim, maxWidth: 640, margin: '0 0 40px', lineHeight: 1.55 }}>
            Different agents draw on different slices. The strategist reads research when filling Strategy. The architect reads the playbook when translating intent into a plan. Neither bloats the repo with reference material every session has to re-read.
          </p>
          <VaultBlock accent={accent} palette={palette} mono={t.mono} sans={t.sans} />
        </div>
      </div>

      {/* CLI DEMO */}
      <div style={{ padding: '80px 56px', background: palette.card, borderTop: `1px solid ${palette.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SoftEyebrow label="A session" accent={accent} palette={palette} t={t} />
          <h2 style={{ fontFamily: t.display, fontSize: 40, fontWeight: 600, letterSpacing: -1, margin: '10px 0 14px' }}>Approval gates only where they matter.</h2>
          <p style={{ fontSize: 16, color: palette.dim, maxWidth: 640, margin: '0 0 40px', lineHeight: 1.55 }}>
            You describe the module. The orchestrator runs the pipeline. Two approval gates: the spec frontmatter, and the architect's plan. Everything in between is a file you can inspect — never a decision you have to make.
          </p>
          <CLIDemo accent={accent} palette={palette} mono={t.mono} />
        </div>
      </div>

      {/* QUICKSTART + COMPARISON side by side */}
      <div style={{ padding: '100px 56px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SoftEyebrow label="Get started" accent={accent} palette={palette} t={t} />
          <h2 style={{ fontFamily: t.display, fontSize: 40, fontWeight: 600, letterSpacing: -1, margin: '10px 0 40px' }}>Three commands.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <SoftStep n="1" title="Install the MCP server" cmd="npx @aidemd-mcp/server@latest init" note="Scaffolds .aide/ and connects your Obsidian vault." accent={accent} palette={palette} t={t} />
            <SoftStep n="2" title="Fill the brain" cmd="/aide:research <domain>" note="Or drop your own notes into the vault. Both work." accent={accent} palette={palette} t={t} />
            <SoftStep n="3" title="Run the pipeline" cmd="/aide" note="Interview → spec → research → synthesize → plan → build → qa." accent={accent} palette={palette} t={t} />
          </div>
        </div>
      </div>

      {/* CTA BAND */}
      <div style={{ padding: '60px 56px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 56px', background: palette.fg, color: palette.bg, borderRadius: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontFamily: t.display, fontSize: 36, fontWeight: 600, margin: 0, letterSpacing: -1, lineHeight: 1.1 }}>
              Ready to describe, not review?
            </h3>
            <p style={{ fontSize: 15, margin: '10px 0 0', color: 'rgba(251,249,244,0.65)' }}>One command installs the MCP. Works with Claude Code today.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ padding: '14px 22px', background: accent, color: '#fff', border: 'none', borderRadius: 8, fontFamily: t.sans, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Install AIDE →</button>
            <button style={{ padding: '14px 22px', background: 'transparent', color: palette.bg, border: '1px solid rgba(251,249,244,0.25)', borderRadius: 8, fontFamily: t.sans, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Read the spec</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: '40px 56px 60px', maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: palette.dim, borderTop: `1px solid ${palette.border}` }}>
        <div style={{ paddingTop: 24 }}>© 2026 TetsuKodai Group LLC</div>
        <div style={{ display: 'flex', gap: 20, paddingTop: 24 }}>
          <a style={navLink(palette)}>GitHub</a>
          <a style={navLink(palette)}>npm</a>
          <a style={navLink(palette)}>Waitlist</a>
          <a style={navLink(palette)}>Privacy</a>
          <a style={navLink(palette)}>Terms</a>
        </div>
      </div>

      <AideyGuide accent={accent} palette={palette} variant="light" />
    </div>
  );
}

function navLink(palette) {
  return { color: 'inherit', textDecoration: 'none', cursor: 'pointer' };
}

function ghostBtn(palette, t) {
  return { padding: '8px 14px', background: 'transparent', border: `1px solid ${palette.border}`, borderRadius: 6, fontFamily: t.sans, fontSize: 13, color: palette.fg, cursor: 'pointer', fontWeight: 500 };
}

function primaryBtn(accent, t) {
  return { padding: '8px 14px', background: accent, border: 'none', borderRadius: 6, fontFamily: t.sans, fontSize: 13, color: '#fff', cursor: 'pointer', fontWeight: 600 };
}

function Check({ accent }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7l3 3 5-6" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

function SoftEyebrow({ label, accent, palette, t }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontFamily: t.mono, color: palette.dim }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent }} />
      <span style={{ letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

function SoftInstall({ accent, palette, t }) {
  const [copied, setCopied] = React.useState(false);
  const cmd = 'npx @aidemd-mcp/server@latest init';
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
      <div
        onClick={() => { navigator.clipboard?.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        style={{ padding: '14px 18px', background: palette.card, border: `1px solid ${palette.border}`, borderRadius: 10, fontFamily: t.mono, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
      >
        <span style={{ color: accent }}>$</span>
        <span>{cmd}</span>
        <span style={{ color: palette.dim, fontSize: 12, marginLeft: 6 }}>{copied ? '✓ copied' : 'copy'}</span>
      </div>
      <button style={{ padding: '14px 22px', background: accent, color: '#fff', border: 'none', borderRadius: 10, fontFamily: t.sans, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        Read the spec →
      </button>
    </div>
  );
}

function AidePlinth({ accent, palette, t }) {
  return (
    <div style={{ background: palette.card, border: `1px solid ${palette.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 60px rgba(26,22,18,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: palette.bg, borderBottom: `1px solid ${palette.border}`, fontSize: 12, color: palette.dim, fontFamily: t.mono }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d8c5b8' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d8c5b8' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d8c5b8' }} />
        <span style={{ marginLeft: 12 }}>src/service/retention/.aide</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, padding: '2px 8px', background: 'rgba(140,180,100,0.15)', border: '1px solid rgba(140,180,100,0.3)', borderRadius: 3, color: '#4c7a3a' }}>aligned</span>
      </div>
      <div style={{ padding: '24px 28px', fontFamily: t.mono, fontSize: 13, lineHeight: 1.8 }}>
        <div style={{ color: palette.dim }}>---</div>
        <div><span style={{ color: palette.dim }}>scope:</span> src/service/retention</div>
        <div><span style={{ color: palette.dim }}>description:</span> lapsed-customer retention emails</div>
        <div><span style={{ color: palette.dim }}>intent: </span>{'>'}</div>
        <div style={{ paddingLeft: 14 }}>Bring lapsed customers back by referencing something they actually did —</div>
        <div style={{ paddingLeft: 14 }}>not a templated "we miss you".</div>
        <div style={{ color: palette.dim }}>outcomes:</div>
        <div style={{ paddingLeft: 14, color: palette.dim }}>desired:</div>
        <div style={{ paddingLeft: 28 }}><span style={{ color: accent }}>- </span>Opens with a factual order-history reference</div>
        <div style={{ paddingLeft: 28 }}><span style={{ color: accent }}>- </span>Body under 80 words</div>
        <div style={{ paddingLeft: 28 }}><span style={{ color: accent }}>- </span>CTA is a single link, not a button array</div>
        <div style={{ paddingLeft: 14, color: palette.dim }}>undesired:</div>
        <div style={{ paddingLeft: 28 }}><span style={{ color: palette.todo }}>- </span>Fabricated references to purchases</div>
        <div style={{ paddingLeft: 28 }}><span style={{ color: palette.todo }}>- </span>Guilt-trip "we noticed you left us" language</div>
        <div style={{ paddingLeft: 28 }}><span style={{ color: palette.todo }}>- </span>Emojis in subject line</div>
        <div style={{ color: palette.dim }}>---</div>
        <div style={{ marginTop: 12 }}>## Strategy</div>
        <div style={{ color: palette.dim }}>Opener specificity drives 64% of reopens (brain/research/email-marketing/opener-patterns.md).</div>
      </div>
    </div>
  );
}

function LayerCard({ n, title, sub, body, accent, palette, t }) {
  return (
    <div style={{ background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 12, padding: '26px 26px', position: 'relative' }}>
      <div style={{ fontFamily: t.mono, fontSize: 11, color: accent, letterSpacing: 1.5, marginBottom: 20 }}>{n}</div>
      <div style={{ fontFamily: t.display, fontSize: 26, fontWeight: 600, marginBottom: 4, letterSpacing: -0.5 }}>{title}</div>
      <div style={{ fontFamily: t.mono, fontSize: 11, color: palette.dim, marginBottom: 16, letterSpacing: 1.2, textTransform: 'uppercase' }}>{sub}</div>
      <div style={{ fontSize: 14, color: palette.dim, lineHeight: 1.6 }}>{body}</div>
    </div>
  );
}

function TreeCallout({ title, body, accent, palette, t }) {
  return (
    <div style={{ padding: '16px 18px', background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 10 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: palette.fg, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: accent }} />
        {title}
      </div>
      <div style={{ fontSize: 13, color: palette.dim, lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}

function SoftStep({ n, title, cmd, note, accent, palette, t }) {
  return (
    <div style={{ padding: '24px 26px', background: palette.card, border: `1px solid ${palette.border}`, borderRadius: 12 }}>
      <div style={{ fontFamily: t.mono, fontSize: 11, color: accent, letterSpacing: 1.5, marginBottom: 14 }}>STEP {n}</div>
      <div style={{ fontFamily: t.display, fontSize: 20, fontWeight: 600, marginBottom: 14, letterSpacing: -0.3 }}>{title}</div>
      <div style={{ padding: '10px 12px', background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 6, fontFamily: t.mono, fontSize: 12, marginBottom: 12 }}>
        <span style={{ color: accent }}>$ </span>{cmd}
      </div>
      <div style={{ fontSize: 13, color: palette.dim, lineHeight: 1.55 }}>{note}</div>
    </div>
  );
}

Object.assign(window, { VariantLinear });
