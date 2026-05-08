// Variant B · Reference + Cookbook — three-pane: rail, main, sticky generator.

function BrainVariantCookbook() {
  const p = BRAIN_PAL;
  const accent = p.accent;
  const [recipe, setRecipe] = React.useState('quickstart');

  const recipes = [
    { id: 'quickstart', label: '01 · quickstart', subtitle: 'install + wire obsidian' },
    { id: 'flow',       label: '02 · the config flow', subtitle: 'wiring vs. seeding' },
    { id: 'states',     label: '03 · boot states', subtitle: 'the four reporter codes' },
    { id: 'mcp',        label: '04 · mcp surface', subtitle: 'what your server exposes' },
    { id: 'orient',     label: '05 · writing orientation', subtitle: 'the runtime briefing' },
    { id: 'configsec',  label: '06 · writing aide-config', subtitle: 'wiring + seeding script' },
    { id: 'fs',         label: '07 · recipe: filesystem', subtitle: 'minimum-viable brain' },
    { id: 'notion',     label: '08 · recipe: notion', subtitle: 'two-slot worked example' },
  ];

  return (
    <div style={{ background: p.bg, color: p.fg, fontFamily: p.mono, width: '100%', minHeight: '100%' }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: p.card, borderBottom: `1px solid ${p.border}`, position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c93f' }} />
        <span style={{ marginLeft: 18, fontSize: 13, fontWeight: 600 }}>
          <span style={{ color: accent }}>$</span> aidemd.dev<span style={{ color: p.dim }}>/brain</span>
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: p.dim, display: 'flex', gap: 20 }}>
          <span>home</span><span>docs</span><span>github ↗</span>
        </span>
      </div>

      {/* hero strip */}
      <div style={{ padding: '36px 36px 28px', borderBottom: `1px solid ${p.border}` }}>
        <div style={{ fontSize: 11, color: accent, letterSpacing: 2, marginBottom: 10 }}># brain.aide cookbook</div>
        <h1 style={{ fontSize: 38, margin: 0, fontWeight: 500, lineHeight: 1.1, letterSpacing: -0.5 }}>
          recipes for the <span style={{ color: accent }}>brain</span> plugin interface.
        </h1>
        <div style={{ fontSize: 13, color: p.dim, marginTop: 12, maxWidth: 760, lineHeight: 1.65 }}>
          # pick a recipe from the rail. each one stands alone — no need to read top-to-bottom.<br />
          # the skeleton generator on the right stays sticky so you can experiment as you read.
        </div>
      </div>

      {/* three columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 380px', minHeight: 600 }}>
        {/* RAIL */}
        <aside style={{ borderRight: `1px solid ${p.border}`, padding: '20px 0' }}>
          {recipes.map((r) => {
            const active = r.id === recipe;
            return (
              <button key={r.id} onClick={() => setRecipe(r.id)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 22px',
                background: active ? 'rgba(61,107,74,0.12)' : 'transparent',
                borderLeft: `2px solid ${active ? accent : 'transparent'}`,
                border: 'none',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <div style={{ fontSize: 12.5, color: active ? accent : p.fg, marginBottom: 2 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: p.dim }}>{r.subtitle}</div>
              </button>
            );
          })}

          <div style={{ margin: '24px 22px 0', padding: 14, background: p.card, border: `1px solid ${p.border}`, borderRadius: 4 }}>
            <div style={{ fontSize: 10, color: p.dim, letterSpacing: 1.2, marginBottom: 8 }}>RELATED</div>
            <a href="docs-brain-aide.html" style={{ display: 'block', fontSize: 12, color: accent, marginBottom: 6, textDecoration: 'none' }}>docs / brain-aide.md →</a>
            <a href="docs.html" style={{ display: 'block', fontSize: 12, color: p.fg, textDecoration: 'none' }}>all canonical docs →</a>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ padding: '28px 36px 60px' }}>
          <RecipeBody id={recipe} accent={accent} />
        </main>

        {/* STICKY GENERATOR */}
        <aside style={{ borderLeft: `1px solid ${p.border}`, padding: '24px 24px 40px' }}>
          <div style={{ fontSize: 11, color: p.dim, letterSpacing: 1.5, marginBottom: 10 }}>STICKY · LIVE GENERATOR</div>
          <SkeletonCompact accent={accent} />
        </aside>
      </div>

      {/* footer */}
      <div style={{ padding: '24px 36px', borderTop: `1px solid ${p.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: p.dim2 }}>
        <div>© 2026 TetsuKodai Group LLC · <span style={{ color: accent }}>●</span> brain plugin interface</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <span>github ↗</span><span>npm ↗</span><span>discuss</span>
        </div>
      </div>
    </div>
  );
}

// ────────── recipe bodies ──────────
function RecipeBody({ id, accent }) {
  const p = BRAIN_PAL;
  const wrap = (title, sub, body) => (
    <div>
      <div style={{ fontSize: 11, color: p.dim, letterSpacing: 1.5, marginBottom: 6 }}>RECIPE</div>
      <h2 style={{ fontSize: 26, fontWeight: 600, margin: '0 0 8px', letterSpacing: -0.3 }}>{title}</h2>
      <div style={{ fontSize: 13, color: p.dim, lineHeight: 1.65, marginBottom: 22, maxWidth: 720 }}>{sub}</div>
      {body}
    </div>
  );

  if (id === 'quickstart') {
    return wrap('quickstart', 'Wire the bundled Obsidian default in three commands. Total time: under two minutes if you already have a vault.',
      <div>
        <Step n="1" what="install + scaffold" body={<>
          <CmdLine cmd="npx aidemd-mcp init" accent={accent} />
          <P>Creates <C>.aide/</C> and pre-fills <C>.aide/config/brain.aide</C> with the obsidian template. The args list lands with one <span style={{ color: p.warn }}>YAML null</span> — that's the vault path slot.</P>
        </>} />
        <Step n="2" what="wire the slot" body={<>
          <CmdLine cmd="/aide:brain config" accent={accent} />
          <P>Inside Claude Code. AIDE asks for your vault path, edits <C>brain.aide</C>, runs sync, and tells you to restart. Sync is what actually writes the brain entry into <C>.mcp.json</C>.</P>
        </>} />
        <Step n="3" what="restart, then seed" body={<>
          <P>After restart, run <C>/aide:brain config</C> a second time. This time the args list has a string, so the seeding flow runs — it presence-checks the four entry-point artifacts and writes any that are missing.</P>
        </>} />
        <div style={{ marginTop: 18, padding: '12px 14px', background: p.card, border: `1px solid ${p.border}`, borderLeft: `2px solid ${p.good}`, borderRadius: 4, fontSize: 12.5 }}>
          <span style={{ color: p.good }}>✓</span> brain ready. boot reporter shows <span style={{ color: p.good }}>ok</span>; the orchestrator advances; <C>/aide</C> works.
        </div>
      </div>
    );
  }

  if (id === 'flow') {
    return wrap('the config flow', 'One command, two paths. The path that runs is determined by what your args list contains — never by anything you pass.', <ConfigFlow accent={accent} />);
  }

  if (id === 'states') {
    return wrap('boot states', 'At session start the orchestrator reads brain.aide and .mcp.json and surfaces one of four states.', <BootStates accent={accent} />);
  }

  if (id === 'mcp') {
    return wrap('mcp surface', 'Your server defines its own tool names. AIDE never branches on names — it reads your orientation section to learn them. The shape below is what most brains end up exposing.',
      <div style={{ background: p.card, border: `1px solid ${p.border}`, borderRadius: 6 }}>
        <MCPToolSurface accent={accent} />
      </div>
    );
  }

  if (id === 'orient') {
    return wrap('writing aide-orientation', 'A runtime briefing returned verbatim by aide_brain. Agents read it before every brain-touching task. Keep it tight.',
      <div>
        <P>Three jobs:</P>
        <Bullet>Name the MCP tools the agent should call (read, list, search, write).</Bullet>
        <Bullet>List the four entry-point artifacts and where they live.</Bullet>
        <Bullet>Set scope rules — "stay inside this root", "don't follow links into unrelated topics".</Bullet>
        <CodePre label="aide-orientation (good)" code={`Your brain is a Notion workspace. Use mcp__brain__read_page by ID or
slug; mcp__brain__search for keyword queries; mcp__brain__list_children
to enumerate.

Entry-point artifacts:
  - coding-playbook/coding-playbook
  - coding-playbook/study-playbook
  - coding-playbook/update-playbook
  - research/research

Stay inside the configured root page. Don't traverse upward.`} />
        <P style={{ marginTop: 14 }}>Things <em>not</em> to put here:</P>
        <Bullet>How to wire the brain (that's <C>aide-config</C>).</Bullet>
        <Bullet>The bytes for the entry-point artifacts (those are the seed sections).</Bullet>
        <Bullet>Domain knowledge or playbook content (lives inside the brain after seeding).</Bullet>
      </div>
    );
  }

  if (id === 'configsec') {
    return wrap('writing aide-config', 'The script /aide:brain config executes verbatim. It branches on what the args list contains — never on what the user passed.',
      <div>
        <P>Five required moves, in order:</P>
        <Bullet>Read <C>brain.aide</C> and quote the unwired-slot value(s) explicitly.</Bullet>
        <Bullet>Branch: any null → WIRING flow. All strings → SEEDING flow.</Bullet>
        <Bullet>WIRING: ask the user for missing values, edit <C>brain.aide</C>, run sync, STOP and emit a restart message.</Bullet>
        <Bullet>SEEDING: verify your MCP tools are loaded (else STOP), then for each entry-point artifact, presence-check and write-if-missing.</Bullet>
        <Bullet>Never fall back to native filesystem tools. Other backends have no local filesystem.</Bullet>
        <CodePre label="aide-config (skeleton)" code={`You are completing the wiring of a <NAME> brain.
Required: <list of unwired slot values>.

1. Read brain.aide and quote args[<N>].
2. If null → WIRING:
     - ask user for value (offer hints)
     - edit brain.aide
     - run sync
     - emit "restart Claude Code" and STOP
3. If string → SEEDING:
     - verify mcp__brain__* tools are loaded (else STOP)
     - presence-check each entry-point artifact via list tool
     - write any missing artifact via write tool, body = seed-section bytes
     - emit completion summary`} />
      </div>
    );
  }

  if (id === 'fs') {
    return wrap('recipe: filesystem brain', 'A flat folder of markdown files, served over MCP. The simplest brain you can build — useful as a learning reference and for solo developers.',
      <RecipeWorked tools="mcp__brain__read_file · mcp__brain__list_dir · mcp__brain__write_file · mcp__brain__grep"
        slot="args[1] = absolute path to brain root folder"
        wiring='ask the user for the path. offer to mkdir if absent. write into args[1]. sync. STOP.'
        seeding='for each artifact: list_dir its directory, then write_file if missing.' accent={accent} />
    );
  }

  if (id === 'notion') {
    return wrap('recipe: notion brain', 'Two unwired slots: an integration token and a root page ID. Demonstrates how to handle multi-slot configs and non-file backing stores.',
      <RecipeWorked tools="mcp__brain__read_page · mcp__brain__list_children · mcp__brain__create_page · mcp__brain__search"
        slot={'args[2] = integration token  ·  args[4] = root page ID'}
        wiring='ask for token (link to https://www.notion.so/my-integrations) and root page ID. land both. sync. STOP.'
        seeding='create coding-playbook + research as nested pages under the root, then create their entry-point pages with seed-section bytes as body.'
        accent={accent} />
    );
  }
  return null;
}

// recipe text helpers
function P({ children, style }) {
  return <p style={{ fontSize: 13, color: BRAIN_PAL.fg, lineHeight: 1.7, margin: '0 0 12px', ...(style || {}) }}>{children}</p>;
}
function Bullet({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '14px 1fr', gap: 8, fontSize: 13, color: BRAIN_PAL.fg, lineHeight: 1.65, margin: '4px 0' }}>
      <span style={{ color: BRAIN_PAL.accent }}>·</span><span>{children}</span>
    </div>
  );
}
function C({ children }) {
  return <code style={{ fontFamily: 'inherit', fontSize: 12.5, padding: '1px 6px', background: 'rgba(232,223,206,0.06)', border: `1px solid ${BRAIN_PAL.border}`, borderRadius: 3, color: BRAIN_PAL.accent }}>{children}</code>;
}
function Step({ n, what, body }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 14, marginBottom: 18 }}>
      <div style={{ fontSize: 12, color: BRAIN_PAL.accent, fontFamily: BRAIN_PAL.mono }}>step {n}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: BRAIN_PAL.fg, marginBottom: 8 }}>{what}</div>
        {body}
      </div>
    </div>
  );
}

function RecipeWorked({ tools, slot, wiring, seeding, accent }) {
  const p = BRAIN_PAL;
  return (
    <div>
      <div style={{ fontSize: 11, color: p.dim, letterSpacing: 1, marginBottom: 4 }}>MCP TOOLS EXPOSED</div>
      <div style={{ fontSize: 12, color: accent, marginBottom: 18, fontFamily: p.mono }}>{tools}</div>

      <div style={{ fontSize: 11, color: p.dim, letterSpacing: 1, marginBottom: 4 }}>UNWIRED SLOT(S)</div>
      <div style={{ fontSize: 13, color: p.fg, marginBottom: 18, padding: '8px 12px', background: p.card, border: `1px solid ${p.border}`, borderRadius: 4, fontFamily: p.mono }}>{slot}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: '14px 16px', background: p.card, border: `1px solid ${p.border}`, borderLeft: `2px solid ${accent}`, borderRadius: 4 }}>
          <div style={{ fontSize: 11, color: accent, letterSpacing: 1.2, marginBottom: 8 }}>WIRING</div>
          <div style={{ fontSize: 12.5, color: p.fg, lineHeight: 1.7 }}>{wiring}</div>
        </div>
        <div style={{ padding: '14px 16px', background: p.card, border: `1px solid ${p.border}`, borderLeft: `2px solid ${accent}`, borderRadius: 4 }}>
          <div style={{ fontSize: 11, color: accent, letterSpacing: 1.2, marginBottom: 8 }}>SEEDING</div>
          <div style={{ fontSize: 12.5, color: p.fg, lineHeight: 1.7 }}>{seeding}</div>
        </div>
      </div>
    </div>
  );
}

// compact generator for the sticky pane
function SkeletonCompact({ accent }) {
  const p = BRAIN_PAL;
  const [backend, setBackend] = React.useState('obsidian');
  const preset = BACKEND_PRESETS[backend];
  const argsBlock = preset.argLines.map((l) => {
    const isNull = l.startsWith('~');
    return isNull ? '    -' : `    - ${l}`;
  }).join('\n');
  const file = `---
name: ${preset.name}
mcpServerConfig:
  command: ${preset.command}
  args:
${argsBlock}
---

<!-- aide-orientation-start -->
${preset.orientation.trim()}
<!-- aide-orientation-end -->

<!-- aide-config-start -->
${preset.config.trim()}
<!-- aide-config-end -->

(... four seed sections ...)`;
  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {Object.keys(BACKEND_PRESETS).map((k) => (
          <button key={k} onClick={() => setBackend(k)}
            style={{
              flex: 1, padding: '6px 8px', fontFamily: p.mono, fontSize: 11,
              background: backend === k ? accent : 'transparent',
              color: backend === k ? '#0d0b08' : p.fg,
              border: `1px solid ${backend === k ? accent : p.border}`,
              borderRadius: 4, cursor: 'pointer',
            }}>{k}</button>
        ))}
      </div>
      <div style={{ fontSize: 10, color: p.dim, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
        <span>brain.aide preview</span>
        <CopyChip text={file} accent={accent} />
      </div>
      <pre style={{
        margin: 0, padding: '10px 12px', background: p.cardDeep,
        border: `1px solid ${p.border}`, borderRadius: 4,
        fontSize: 10.5, lineHeight: 1.55, color: p.fg,
        maxHeight: 480, overflow: 'auto', whiteSpace: 'pre',
      }}>{file}</pre>
    </div>
  );
}

Object.assign(window, { BrainVariantCookbook });
