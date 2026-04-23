// Shared data + components used across all three variants.

const PIPELINE_STAGES = [
  {
    id: 'spec',
    cmd: '/aide:spec',
    name: 'Spec Writer',
    role: 'Turns your interview answers into a falsifiable contract.',
    reads: ['your intent'],
    writes: ['.aide frontmatter: scope, intent, outcomes.desired, outcomes.undesired'],
    detail: 'No body sections, no research, no code. The spec writer structures intent; the orchestrator owns the user conversation.',
  },
  {
    id: 'research',
    cmd: '/aide:research',
    name: 'Domain Expert',
    role: 'Fills the brain with durable domain knowledge.',
    reads: ['your sources', 'web', 'prior brain notes'],
    writes: ['research/<domain>/*.md in the vault'],
    detail: 'Optional. Skips if the brain already has coverage or you hold the knowledge. Never writes .aide files — the output is reusable research filed by domain, not by project.',
  },
  {
    id: 'synthesize',
    cmd: '/aide:synthesize',
    name: 'Strategist',
    role: 'Distills research into decisions.',
    reads: ['.aide frontmatter', 'brain notes', 'parent .aide chain'],
    writes: ['## Context, ## Strategy, ## Good examples, ## Bad examples, ## References'],
    detail: 'Every strategy decision must trace to an outcome. Anything that does not serve the intent gets cut.',
  },
  {
    id: 'plan',
    cmd: '/aide:plan',
    name: 'Architect',
    role: 'Translates intent into a checkboxed plan.',
    reads: ['.aide spec', 'coding-playbook', 'current codebase'],
    writes: ['plan.aide with Project Structure + Plan + Decisions'],
    detail: 'Picks files, names, sequencing, contracts, reuse. No code. Presented to you for approval before build begins.',
  },
  {
    id: 'build',
    cmd: '/aide:build',
    name: 'Implementor',
    role: 'Executes the plan top-to-bottom.',
    reads: ['plan.aide', '.aide spec', 'playbook Read: lists'],
    writes: ['application code + tests'],
    detail: 'One fresh agent per numbered step. Checks each box as it completes. If the plan is ambiguous, escalates back to the architect rather than inventing an answer.',
  },
  {
    id: 'qa',
    cmd: '/aide:qa',
    name: 'QA + Aligner',
    role: 'Walks the intent tree, finds drift, writes the todo.',
    reads: ['full intent tree (root → leaf)', 'actual output'],
    writes: ['todo.aide with misalignment tags and a retro'],
    detail: 'Compares output against outcomes.desired and checks for outcomes.undesired. Each issue traces to a spec line and is tagged with the pipeline stage where intent was lost.',
  },
];

const MISALIGNMENTS = [
  ['spec-gap', 'The spec did not capture something important.'],
  ['research-gap', 'Domain knowledge was incomplete, outdated, or wrong.'],
  ['strategy-gap', 'Strategy did not account for an edge case.'],
  ['plan-gap', 'The architect missed a step or left ambiguity.'],
  ['implementation-drift', 'Code deviated from the plan.'],
  ['test-gap', 'Tests passed but did not cover the failure mode.'],
];

const INTENT_TREE = {
  name: '.aide/',
  kind: 'dir',
  note: 'project root — top of the intent tree',
  children: [
    {
      name: 'intent.aide',
      kind: 'intent',
      note: 'project-level contract every child inherits',
      preview: {
        scope: '.',
        intent: 'Generate personalized retention emails for lapsed customers that feel hand-written, not templated.',
        desired: ['Opening references a specific past purchase', 'Body under 80 words', 'CTA is a single link, not a button array'],
        undesired: ['Generic "we miss you" openers', 'Emojis in subject line', 'Mentions of discount % the customer did not earn'],
      },
    },
  ],
};

const SRC_TREE = {
  name: 'src/',
  kind: 'dir',
  children: [
    {
      name: '.aide',
      kind: 'intent',
      note: 'src-level intent — narrows project root',
      preview: {
        scope: 'src/',
        intent: 'Orchestrate the email pipeline: segment audience, draft, personalize, send.',
        desired: ['Every send is traceable to a segment', 'Personalization fields resolved before send'],
        undesired: ['Sends to unsegmented users', 'Template placeholders reaching production'],
      },
    },
    {
      name: 'service/',
      kind: 'dir',
      children: [
        {
          name: 'retention/',
          kind: 'dir',
          children: [
            { name: '.aide', kind: 'intent', note: 'feature strategy — retention emails', preview: {
              scope: 'src/service/retention',
              intent: 'Bring lapsed customers back by referencing something they actually did.',
              desired: ['Reference is factual, drawn from order history', 'Tone matches brand voice (warm, not desperate)'],
              undesired: ['Fabricated references to purchases that never happened', 'Guilt-trip language'],
            }},
            { name: 'plan.aide', kind: 'plan', note: 'architect plan, approved 2d ago' },
            { name: 'todo.aide', kind: 'todo', note: '2 open items from last QA loop' },
            { name: 'index.ts', kind: 'code', note: 'orchestrator — retention pipeline' },
            {
              name: 'draftOpener/',
              kind: 'dir',
              children: [
                { name: '.aide', kind: 'intent', note: 'sub-spec — opener strategy', preview: {
                  scope: 'src/service/retention/draftOpener',
                  intent: 'Write an opener that names the specific past purchase without sounding like a receipt.',
                  desired: ['First sentence names the product category, not SKU', 'Under 20 words'],
                  undesired: ['"We noticed you bought…" — surveillance tone', 'Listing multiple items'],
                }},
                { name: 'index.ts', kind: 'code', note: 'orchestrator' },
                { name: 'extractSignal/', kind: 'dir', children: [
                  { name: 'index.ts', kind: 'code', note: 'helper — no .aide (self-explanatory)' },
                ]},
                { name: 'phraseOpener/', kind: 'dir', children: [
                  { name: 'index.ts', kind: 'code', note: 'helper — no .aide' },
                ]},
              ],
            },
            {
              name: 'personalize/',
              kind: 'dir',
              children: [
                { name: '.aide', kind: 'intent', note: 'sub-spec — personalization' },
                { name: 'index.ts', kind: 'code' },
              ],
            },
            {
              name: 'sendEmail/',
              kind: 'dir',
              children: [
                { name: 'index.ts', kind: 'code', note: 'helper — no .aide (single-purpose)' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// ───────────────────────── Interactive Intent Tree ─────────────────────────

function IntentTreeNode({ node, depth = 0, accent, palette, mono }) {
  const [open, setOpen] = React.useState(depth < 2);
  const [showPreview, setShowPreview] = React.useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const iconFor = {
    dir: '▸',
    intent: '◆',
    plan: '▦',
    todo: '☐',
    code: '·',
  };

  const colorFor = {
    dir: palette.dim,
    intent: accent,
    plan: palette.plan || '#6b8ab8',
    todo: palette.todo || '#c7a04a',
    code: palette.code || palette.dim,
  };

  const isAide = node.kind === 'intent' || node.kind === 'plan' || node.kind === 'todo';
  const caret = hasChildren ? (open ? '▾' : '▸') : ' ';

  return (
    <div style={{ userSelect: 'none' }}>
      <div
        onClick={() => {
          if (hasChildren) setOpen(!open);
          if (node.preview) setShowPreview(!showPreview);
        }}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          padding: '3px 6px',
          paddingLeft: 6 + depth * 18,
          cursor: hasChildren || node.preview ? 'pointer' : 'default',
          borderRadius: 4,
          color: palette.fg,
          fontFamily: mono,
          fontSize: 13,
          lineHeight: 1.6,
          transition: 'background 120ms',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = palette.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <span style={{ width: 10, color: palette.dim, fontSize: 10 }}>{caret}</span>
        <span style={{ color: colorFor[node.kind], width: 10 }}>{iconFor[node.kind]}</span>
        <span style={{ color: isAide ? palette.fg : palette.dim, fontWeight: isAide ? 600 : 400 }}>{node.name}</span>
        {node.note && (
          <span style={{ color: palette.dim, fontSize: 12, fontStyle: 'italic' }}>— {node.note}</span>
        )}
      </div>
      {showPreview && node.preview && (
        <AidePreview preview={node.preview} depth={depth} accent={accent} palette={palette} mono={mono} />
      )}
      {open && hasChildren && (
        <div>
          {node.children.map((c, i) => (
            <IntentTreeNode key={c.name + i} node={c} depth={depth + 1} accent={accent} palette={palette} mono={mono} />
          ))}
        </div>
      )}
    </div>
  );
}

function AidePreview({ preview, depth, accent, palette, mono }) {
  return (
    <div
      style={{
        marginLeft: 6 + depth * 18 + 28,
        marginTop: 4,
        marginBottom: 10,
        padding: '10px 14px',
        background: palette.card,
        border: `1px solid ${palette.border}`,
        borderLeft: `2px solid ${accent}`,
        borderRadius: 4,
        fontFamily: mono,
        fontSize: 12,
        lineHeight: 1.7,
        color: palette.fg,
        maxWidth: 720,
      }}
    >
      <div style={{ color: palette.dim }}>---</div>
      <div><span style={{ color: palette.dim }}>scope:</span> {preview.scope}</div>
      <div><span style={{ color: palette.dim }}>intent:</span> <span style={{ color: palette.fg }}>{preview.intent}</span></div>
      <div style={{ color: palette.dim }}>outcomes:</div>
      <div style={{ paddingLeft: 12 }}>
        <div style={{ color: palette.dim }}>desired:</div>
        {preview.desired.map((d, i) => (
          <div key={i} style={{ paddingLeft: 12 }}>
            <span style={{ color: accent }}>- </span>{d}
          </div>
        ))}
        <div style={{ color: palette.dim }}>undesired:</div>
        {preview.undesired.map((d, i) => (
          <div key={i} style={{ paddingLeft: 12 }}>
            <span style={{ color: palette.todo || '#c7a04a' }}>- </span>{d}
          </div>
        ))}
      </div>
      <div style={{ color: palette.dim }}>---</div>
    </div>
  );
}

function IntentTree({ accent, palette, mono, roots }) {
  return (
    <div
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 6,
        padding: '14px 10px',
      }}
    >
      {roots.map((r, i) => (
        <IntentTreeNode key={i} node={r} accent={accent} palette={palette} mono={mono} />
      ))}
    </div>
  );
}

// ───────────────────────── Interactive Pipeline ─────────────────────────

function Pipeline({ accent, palette, mono, sans, variant = 'horizontal' }) {
  const [active, setActive] = React.useState('spec');
  const stage = PIPELINE_STAGES.find((s) => s.id === active);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${PIPELINE_STAGES.length}, 1fr)`,
          gap: 6,
          marginBottom: 20,
        }}
      >
        {PIPELINE_STAGES.map((s, i) => {
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                position: 'relative',
                textAlign: 'left',
                padding: '14px 14px 16px',
                background: isActive ? palette.card : palette.bg,
                border: `1px solid ${isActive ? accent : palette.border}`,
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 160ms',
                fontFamily: sans,
                color: palette.fg,
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 11, color: palette.dim, marginBottom: 6 }}>
                {String(i + 1).padStart(2, '0')} · {s.cmd}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, color: isActive ? accent : palette.fg }}>{s.name}</div>
              {isActive && (
                <div style={{ position: 'absolute', left: '50%', bottom: -8, width: 14, height: 14, background: palette.card, borderLeft: `1px solid ${accent}`, borderBottom: `1px solid ${accent}`, transform: 'translateX(-50%) rotate(-45deg)' }} />
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          padding: '24px 26px',
          background: palette.card,
          border: `1px solid ${accent}`,
          borderRadius: 8,
          fontFamily: sans,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 11, color: accent, letterSpacing: 1, marginBottom: 6 }}>
              {stage.cmd.toUpperCase()}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, color: palette.fg }}>{stage.name}</div>
            <div style={{ fontSize: 14, color: palette.fg, lineHeight: 1.55, marginBottom: 14 }}>{stage.role}</div>
            <div style={{ fontSize: 13, color: palette.dim, lineHeight: 1.6 }}>{stage.detail}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gap: 14 }}>
            <IOBlock label="reads" items={stage.reads} accent={accent} palette={palette} mono={mono} />
            <IOBlock label="writes" items={stage.writes} accent={accent} palette={palette} mono={mono} isWrite />
          </div>
        </div>
      </div>
    </div>
  );
}

function IOBlock({ label, items, accent, palette, mono, isWrite }) {
  return (
    <div>
      <div style={{ fontFamily: mono, fontSize: 10, color: palette.dim, letterSpacing: 1.5, marginBottom: 6 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              fontFamily: mono,
              fontSize: 12,
              padding: '6px 10px',
              background: palette.bg,
              border: `1px solid ${palette.border}`,
              borderLeft: `2px solid ${isWrite ? accent : palette.dim}`,
              borderRadius: 4,
              color: palette.fg,
            }}
          >
            {it}
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────── CLI Demo ─────────────────────────

const DEMO_SCRIPT = [
  { prompt: true, text: 'npx @aidemd-mcp/server@latest init' },
  { out: 'Scaffolding .aide/ and brain pointers...' },
  { out: 'Wrote .aide/intent.aide' },
  { out: 'Wrote .aide/docs/' },
  { out: 'Connected Obsidian vault: ~/brain' },
  { out: '✓ ready' },
  { prompt: true, text: '/aide' },
  { out: 'Interviewing for new module...' },
  { out: '  What are you building? _ lapsed-customer retention emails' },
  { out: '  Who receives this? _ users with no order in 60+ days' },
  { out: 'Dispatching to /aide:spec...' },
  { aide: true, path: 'src/service/retention/.aide' },
  { out: 'Spec frontmatter written. Awaiting your confirmation...' },
  { prompt: true, text: 'approve' },
  { out: 'Dispatching to /aide:research → domain expert' },
  { out: '  → reading research/email-marketing/* (brain)' },
  { out: '  → fetching 4 new sources' },
  { out: '  → wrote 3 notes: research/email-marketing/opener-patterns.md (+2)' },
  { out: 'Dispatching to /aide:synthesize → strategist' },
  { out: '  → walked intent tree: .aide/intent.aide → src/.aide → retention/.aide' },
  { out: '  → wrote Context, Strategy, Good/Bad examples, References' },
  { out: 'Dispatching to /aide:plan → architect' },
  { plan: true, path: 'src/service/retention/plan.aide' },
  { out: 'Plan ready. 7 numbered steps. Review and approve...' },
];

function CLIDemo({ accent, palette, mono }) {
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (!playing) return;
    if (step >= DEMO_SCRIPT.length) return;
    const delay = DEMO_SCRIPT[step]?.prompt ? 900 : 360;
    const t = setTimeout(() => setStep((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [step, playing]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [step]);

  const restart = () => { setStep(0); setPlaying(true); };

  return (
    <div
      style={{
        background: palette.terminal || '#0d0b08',
        border: `1px solid ${palette.border}`,
        borderRadius: 8,
        overflow: 'hidden',
        fontFamily: mono,
        color: '#d9d2c7',
        fontSize: 13,
        boxShadow: palette.deep ? '0 20px 60px rgba(0,0,0,.35)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c93f' }} />
        <span style={{ marginLeft: 16, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>~/my-app — zsh — aide</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
          <span onClick={() => setPlaying(!playing)} style={{ cursor: 'pointer', marginRight: 10 }}>{playing ? '⏸ pause' : '▶ play'}</span>
          <span onClick={restart} style={{ cursor: 'pointer' }}>↻ restart</span>
        </span>
      </div>
      <div ref={scrollRef} style={{ padding: '16px 18px', height: 360, overflow: 'auto' }}>
        {DEMO_SCRIPT.slice(0, step).map((line, i) => {
          if (line.prompt) return (
            <div key={i} style={{ marginBottom: 4 }}>
              <span style={{ color: accent, marginRight: 8 }}>›</span>
              <span>{line.text}</span>
            </div>
          );
          if (line.aide) return <FauxAideBlock key={i} path={line.path} accent={accent} />;
          if (line.plan) return <FauxPlanBlock key={i} path={line.path} accent={accent} />;
          return <div key={i} style={{ color: 'rgba(217,210,199,0.75)', marginBottom: 2 }}>{line.out}</div>;
        })}
        {step < DEMO_SCRIPT.length && playing && (
          <span style={{ display: 'inline-block', width: 8, height: 14, background: accent, verticalAlign: 'middle', animation: 'aideCursor 1s steps(2) infinite' }} />
        )}
      </div>
      <style>{`@keyframes aideCursor { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

function FauxAideBlock({ path, accent }) {
  return (
    <div style={{ margin: '8px 0', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderLeft: `2px solid ${accent}`, borderRadius: 4 }}>
      <div style={{ color: accent, fontSize: 11, marginBottom: 6 }}>+ {path}</div>
      <div style={{ color: 'rgba(217,210,199,0.5)' }}>---</div>
      <div><span style={{ color: 'rgba(217,210,199,0.5)' }}>scope:</span> src/service/retention</div>
      <div><span style={{ color: 'rgba(217,210,199,0.5)' }}>intent:</span> Bring lapsed customers back by referencing</div>
      <div style={{ paddingLeft: 36 }}>something they actually did, not a templated "we miss you".</div>
      <div style={{ color: 'rgba(217,210,199,0.5)' }}>outcomes:</div>
      <div style={{ paddingLeft: 14, color: 'rgba(217,210,199,0.5)' }}>desired:</div>
      <div style={{ paddingLeft: 26 }}><span style={{ color: accent }}>- </span>Opens with a factual reference from order history</div>
      <div style={{ paddingLeft: 26 }}><span style={{ color: accent }}>- </span>Body under 80 words</div>
      <div style={{ paddingLeft: 14, color: 'rgba(217,210,199,0.5)' }}>undesired:</div>
      <div style={{ paddingLeft: 26 }}><span style={{ color: '#c7a04a' }}>- </span>Fabricated references</div>
      <div style={{ paddingLeft: 26 }}><span style={{ color: '#c7a04a' }}>- </span>Guilt-trip language</div>
      <div style={{ color: 'rgba(217,210,199,0.5)' }}>---</div>
    </div>
  );
}

function FauxPlanBlock({ path, accent }) {
  return (
    <div style={{ margin: '8px 0', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderLeft: `2px solid ${accent}`, borderRadius: 4 }}>
      <div style={{ color: accent, fontSize: 11, marginBottom: 6 }}>+ {path}</div>
      <div style={{ color: 'rgba(217,210,199,0.85)' }}>## Plan</div>
      <div>### 1. Scaffold retention orchestrator</div>
      <div style={{ color: 'rgba(217,210,199,0.6)', fontSize: 12 }}>Read: coding-playbook/structure/modularization</div>
      <div>- [ ] create retention/index.ts with pipeline skeleton</div>
      <div>### 2. Extract order-history signal</div>
      <div style={{ color: 'rgba(217,210,199,0.6)', fontSize: 12 }}>Read: coding-playbook/patterns/orchestrator-helper</div>
      <div>- [ ] 2a. create extractSignal/ helper</div>
      <div>- [ ] 2b. wire into orchestrator</div>
      <div style={{ color: 'rgba(217,210,199,0.5)' }}>...</div>
    </div>
  );
}

// ───────────────────────── Obsidian Vault block ─────────────────────────

function VaultBlock({ accent, palette, mono, sans }) {
  const [tab, setTab] = React.useState('research');
  const researchFiles = [
    { path: 'research/email-marketing/opener-patterns.md', preview: 'Subject + opener pair drives 64% of reopens. Specificity beats personalization tokens…' },
    { path: 'research/email-marketing/reactivation-windows.md', preview: '60-90 day window is the sweet spot. Past 120 days, reactivation rate halves.' },
    { path: 'research/email-marketing/tone-studies.md', preview: 'Three tone ladders (formal→warm→casual). Brand fit > absolute best performer.' },
  ];
  const playbookFiles = [
    { path: 'coding-playbook/structure/modularization.md', preview: 'Every helper gets its own subfolder. index.ts default export. Folder name = function name.' },
    { path: 'coding-playbook/patterns/orchestrator-helper.md', preview: 'The index.ts at any level is the orchestrator. Helpers are focused, independently testable.' },
    { path: 'coding-playbook/testing/unit-tests.md', preview: 'One test per outcome. Name the test after the desired behavior, not the function.' },
    { path: 'coding-playbook/errors/typed-errors.md', preview: 'Errors are values, not thrown. Result<T, E> at module boundaries.' },
  ];
  const files = tab === 'research' ? researchFiles : playbookFiles;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 0, border: `1px solid ${palette.border}`, borderRadius: 8, overflow: 'hidden', background: palette.card, fontFamily: sans }}>
      <div style={{ background: palette.bg, borderRight: `1px solid ${palette.border}`, padding: '14px 0' }}>
        <div style={{ padding: '0 16px 12px', fontSize: 11, color: palette.dim, letterSpacing: 1.5, fontFamily: mono }}>YOUR VAULT</div>
        <div style={{ display: 'flex', gap: 4, padding: '0 12px 10px' }}>
          <button onClick={() => setTab('research')} style={tabBtn(tab === 'research', accent, palette, mono)}>research</button>
          <button onClick={() => setTab('playbook')} style={tabBtn(tab === 'playbook', accent, palette, mono)}>playbook</button>
        </div>
        <div>
          {files.map((f) => (
            <div key={f.path} style={{ padding: '8px 16px', fontFamily: mono, fontSize: 12, color: palette.fg, cursor: 'pointer', borderLeft: `2px solid transparent` }} onMouseEnter={(e) => e.currentTarget.style.borderLeft = `2px solid ${accent}`} onMouseLeave={(e) => e.currentTarget.style.borderLeft = `2px solid transparent`}>
              {f.path.split('/').pop()}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ fontSize: 12, fontFamily: mono, color: palette.dim, marginBottom: 14 }}>
          {tab === 'research' ? 'Domain notes — read by the strategist when filling Strategy.' : 'Convention notes — read by the architect and implementor.'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {files.map((f) => (
            <div key={f.path} style={{ padding: '14px 16px', background: palette.bg, border: `1px solid ${palette.border}`, borderLeft: `2px solid ${accent}`, borderRadius: 4 }}>
              <div style={{ fontFamily: mono, fontSize: 12, color: accent, marginBottom: 6 }}>{f.path}</div>
              <div style={{ fontSize: 13, color: palette.fg, lineHeight: 1.55 }}>{f.preview}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function tabBtn(active, accent, palette, mono) {
  return {
    padding: '5px 10px',
    background: active ? accent : 'transparent',
    color: active ? '#fff' : palette.fg,
    border: `1px solid ${active ? accent : palette.border}`,
    borderRadius: 4,
    fontSize: 11,
    fontFamily: mono,
    cursor: 'pointer',
  };
}

Object.assign(window, {
  PIPELINE_STAGES, MISALIGNMENTS, INTENT_TREE, SRC_TREE,
  IntentTree, Pipeline, CLIDemo, VaultBlock,
});
