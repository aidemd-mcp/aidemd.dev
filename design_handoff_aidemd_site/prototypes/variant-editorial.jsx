// Variant A — Editorial technical.
// Big serif display type, generous whitespace, technical details in mono.
// Feels like a publication; intent tree as the hero artifact.

function VariantEditorial({ tweaks }) {
  const accent = tweaks.accent;
  const t = typeStack(tweaks.typePairing === 'editorial' ? 'editorial' : tweaks.typePairing);

  const palette = {
    bg: '#f6f2ea',
    card: '#fbf8f1',
    fg: '#1a1410',
    dim: 'rgba(26,20,16,0.55)',
    border: 'rgba(26,20,16,0.1)',
    hover: 'rgba(26,20,16,0.04)',
    terminal: '#15110c',
    plan: '#6b8ab8',
    todo: '#c7a04a',
    code: 'rgba(26,20,16,0.4)',
    deep: true,
  };

  return (
    <div style={{ background: palette.bg, color: palette.fg, fontFamily: t.sans, width: '100%', height: '100%', overflow: 'auto', position: 'relative' }}>
      {/* NAV */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 64px', borderBottom: `1px solid ${palette.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: t.mono, fontSize: 13, fontWeight: 600 }}>
          <span style={{ display: 'inline-block', width: 10, height: 10, background: accent, borderRadius: 2, transform: 'rotate(45deg)' }} />
          <span>AIDEMD<span style={{ color: accent }}>.DEV</span></span>
        </div>
        <div style={{ display: 'flex', gap: 28, fontFamily: t.mono, fontSize: 13, color: palette.dim }}>
          <a style={linkStyle(palette)}>docs</a>
          <a style={linkStyle(palette)}>pipeline</a>
          <a style={linkStyle(palette)}>the brain</a>
          <a style={linkStyle(palette)}>install</a>
          <a style={linkStyle(palette)}>github ↗</a>
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: '80px 64px 40px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: t.mono, fontSize: 12, color: accent, letterSpacing: 2, marginBottom: 20 }}>AUTONOMOUS INTENT-DRIVEN ENGINEERING</div>
          <h1 style={{ fontFamily: t.display, fontWeight: 400, fontSize: 78, lineHeight: 1.02, margin: 0, letterSpacing: -1.5 }}>
            Stop reviewing code.<br />
            Start <em style={{ color: accent, fontStyle: 'italic' }}>describing intent.</em>
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.55, marginTop: 28, color: 'rgba(26,20,16,0.75)', maxWidth: 560 }}>
            AIDE is a spec-first framework for agentic development. A pipeline of specialized agents — spec writer, domain expert, strategist, architect, implementor, QA — converts your intent into code you never have to read. Heavier than OpenSpec. More opinionated. More hands-off.
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 12, alignItems: 'center' }}>
            <InstallBlock accent={accent} palette={palette} mono={t.mono} />
          </div>
          <div style={{ marginTop: 28, display: 'flex', gap: 24, fontFamily: t.mono, fontSize: 12, color: palette.dim }}>
            <span>· works with Claude Code</span>
            <span>· MCP-native</span>
            <span>· Obsidian vault as the brain</span>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: t.mono, fontSize: 11, color: palette.dim, letterSpacing: 1.5, marginBottom: 10 }}>THE CONTRACT</div>
          <AideSpecCard accent={accent} palette={palette} mono={t.mono} />
        </div>
      </div>

      {/* MANIFESTO STRIP */}
      <div style={{ padding: '40px 64px 60px', borderTop: `1px solid ${palette.border}`, borderBottom: `1px solid ${palette.border}`, background: palette.card }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          <ManifestoCell n="01" title="The brain holds durable knowledge" body="External to the project — an Obsidian vault, an MCP store. Domain research and your coding playbook, filled once and reused across every project." accent={accent} palette={palette} t={t} />
          <ManifestoCell n="02" title="The .aide file holds the intent" body="A short structured brief next to the orchestrator it governs. Scope, intent, outcomes desired, outcomes undesired. No code." accent={accent} palette={palette} t={t} />
          <ManifestoCell n="03" title="The code holds itself" body="Ephemeral. If the intent changes, the code changes. The spec persists; the code is its current expression." accent={accent} palette={palette} t={t} />
        </div>
      </div>

      {/* PIPELINE */}
      <div style={{ padding: '80px 64px 60px' }}>
        <SectionHeader eyebrow="HOW IT WORKS" title="Six agents. One pipeline. No humans in the middle." t={t} accent={accent} palette={palette} />
        <div style={{ fontSize: 16, color: palette.dim, marginTop: 10, marginBottom: 40, maxWidth: 720, lineHeight: 1.55 }}>
          Each stage runs in a fresh context — no agent carries conversation from the last. Handoff is via files: <code style={{ fontFamily: t.mono, color: accent }}>.aide</code>, <code style={{ fontFamily: t.mono, color: accent }}>plan.aide</code>, <code style={{ fontFamily: t.mono, color: accent }}>todo.aide</code>, brain notes. Pick any stage below to see what it reads and what it writes.
        </div>
        <Pipeline accent={accent} palette={palette} mono={t.mono} sans={t.sans} />
      </div>

      {/* INTENT TREE */}
      <div style={{ padding: '40px 64px 60px', background: palette.card, borderTop: `1px solid ${palette.border}` }}>
        <SectionHeader eyebrow="THE INTENT TREE" title="Your app becomes a queryable knowledgebase." t={t} accent={accent} palette={palette} />
        <div style={{ fontSize: 16, color: palette.dim, marginTop: 10, marginBottom: 32, maxWidth: 720, lineHeight: 1.55 }}>
          A cascading hierarchy of .aide specs, rooted at the project level. Each child narrows the intent of its parent. Agents walk from root to leaf before judging whether a module's output is valid. Click any node to expand — click a <strong style={{ color: accent }}>◆ .aide</strong> to see its frontmatter.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 28, alignItems: 'start' }}>
          <div>
            <IntentTree accent={accent} palette={palette} mono={t.mono} roots={[INTENT_TREE, SRC_TREE]} />
          </div>
          <div style={{ position: 'sticky', top: 20 }}>
            <div style={{ fontFamily: t.mono, fontSize: 11, color: palette.dim, letterSpacing: 1.5, marginBottom: 10 }}>WHY IT MATTERS</div>
            <div style={{ fontFamily: t.display, fontSize: 28, lineHeight: 1.15, marginBottom: 18, fontWeight: 400 }}>
              Local validity is necessary but not sufficient.
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: palette.dim }}>
              A submodule whose local output satisfies its own outcomes but violates a parent's intent is wrong in the context of the whole application. Walking the intent tree is how the QA agent catches it.
            </p>
            <div style={{ marginTop: 20, padding: 16, background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 6 }}>
              <div style={{ fontFamily: t.mono, fontSize: 11, color: palette.dim, marginBottom: 8 }}>MCP TOOLS AVAILABLE TO YOUR AGENT</div>
              <div style={{ fontFamily: t.mono, fontSize: 13, lineHeight: 1.9 }}>
                <div><span style={{ color: accent }}>aide_discover</span> <span style={{ color: palette.dim }}>— walk ancestor chain</span></div>
                <div><span style={{ color: accent }}>aide_scaffold</span> <span style={{ color: palette.dim }}>— create intent/plan/todo</span></div>
                <div><span style={{ color: accent }}>aide_validate</span> <span style={{ color: palette.dim }}>— check frontmatter</span></div>
                <div><span style={{ color: accent }}>brain_read</span> <span style={{ color: palette.dim }}>— load notes by path</span></div>
                <div><span style={{ color: accent }}>brain_write</span> <span style={{ color: palette.dim }}>— persist research</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BRAIN */}
      <div style={{ padding: '80px 64px 60px' }}>
        <SectionHeader eyebrow="THE BRAIN" title="An Obsidian vault with two rooms." t={t} accent={accent} palette={palette} />
        <div style={{ fontSize: 16, color: palette.dim, marginTop: 10, marginBottom: 32, maxWidth: 720, lineHeight: 1.55 }}>
          <strong style={{ color: palette.fg }}>research/</strong> enriches your projects with domain expertise. <strong style={{ color: palette.fg }}>coding-playbook/</strong> teaches the agent to code like you. Fill it once — reuse it across every project you touch.
        </div>
        <VaultBlock accent={accent} palette={palette} mono={t.mono} sans={t.sans} />
      </div>

      {/* CLI DEMO */}
      <div style={{ padding: '40px 64px 60px', background: palette.card, borderTop: `1px solid ${palette.border}` }}>
        <SectionHeader eyebrow="A TYPICAL SESSION" title="One command. Six agents. Zero code review." t={t} accent={accent} palette={palette} />
        <div style={{ fontSize: 16, color: palette.dim, marginTop: 10, marginBottom: 32, maxWidth: 720, lineHeight: 1.55 }}>
          You describe the module. The orchestrator runs the pipeline. Every handoff is a file you can inspect. Approval gates exist where they matter — spec frontmatter, and the architect's plan.
        </div>
        <CLIDemo accent={accent} palette={palette} mono={t.mono} />
      </div>

      {/* QUICKSTART */}
      <div style={{ padding: '80px 64px 60px' }}>
        <SectionHeader eyebrow="QUICKSTART" title="Three commands." t={t} accent={accent} palette={palette} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
          <QuickstepCard n="1" title="Install the MCP server" cmd="npx @aidemd-mcp/server@latest init" note="Scaffolds .aide/ and connects your Obsidian vault." accent={accent} palette={palette} t={t} />
          <QuickstepCard n="2" title="Fill the brain" cmd="/aide:research email-marketing" note="Or drop your own notes into the vault. Both work." accent={accent} palette={palette} t={t} />
          <QuickstepCard n="3" title="Run the pipeline" cmd="/aide" note="Interview → spec → research → synthesize → plan → build → qa." accent={accent} palette={palette} t={t} />
        </div>
      </div>

      {/* COMPARISON */}
      <div style={{ padding: '40px 64px 80px', background: palette.card, borderTop: `1px solid ${palette.border}` }}>
        <SectionHeader eyebrow="AIDE vs. SPEC-FIRST ALTERNATIVES" title="Heavier. More opinionated. More hands-off." t={t} accent={accent} palette={palette} />
        <ComparisonTable accent={accent} palette={palette} t={t} />
      </div>

      {/* FOOTER */}
      <div style={{ padding: '40px 64px 60px', borderTop: `1px solid ${palette.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: t.mono, fontSize: 12, color: palette.dim }}>
        <div>© 2026 TetsuKodai Group LLC</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a style={linkStyle(palette)}>github ↗</a>
          <a style={linkStyle(palette)}>npm ↗</a>
          <a style={linkStyle(palette)}>waitlist</a>
          <a style={linkStyle(palette)}>privacy</a>
        </div>
      </div>

      <AideyGuide accent={accent} palette={palette} variant="light" />
    </div>
  );
}

function linkStyle(palette) {
  return { color: 'inherit', textDecoration: 'none', cursor: 'pointer' };
}

function AideSpecCard({ accent, palette, mono }) {
  return (
    <div style={{ background: palette.card, border: `1px solid ${palette.border}`, borderLeft: `3px solid ${accent}`, borderRadius: 8, padding: '20px 22px', fontFamily: mono, fontSize: 13, lineHeight: 1.75, color: palette.fg, boxShadow: '0 18px 50px rgba(40,20,10,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottom: `1px dashed ${palette.border}` }}>
        <span style={{ color: accent, fontWeight: 600 }}>src/service/retention/.aide</span>
        <span style={{ fontSize: 10, color: palette.dim, padding: '2px 6px', background: 'rgba(140,180,100,0.15)', border: `1px solid rgba(140,180,100,0.3)`, borderRadius: 3 }}>aligned</span>
      </div>
      <div style={{ color: palette.dim }}>---</div>
      <div><span style={{ color: palette.dim }}>scope:</span> src/service/retention</div>
      <div><span style={{ color: palette.dim }}>description:</span> lapsed-customer retention emails</div>
      <div><span style={{ color: palette.dim }}>intent: </span>{'>'}</div>
      <div style={{ paddingLeft: 12, color: palette.fg }}>Bring lapsed customers back by referencing something they actually did — not a templated "we miss you".</div>
      <div style={{ color: palette.dim }}>outcomes:</div>
      <div style={{ paddingLeft: 12, color: palette.dim }}>desired:</div>
      <div style={{ paddingLeft: 24 }}><span style={{ color: accent }}>- </span>Opens with a factual order-history reference</div>
      <div style={{ paddingLeft: 24 }}><span style={{ color: accent }}>- </span>Body under 80 words</div>
      <div style={{ paddingLeft: 24 }}><span style={{ color: accent }}>- </span>CTA is a single link, not a button array</div>
      <div style={{ paddingLeft: 12, color: palette.dim }}>undesired:</div>
      <div style={{ paddingLeft: 24 }}><span style={{ color: '#c7a04a' }}>- </span>Fabricated references to purchases</div>
      <div style={{ paddingLeft: 24 }}><span style={{ color: '#c7a04a' }}>- </span>Guilt-trip "we noticed you left us" language</div>
      <div style={{ paddingLeft: 24 }}><span style={{ color: '#c7a04a' }}>- </span>Emojis in subject line</div>
      <div style={{ color: palette.dim }}>---</div>
    </div>
  );
}

function ManifestoCell({ n, title, body, accent, palette, t }) {
  return (
    <div>
      <div style={{ fontFamily: t.mono, fontSize: 11, color: accent, letterSpacing: 1.5, marginBottom: 10 }}>{n}</div>
      <div style={{ fontFamily: t.display, fontSize: 22, lineHeight: 1.2, marginBottom: 10, fontWeight: 500 }}>{title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: palette.dim }}>{body}</div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, t, accent, palette }) {
  return (
    <div>
      <div style={{ fontFamily: t.mono, fontSize: 11, color: accent, letterSpacing: 2, marginBottom: 10 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: t.display, fontSize: 44, fontWeight: 400, margin: 0, letterSpacing: -0.6, lineHeight: 1.1 }}>{title}</h2>
    </div>
  );
}

function InstallBlock({ accent, palette, mono }) {
  const [copied, setCopied] = React.useState(false);
  const cmd = 'npx @aidemd-mcp/server@latest init';
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
      <div
        onClick={() => { navigator.clipboard?.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        style={{ padding: '12px 16px', background: palette.card, border: `1px solid ${palette.border}`, borderRadius: 6, fontFamily: mono, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <span style={{ color: accent }}>$</span>
        <span>{cmd}</span>
        <span style={{ color: palette.dim, fontSize: 11, marginLeft: 4 }}>{copied ? '✓' : '⧉'}</span>
      </div>
      <button style={{ padding: '12px 22px', background: accent, color: '#fff', border: 'none', borderRadius: 6, fontFamily: mono, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        read the spec →
      </button>
    </div>
  );
}

function QuickstepCard({ n, title, cmd, note, accent, palette, t }) {
  return (
    <div style={{ padding: '20px 22px', background: palette.card, border: `1px solid ${palette.border}`, borderRadius: 8 }}>
      <div style={{ fontFamily: t.mono, fontSize: 11, color: accent, letterSpacing: 1.5, marginBottom: 10 }}>STEP {n}</div>
      <div style={{ fontFamily: t.display, fontSize: 22, fontWeight: 500, marginBottom: 12 }}>{title}</div>
      <div style={{ padding: '10px 12px', background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 4, fontFamily: t.mono, fontSize: 12, marginBottom: 10, color: palette.fg }}>
        <span style={{ color: accent }}>$ </span>{cmd}
      </div>
      <div style={{ fontSize: 13, color: palette.dim, lineHeight: 1.5 }}>{note}</div>
    </div>
  );
}

function ComparisonTable({ accent, palette, t }) {
  const rows = [
    ['Primary artifact', '.aide (intent + outcomes)', 'spec.md (proposal + tasks)'],
    ['Review model', 'approve at 2 gates: spec + plan', 'review every proposal'],
    ['Agent pipeline', '6 specialized agents', '1 generalist'],
    ['Durable knowledge', 'external brain (vault/MCP)', 'in-repo markdown'],
    ['Domain expertise', 'automated research agent', 'you supply it'],
    ['QA loop', 'intent-tree walk + todo.aide', 'manual review'],
    ['Opinions per kg', 'heavy', 'light'],
  ];
  return (
    <div style={{ marginTop: 32, border: `1px solid ${palette.border}`, borderRadius: 8, overflow: 'hidden', background: palette.bg }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', padding: '14px 24px', background: palette.card, borderBottom: `1px solid ${palette.border}`, fontFamily: t.mono, fontSize: 11, letterSpacing: 1.5, color: palette.dim }}>
        <div>DIMENSION</div>
        <div style={{ color: accent }}>AIDE</div>
        <div>OpenSpec</div>
      </div>
      {rows.map(([k, a, b], i) => (
        <div key={k} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', padding: '14px 24px', borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${palette.border}`, fontSize: 14, alignItems: 'center' }}>
          <div style={{ color: palette.dim, fontFamily: t.mono, fontSize: 12 }}>{k}</div>
          <div style={{ color: palette.fg, fontWeight: 500 }}>{a}</div>
          <div style={{ color: palette.dim }}>{b}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { VariantEditorial });
