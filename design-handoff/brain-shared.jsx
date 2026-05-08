// Shared primitives for the brain.aide guide page.

const BRAIN_PAL = {
  bg: '#0d0b08',
  card: '#16120d',
  cardDeep: '#0a0906',
  fg: '#e8dfce',
  dim: 'rgba(232,223,206,0.55)',
  dim2: 'rgba(232,223,206,0.38)',
  border: 'rgba(232,223,206,0.12)',
  hover: 'rgba(232,223,206,0.05)',
  accent: '#3d6b4a',
  accent2: '#7aa6d6',
  warn: '#d6b25a',
  bad: '#c25a3a',
  good: '#8cbe5a',
  mono: '"JetBrains Mono", monospace',
};

// ────────── small atoms ──────────
function CopyChip({ text, label, accent = BRAIN_PAL.accent }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <span
      onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      style={{ cursor: 'pointer', fontSize: 11, color: copied ? accent : BRAIN_PAL.dim, userSelect: 'none' }}
    >{copied ? '✓ copied' : (label || '⧉ copy')}</span>
  );
}

function CmdLine({ cmd, accent = BRAIN_PAL.accent }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div
      onClick={() => { navigator.clipboard?.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      style={{
        padding: '12px 14px', background: BRAIN_PAL.card, border: `1px solid ${BRAIN_PAL.border}`,
        borderLeft: `2px solid ${accent}`, borderRadius: 4, fontSize: 13, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10, fontFamily: BRAIN_PAL.mono, color: BRAIN_PAL.fg,
      }}
    >
      <span style={{ color: accent }}>$</span>
      <span style={{ flex: 1 }}>{cmd}</span>
      <span style={{ color: copied ? accent : BRAIN_PAL.dim, fontSize: 11 }}>{copied ? '✓' : '⧉'}</span>
    </div>
  );
}

function CodePre({ code, label, accent = BRAIN_PAL.accent, maxHeight }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div style={{ margin: '10px 0', border: `1px solid ${BRAIN_PAL.border}`, borderRadius: 6, overflow: 'hidden', background: BRAIN_PAL.cardDeep }}>
      {label && (
        <div style={{ padding: '8px 12px', borderBottom: `1px solid ${BRAIN_PAL.border}`, fontSize: 11, color: BRAIN_PAL.dim, display: 'flex', justifyContent: 'space-between', background: BRAIN_PAL.card, fontFamily: BRAIN_PAL.mono }}>
          <span>{label}</span>
          <span onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); }} style={{ cursor: 'pointer', color: copied ? accent : BRAIN_PAL.dim }}>{copied ? '✓ copied' : 'copy'}</span>
        </div>
      )}
      <pre style={{ margin: 0, padding: '14px 16px', fontSize: 12.5, lineHeight: 1.65, overflow: 'auto', maxHeight, color: BRAIN_PAL.fg, whiteSpace: 'pre', fontFamily: BRAIN_PAL.mono }}>{code}</pre>
    </div>
  );
}

// ────────── live skeleton generator ──────────
const BACKEND_PRESETS = {
  obsidian: {
    name: 'obsidian',
    command: 'npx',
    argLines: [
      '"@bitbonsai/mcpvault"',
      '~  // ← absolute path to your vault',
    ],
    orientation: `Your brain is an Obsidian-backed knowledge store. Use \`mcp__brain__read_note\`
to open files by their brain-relative path. Use \`mcp__brain__search_notes\`
for keyword queries across every note in the store.

The store has four entry-point artifacts:
  - \`coding-playbook/coding-playbook.md\`
  - \`coding-playbook/study-playbook.md\`
  - \`coding-playbook/update-playbook.md\`
  - \`research/research.md\`

Start from the relevant entry-point for your task, follow references it lists
to deepen context, and stay in scope.`,
    config: `You are completing the wiring of an Obsidian brain. The required value is
the absolute path to the user's Obsidian vault, to be placed at the last
entry of \`mcpServerConfig.args\`.

Steps:
1. Read brain.aide and quote the last entry of args.
2. If YAML null → WIRING flow: ask for vault path, edit brain.aide, run sync, STOP.
3. If string path → SEEDING flow: write each entry-point artifact via
   \`mcp__brain__write_note\` from the seed-section bytes.`,
  },
  filesystem: {
    name: 'filesystem',
    command: 'npx',
    argLines: [
      '"@example/fs-brain-mcp"',
      '~  // ← absolute path to the brain root folder',
    ],
    orientation: `Your brain is a plain-markdown folder on disk. Use \`mcp__brain__read_file\`
to open files by relative path and \`mcp__brain__list_dir\` to enumerate.
Search is grep-based via \`mcp__brain__grep\`.

Entry-point artifacts:
  - \`coding-playbook/coding-playbook.md\`
  - \`coding-playbook/study-playbook.md\`
  - \`coding-playbook/update-playbook.md\`
  - \`research/research.md\`

There is no wikilink resolver — cross-references are plain relative paths.`,
    config: `You are completing the wiring of a filesystem brain. The required value
is the absolute path to the brain root folder.

Steps:
1. Read brain.aide and quote the last args entry.
2. If YAML null → WIRING flow: ask for the folder path (offer to mkdir it),
   edit brain.aide, run sync, STOP.
3. If string path → SEEDING flow: write each entry-point artifact via
   \`mcp__brain__write_file\` from the seed-section bytes.`,
  },
  notion: {
    name: 'notion',
    command: 'npx',
    argLines: [
      '"@example/notion-brain-mcp"',
      '"--token"',
      '~  // ← Notion integration token',
      '"--root"',
      '~  // ← root page ID',
    ],
    orientation: `Your brain is a Notion workspace. Use \`mcp__brain__read_page\` to load a
page by ID or relative slug. Use \`mcp__brain__search\` for full-text queries.
Use \`mcp__brain__list_children\` to enumerate a page's subpages.

Entry-point artifacts (created as nested pages under the root):
  - coding-playbook → coding-playbook
  - coding-playbook → study-playbook
  - coding-playbook → update-playbook
  - research → research

Stay inside the configured root page. Do not traverse upward.`,
    config: `You are completing the wiring of a Notion brain. Two values are required:
the integration token and the root page ID.

Steps:
1. Read brain.aide and quote args[2] and args[4].
2. If either is YAML null → WIRING flow: ask for the missing values
   (offer https://www.notion.so/my-integrations as a hint for the token),
   edit brain.aide, run sync, STOP.
3. If both are strings → SEEDING flow: create nested pages via
   \`mcp__brain__create_page\` and write each entry-point artifact's body
   from the seed-section bytes.`,
  },
};

function SkeletonGenerator({ accent = BRAIN_PAL.accent }) {
  const [backend, setBackend] = React.useState('obsidian');
  const [name, setName] = React.useState('obsidian');
  const [overrideOrient, setOverrideOrient] = React.useState(false);
  const [orient, setOrient] = React.useState('');
  const preset = BACKEND_PRESETS[backend];

  React.useEffect(() => {
    setName(BACKEND_PRESETS[backend].name);
    if (!overrideOrient) setOrient(BACKEND_PRESETS[backend].orientation);
  }, [backend]);

  const argsBlock = preset.argLines.map((l) => {
    const isNull = l.startsWith('~');
    const comment = isNull ? l.slice(1).trim() : '';
    return isNull
      ? `    -${comment ? '   ' + comment : ''}`
      : `    - ${l}`;
  }).join('\n');

  const file = `---
name: ${name}
mcpServerConfig:
  command: ${preset.command}
  args:
${argsBlock}
---

<!-- aide-orientation-start -->
${(overrideOrient ? orient : preset.orientation).trim()}
<!-- aide-orientation-end -->

<!-- aide-config-start -->
${preset.config.trim()}
<!-- aide-config-end -->

<!-- aide-playbook-index-start -->
# Coding Playbook
<!-- (your playbook root hub goes here) -->
<!-- aide-playbook-index-end -->

<!-- aide-study-playbook-start -->
# Study Playbook
<!-- (your navigation methodology goes here) -->
<!-- aide-study-playbook-end -->

<!-- aide-update-playbook-start -->
# Update Playbook
<!-- (your maintenance methodology goes here) -->
<!-- aide-update-playbook-end -->

<!-- aide-research-index-start -->
# Research
<!-- (your research index goes here) -->
<!-- aide-research-index-end -->`;

  return (
    <div style={{ background: BRAIN_PAL.card, border: `1px solid ${BRAIN_PAL.border}`, borderRadius: 8, fontFamily: BRAIN_PAL.mono }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BRAIN_PAL.border}`, fontSize: 11, color: accent, letterSpacing: 1.5 }}>
        SKELETON GENERATOR · live
      </div>
      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        {/* controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: BRAIN_PAL.dim, marginBottom: 6 }}>backend</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Object.keys(BACKEND_PRESETS).map((k) => (
                <button key={k} onClick={() => { setBackend(k); setOverrideOrient(false); }}
                  style={{
                    textAlign: 'left', padding: '6px 10px', fontFamily: 'inherit', fontSize: 12,
                    background: backend === k ? accent : 'transparent',
                    color: backend === k ? '#0d0b08' : BRAIN_PAL.fg,
                    border: `1px solid ${backend === k ? accent : BRAIN_PAL.border}`,
                    borderRadius: 4, cursor: 'pointer',
                  }}>{k}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: BRAIN_PAL.dim, marginBottom: 6 }}>name (label)</div>
            <input value={name} onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%', padding: '6px 8px', background: BRAIN_PAL.cardDeep,
                border: `1px solid ${BRAIN_PAL.border}`, borderRadius: 4, color: BRAIN_PAL.fg,
                fontFamily: 'inherit', fontSize: 12,
              }} />
          </div>
          <label style={{ fontSize: 11, color: BRAIN_PAL.dim, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input type="checkbox" checked={overrideOrient} onChange={(e) => { setOverrideOrient(e.target.checked); if (e.target.checked) setOrient(preset.orientation); }} />
            override orientation
          </label>
          {overrideOrient && (
            <textarea value={orient} onChange={(e) => setOrient(e.target.value)} rows={8}
              style={{
                width: '100%', padding: 8, background: BRAIN_PAL.cardDeep,
                border: `1px solid ${BRAIN_PAL.border}`, borderRadius: 4, color: BRAIN_PAL.fg,
                fontFamily: 'inherit', fontSize: 11, resize: 'vertical',
              }} />
          )}
        </div>

        {/* output */}
        <div>
          <div style={{ fontSize: 11, color: BRAIN_PAL.dim, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>.aide/config/brain.aide</span>
            <CopyChip text={file} accent={accent} />
          </div>
          <pre style={{
            margin: 0, padding: '12px 14px', background: BRAIN_PAL.cardDeep,
            border: `1px solid ${BRAIN_PAL.border}`, borderRadius: 4,
            fontSize: 11.5, lineHeight: 1.6, color: BRAIN_PAL.fg,
            maxHeight: 420, overflow: 'auto', whiteSpace: 'pre',
          }}>{file}</pre>
        </div>
      </div>
    </div>
  );
}

// ────────── /aide:brain config flow visualizer ──────────
function ConfigFlow({ accent = BRAIN_PAL.accent }) {
  const [state, setState] = React.useState('null'); // null | string | seeded
  const isWiring = state === 'null';
  const isSeeding = state === 'string';

  return (
    <div style={{ fontFamily: BRAIN_PAL.mono, fontSize: 12.5 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[
          { id: 'null', label: 'args last entry: YAML null' },
          { id: 'string', label: 'args last entry: "/Users/me/vault"' },
          { id: 'seeded', label: 'after restart + seed' },
        ].map((s) => (
          <button key={s.id} onClick={() => setState(s.id)}
            style={{
              padding: '6px 12px', fontFamily: 'inherit', fontSize: 11,
              background: state === s.id ? accent : 'transparent',
              color: state === s.id ? '#0d0b08' : BRAIN_PAL.fg,
              border: `1px solid ${state === s.id ? accent : BRAIN_PAL.border}`,
              borderRadius: 4, cursor: 'pointer',
            }}>{s.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FlowCol label="WIRING flow" active={isWiring} accent={accent} steps={[
          ['1', 'read brain.aide → quote last args entry'],
          ['2', 'YAML null detected — ask user for value'],
          ['3', 'edit brain.aide → land resolved value'],
          ['4', 'run npx aidemd-mcp sync'],
          ['STOP', 'emit "restart Claude Code" message and end'],
        ]} />
        <FlowCol label="SEEDING flow" active={isSeeding} accent={accent} steps={[
          ['1', 'read brain.aide → string detected, brain wired'],
          ['2', 'verify mcp__brain__* tools loaded in session'],
          ['3', 'for each: presence-check via list tool'],
          ['4', 'if missing → write_note from seed-section bytes'],
          ['5', 'emit completion summary; brain ready'],
        ]} />
      </div>
      {state === 'seeded' && (
        <div style={{ marginTop: 14, padding: '10px 14px', background: BRAIN_PAL.card, border: `1px solid ${BRAIN_PAL.border}`, borderLeft: `2px solid ${BRAIN_PAL.good}`, borderRadius: 4, color: BRAIN_PAL.fg }}>
          <span style={{ color: BRAIN_PAL.good }}>✓</span> brain wired and seeded — boot reporter shows <span style={{ color: BRAIN_PAL.good }}>ok</span>. you can now run <span style={{ color: accent }}>/aide</span> normally.
        </div>
      )}
    </div>
  );
}

function FlowCol({ label, active, accent, steps }) {
  return (
    <div style={{
      padding: '14px 16px',
      background: active ? BRAIN_PAL.card : 'transparent',
      border: `1px solid ${active ? accent : BRAIN_PAL.border}`,
      borderRadius: 6,
      opacity: active ? 1 : 0.4,
      transition: 'all 200ms',
    }}>
      <div style={{ fontSize: 11, color: active ? accent : BRAIN_PAL.dim, letterSpacing: 1.5, marginBottom: 10 }}>{label}{active ? ' · runs' : ' · skipped'}</div>
      {steps.map(([n, s], i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '5px 0', fontSize: 12, color: BRAIN_PAL.fg }}>
          <span style={{ color: accent, width: 30, fontSize: 10 }}>{n}</span>
          <span>{s}</span>
        </div>
      ))}
    </div>
  );
}

// ────────── boot states quick-ref ──────────
function BootStates({ accent = BRAIN_PAL.accent }) {
  const states = [
    { id: 'ok', dot: BRAIN_PAL.good, what: 'brain.aide + .mcp.json agree.', fix: 'pipeline proceeds.' },
    { id: 'no-brain-aide', dot: BRAIN_PAL.bad, what: '.aide/config/brain.aide is missing.', fix: 'npx aidemd-mcp init' },
    { id: 'no-mcp-entry', dot: BRAIN_PAL.warn, what: '.mcp.json has no brain entry, or args still have null.', fix: '/aide:brain config → npx aidemd-mcp sync → restart' },
    { id: 'mcp-drift', dot: BRAIN_PAL.warn, what: 'brain.aide and .mcp.json disagree.', fix: 'npx aidemd-mcp sync → restart' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontFamily: BRAIN_PAL.mono }}>
      {states.map((s) => (
        <div key={s.id} style={{ padding: '12px 14px', background: BRAIN_PAL.card, border: `1px solid ${BRAIN_PAL.border}`, borderLeft: `2px solid ${s.dot}`, borderRadius: 4 }}>
          <div style={{ fontSize: 12, color: s.dot, marginBottom: 4 }}><span style={{ color: s.dot, marginRight: 6 }}>●</span>{s.id}</div>
          <div style={{ fontSize: 12, color: BRAIN_PAL.fg, marginBottom: 6, lineHeight: 1.5 }}>{s.what}</div>
          <div style={{ fontSize: 11, color: BRAIN_PAL.dim, lineHeight: 1.5 }}>fix: <span style={{ color: accent }}>{s.fix}</span></div>
        </div>
      ))}
    </div>
  );
}

// ────────── MCP tool surface checklist ──────────
function MCPToolSurface({ accent = BRAIN_PAL.accent }) {
  const tools = [
    { sig: 'mcp__brain__read_<unit>', why: 'load a single artifact by relative identifier (path, page id, slug). Used everywhere — every reference walk starts here.', required: true },
    { sig: 'mcp__brain__list_<unit>', why: 'enumerate the contents of a folder/page. Used for presence-checks during seeding and for browsing.', required: true },
    { sig: 'mcp__brain__write_<unit>', why: 'create or overwrite an artifact body. The integration\'s aide-config prose calls this during seeding.', required: true },
    { sig: 'mcp__brain__search', why: 'full-text or keyword query across the brain. Strongly recommended; the strategist falls back to walking link graphs without it.', required: false },
    { sig: 'mcp__brain__delete_<unit>', why: 'remove an artifact. Optional — humans usually do this in the brain UI.', required: false },
  ];
  return (
    <div style={{ fontFamily: BRAIN_PAL.mono }}>
      {tools.map((t, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '24px 1fr',
          gap: 14, padding: '12px 14px',
          borderTop: i === 0 ? `1px solid ${BRAIN_PAL.border}` : 'none',
          borderBottom: `1px solid ${BRAIN_PAL.border}`,
        }}>
          <div style={{ fontSize: 11, color: t.required ? accent : BRAIN_PAL.dim }}>
            {t.required ? 'req' : 'opt'}
          </div>
          <div>
            <div style={{ fontSize: 13, color: BRAIN_PAL.fg, marginBottom: 4 }}>{t.sig}</div>
            <div style={{ fontSize: 12, color: BRAIN_PAL.dim, lineHeight: 1.6 }}>{t.why}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  BRAIN_PAL, CopyChip, CmdLine, CodePre,
  BACKEND_PRESETS, SkeletonGenerator,
  ConfigFlow, BootStates, MCPToolSurface,
});
