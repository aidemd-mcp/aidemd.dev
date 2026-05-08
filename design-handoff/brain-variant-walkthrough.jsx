// Variant A · The Walkthrough — linear tutorial.

function BrainVariantWalkthrough() {
  const p = BRAIN_PAL;
  const accent = p.accent;
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

      {/* hero */}
      <div style={{ padding: '60px 64px 40px', maxWidth: 1180 }}>
        <div style={{ fontSize: 12, color: accent, letterSpacing: 2, marginBottom: 16 }}># a guide for backend authors</div>
        <h1 style={{ fontSize: 56, margin: 0, fontWeight: 500, lineHeight: 1.05, letterSpacing: -0.5 }}>
          wire any backend<br />
          <span style={{ color: p.dim }}>as a brain.</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: p.dim, marginTop: 22, maxWidth: 720 }}>
          The <span style={{ color: accent }}>brain.aide</span> file is a plugin interface. It tells AIDE how to launch
          your storage backend over MCP and how to talk to it once it's live. Bundled today: an Obsidian default.
          This page walks you through wiring that default, then shows you how to author your own — a Notion brain,
          a flat-filesystem brain, anything that can speak MCP.
        </p>
        <div style={{ display: 'flex', gap: 14, marginTop: 24, fontSize: 12, color: p.dim }}>
          <span style={{ color: accent }}>[ ✓ ]</span><span>5-step walkthrough</span>
          <span style={{ color: accent }}>[ ✓ ]</span><span>3 worked examples</span>
          <span style={{ color: accent }}>[ ✓ ]</span><span>live skeleton generator</span>
        </div>
      </div>

      <Divider />

      {/* STEP 1 — install */}
      <Section num="01" title="install + scaffold the default" sub="# the cli writes .aide/config/brain.aide pre-filled with the obsidian template.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          <div>
            <CmdLine cmd="npx aidemd-mcp init" accent={accent} />
            <div style={{ fontSize: 12, color: p.dim, marginTop: 14, lineHeight: 1.7 }}>
              Run this in any project root. It creates <span style={{ color: accent }}>.aide/</span> with the
              methodology docs, scaffolds <span style={{ color: accent }}>.aide/config/brain.aide</span> using the
              bundled Obsidian template, and stops. The file lands with{' '}
              <span style={{ color: p.warn }}>YAML null</span> at the unwired arg slot — that's the signal that you
              still need to point it at a vault.
            </div>
            <div style={{ fontSize: 11, color: p.dim2, marginTop: 18, lineHeight: 1.7 }}>
              # alternative: <span style={{ color: accent }}>--brain {`<integration>`}</span> selects a different
              <br /># bundled template at install time.
            </div>
          </div>
          <CodePre label=".aide/config/brain.aide (just-scaffolded)" code={`---
name: obsidian
mcpServerConfig:
  command: npx
  args:
    - "@bitbonsai/mcpvault"
    -                                # ← YAML null. unwired.
---

<!-- aide-orientation-start -->
Your brain is an Obsidian-backed knowledge store.
Use mcp__brain__read_note to open files...
<!-- aide-orientation-end -->

<!-- aide-config-start -->
You are completing the wiring of an Obsidian brain.
The required value is the absolute path to the
user's Obsidian vault...
<!-- aide-config-end -->

(...four seed sections...)`} />
        </div>
      </Section>

      <Divider />

      {/* STEP 2 — wire */}
      <Section num="02" title="wire it: /aide:brain config" sub="# the config flow has two paths. the one that runs depends on what's in args.">
        <div style={{ fontSize: 13, color: p.dim, marginBottom: 18, lineHeight: 1.7, maxWidth: 880 }}>
          Run <span style={{ color: accent }}>/aide:brain config</span> from inside Claude Code. The command reads
          the <span style={{ color: accent }}>aide-config</span> body section, which is integration-specific prose
          that knows how to handle the unwired slots for <em>this</em> backend. Click the buttons below to see what
          fires when:
        </div>
        <ConfigFlow accent={accent} />
        <div style={{ marginTop: 22, padding: '14px 18px', background: p.card, border: `1px solid ${p.border}`, borderLeft: `2px solid ${p.warn}`, borderRadius: 4, fontSize: 12.5, color: p.fg, lineHeight: 1.7 }}>
          <span style={{ color: p.warn, fontSize: 11, letterSpacing: 1.5 }}>WHY THE STOP</span><br />
          The brain's MCP server is registered at session start. The <em>just-wired</em> brain isn't loaded in the
          running session — sync wrote the entry but Claude Code didn't see it boot. So the wiring flow stops, you
          restart, and the <em>second</em> run of <span style={{ color: accent }}>/aide:brain config</span> takes
          the seeding path.
        </div>
      </Section>

      <Divider />

      {/* STEP 3 — seed */}
      <Section num="03" title="seed the entry-point artifacts" sub="# the four seed sections in brain.aide become four files inside your brain.">
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 28 }}>
          <div>
            <div style={{ fontSize: 13, color: p.fg, lineHeight: 1.7, marginBottom: 14 }}>
              On the second run, the integration's <span style={{ color: accent }}>aide-config</span> prose calls
              the brain's own MCP write tool to create:
            </div>
            <div style={{ fontFamily: p.mono, fontSize: 12, lineHeight: 2, color: p.fg }}>
              <SeedRow path="coding-playbook/coding-playbook.md" from="aide-playbook-index" accent={accent} />
              <SeedRow path="coding-playbook/study-playbook.md" from="aide-study-playbook" accent={accent} />
              <SeedRow path="coding-playbook/update-playbook.md" from="aide-update-playbook" accent={accent} />
              <SeedRow path="research/research.md" from="aide-research-index" accent={accent} />
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: p.dim, lineHeight: 1.7 }}>
              Each is presence-checked first; existing files are left alone. After the first seed pass, the seed
              bytes in <span style={{ color: accent }}>brain.aide</span> go dormant — the brain owns those files
              now, and humans edit them in the brain UI.
            </div>
          </div>
          <CodePre label="seed write call (obsidian)" code={`mcp__brain__write_note({
  path: "coding-playbook/coding-playbook.md",
  content: "<verbatim bytes from aide-playbook-index section>"
})

→ ✓ wrote
→ ✓ wrote coding-playbook/study-playbook.md
→ ✓ wrote coding-playbook/update-playbook.md
→ ✓ wrote research/research.md

✓ seeding complete. you can now run /aide.`} />
        </div>
      </Section>

      <Divider />

      {/* STEP 4 — verify */}
      <Section num="04" title="verify with the boot reporter" sub="# at session start the orchestrator checks brain.aide vs .mcp.json. four states.">
        <BootStates accent={accent} />
      </Section>

      <Divider />

      {/* STEP 5 — your own backend */}
      <Section num="05" title="build your own backend" sub="# everything above worked with bundled obsidian. now write one for your storage.">
        <div style={{ fontSize: 13, color: p.dim, lineHeight: 1.7, marginBottom: 22, maxWidth: 880 }}>
          Authoring a custom brain is three artifacts: an MCP server that exposes the right tools, a
          <span style={{ color: accent }}> brain.aide </span> file with frontmatter that launches it, and the body
          sections (orientation + aide-config + the four seeds) that teach AIDE how to use it.
        </div>

        <SubHeader label="A · what your MCP server must expose" accent={accent} />
        <div style={{ background: p.card, border: `1px solid ${p.border}`, borderRadius: 6, marginBottom: 26 }}>
          <MCPToolSurface accent={accent} />
        </div>

        <SubHeader label="B · the body sections you author" accent={accent} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 26 }}>
          <BodySectionCard tag="aide-orientation" who="aide_brain at runtime" what="A runtime briefing the agent reads at the start of every brain-touching task. Name your MCP tools, list your entry-point artifacts, set scope rules." accent={accent} />
          <BodySectionCard tag="aide-config" who="/aide:brain config" what="The wiring + seeding script. Documents which arg slots are unwired, how to resolve them, what to do after sync, and how to seed the four artifacts." accent={accent} />
          <BodySectionCard tag="aide-playbook-index" who="seed → coding-playbook/coding-playbook.md" what="Root hub for the coding playbook. The user's conventions, top-level navigation table." accent={accent} />
          <BodySectionCard tag="aide-study-playbook" who="seed → coding-playbook/study-playbook.md" what="Navigation methodology. How agents traverse the playbook hub → section → child note hierarchy." accent={accent} />
          <BodySectionCard tag="aide-update-playbook" who="seed → coding-playbook/update-playbook.md" what="Maintenance methodology. How to add, edit, rename, or remove playbook entries safely." accent={accent} />
          <BodySectionCard tag="aide-research-index" who="seed → research/research.md" what="Root hub for research notes. Domain index, navigation guidance." accent={accent} />
        </div>

        <SubHeader label="C · worked examples" accent={accent} />
        <WorkedExamples accent={accent} />

        <SubHeader label="D · live skeleton generator" accent={accent} />
        <div style={{ fontSize: 12, color: p.dim, marginBottom: 12, lineHeight: 1.7 }}>
          # pick a preset, name it, optionally override orientation. copy the result into{' '}
          <span style={{ color: accent }}>.aide/config/brain.aide</span>.
        </div>
        <SkeletonGenerator accent={accent} />
      </Section>

      <Divider />

      {/* footer */}
      <div style={{ padding: '40px 64px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FooterCard title="the spec" body="The strict, byte-faithful contract for brain.aide — frontmatter schema, marker grammar, parser failure modes." href="docs-brain-aide.html" cta="docs/brain-aide.md →" accent={accent} />
          <FooterCard title="the source" body="Reference implementation: @bitbonsai/mcpvault is the Obsidian brain shipping today. Read it as a template for your own." href="#" cta="github ↗" accent={accent} />
        </div>
        <div style={{ marginTop: 30, paddingTop: 20, borderTop: `1px solid ${p.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: p.dim2 }}>
          <div>© 2026 TetsuKodai Group LLC · <span style={{ color: accent }}>●</span> brain plugin interface</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>github ↗</span><span>npm ↗</span><span>discuss</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────── small layout helpers ──────────
function Section({ num, title, sub, children }) {
  const p = BRAIN_PAL;
  return (
    <div style={{ padding: '44px 64px', maxWidth: 1180 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
        <span style={{ color: p.accent, fontSize: 14 }}>§{num}</span>
        <span style={{ fontSize: 24, fontWeight: 600, color: p.fg }}>{title}</span>
      </div>
      {sub && <div style={{ fontSize: 13, color: p.dim, marginBottom: 26, marginLeft: 38, lineHeight: 1.6 }}>{sub}</div>}
      <div style={{ marginLeft: 0 }}>{children}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ padding: '4px 64px' }}><div style={{ borderTop: `1px dashed ${BRAIN_PAL.border}` }} /></div>;
}

function SubHeader({ label, accent }) {
  return (
    <div style={{ fontSize: 12, color: accent, letterSpacing: 1.5, marginBottom: 14, marginTop: 8 }}>
      {label.toUpperCase()}
    </div>
  );
}

function SeedRow({ path, from, accent }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr 14px 1fr', gap: 10, alignItems: 'center', fontSize: 12 }}>
      <span style={{ color: accent }}>◆</span>
      <span style={{ color: BRAIN_PAL.fg }}>{path}</span>
      <span style={{ color: BRAIN_PAL.dim }}>←</span>
      <span style={{ color: BRAIN_PAL.dim }}>{`<!-- ${from}-* -->`}</span>
    </div>
  );
}

function BodySectionCard({ tag, who, what, accent }) {
  const p = BRAIN_PAL;
  return (
    <div style={{ padding: '14px 16px', background: p.card, border: `1px solid ${p.border}`, borderLeft: `2px solid ${accent}`, borderRadius: 4 }}>
      <div style={{ fontSize: 12, color: accent, marginBottom: 4 }}>{`<!-- ${tag}-* -->`}</div>
      <div style={{ fontSize: 11, color: p.dim, marginBottom: 8 }}>{who}</div>
      <div style={{ fontSize: 12.5, color: p.fg, lineHeight: 1.6 }}>{what}</div>
    </div>
  );
}

function WorkedExamples({ accent }) {
  const [tab, setTab] = React.useState('filesystem');
  const p = BRAIN_PAL;
  const examples = {
    filesystem: {
      label: 'minimum-viable filesystem',
      blurb: 'A flat folder of markdown files. The simplest brain you can build — useful as a learning reference and for solo developers who don\'t want a separate app.',
      tools: 'mcp__brain__read_file · mcp__brain__list_dir · mcp__brain__write_file · mcp__brain__grep',
      orient: `Your brain is a plain-markdown folder. Use mcp__brain__read_file
to open files by path relative to the brain root.

Entry-point artifacts:
  coding-playbook/coding-playbook.md
  coding-playbook/study-playbook.md
  coding-playbook/update-playbook.md
  research/research.md`,
      config: `Required value: absolute path to the brain root folder.
WIRING: ask user (offer to mkdir), edit args[1], sync, STOP.
SEEDING: write each artifact via mcp__brain__write_file from the seed bytes.`,
      args: `args:\n  - "@example/fs-brain-mcp"\n  -                              # ← brain root path`,
    },
    notion: {
      label: 'notion (end-to-end)',
      blurb: 'Two unwired slots: integration token and root page ID. The seed step creates pages instead of files; orientation tells agents to stay inside the configured root.',
      tools: 'mcp__brain__read_page · mcp__brain__list_children · mcp__brain__create_page · mcp__brain__search',
      orient: `Your brain is a Notion workspace. Use mcp__brain__read_page
by ID or relative slug. Search via mcp__brain__search.

Entry-point pages (nested under the root):
  coding-playbook/coding-playbook
  coding-playbook/study-playbook
  coding-playbook/update-playbook
  research/research

Stay inside the configured root page.`,
      config: `Required: integration token + root page ID.
WIRING: ask user for both, edit args[2] and args[4], sync, STOP.
SEEDING: create nested pages via mcp__brain__create_page from seed bytes.`,
      args: `args:\n  - "@example/notion-brain-mcp"\n  - "--token"\n  -                            # ← integration token\n  - "--root"\n  -                            # ← root page ID`,
    },
    obsidian: {
      label: 'obsidian (the bundled default)',
      blurb: 'Reference implementation. Wikilink-aware. Single unwired slot for the vault path. Ships with @bitbonsai/mcpvault.',
      tools: 'mcp__brain__read_note · mcp__brain__list_directory · mcp__brain__write_note · mcp__brain__search_notes',
      orient: `Your brain is an Obsidian vault. Read notes with
mcp__brain__read_note and search with mcp__brain__search_notes.

Wikilinks resolve relative to the vault root.

Entry-point artifacts: (the four standard paths)`,
      config: `Required: absolute path to vault.
WIRING: ask user (suggest common paths), edit args[1], sync, STOP.
SEEDING: write each artifact via mcp__brain__write_note.`,
      args: `args:\n  - "@bitbonsai/mcpvault"\n  -                              # ← vault path`,
    },
  };
  const ex = examples[tab];
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {Object.entries(examples).map(([k, e]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{
              padding: '7px 13px', fontFamily: p.mono, fontSize: 12,
              background: tab === k ? accent : 'transparent',
              color: tab === k ? '#0d0b08' : p.fg,
              border: `1px solid ${tab === k ? accent : p.border}`,
              borderRadius: 4, cursor: 'pointer',
            }}>{e.label}</button>
        ))}
      </div>
      <div style={{ background: p.card, border: `1px solid ${p.border}`, borderRadius: 8, padding: 22 }}>
        <div style={{ fontSize: 13, color: p.fg, lineHeight: 1.7, marginBottom: 14 }}>{ex.blurb}</div>
        <div style={{ fontSize: 11, color: p.dim, marginBottom: 4, letterSpacing: 1 }}>MCP TOOLS EXPOSED</div>
        <div style={{ fontSize: 12, color: accent, marginBottom: 16, fontFamily: p.mono }}>{ex.tools}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <CodePre label="frontmatter args" code={ex.args} />
          <CodePre label="aide-orientation (excerpt)" code={ex.orient} />
        </div>
        <CodePre label="aide-config (excerpt)" code={ex.config} />
      </div>
    </div>
  );
}

function FooterCard({ title, body, href, cta, accent }) {
  const p = BRAIN_PAL;
  return (
    <a href={href} style={{ padding: '20px 22px', background: p.card, border: `1px solid ${p.border}`, borderLeft: `2px solid ${accent}`, borderRadius: 4, textDecoration: 'none', color: p.fg }}>
      <div style={{ fontSize: 11, color: accent, letterSpacing: 1.5, marginBottom: 6 }}>{cta}</div>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: p.dim, lineHeight: 1.6 }}>{body}</div>
    </a>
  );
}

Object.assign(window, { BrainVariantWalkthrough });
