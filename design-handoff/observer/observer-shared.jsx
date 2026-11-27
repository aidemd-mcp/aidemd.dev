// /observer — shared copy, data constants and primitives.
// All page copy lives in O2 so both variants say the same words.
// <Dr /> renders an amber DRAFT marker: the founder rewrites that line before ship.
// Exported from observer-v2-shared.jsx in the design project. Changes from that file:
//   - O2.install is the placeholder [INSTALL COMMAND — TO CONFIRM] (see handoff.md §7);
//   - the nav's observer entry points at observer.html (was observer-v2.html);
//   - the HALT / BLOCKED agent-reply snippets are pulled out into AGENT_REPLIES + <AgentReply />.
//     Rendered output is identical.

const O2 = {
  kicker: '# the observer',
  h1: 'Monitor every Claude Code session — see which pipeline phase each one is in.',
  sub: 'Local. Read-only. One web view across every project on your machine.',
  pain: 'Several agent sessions open at once, and no way to tell which one is blocked waiting for you — or whether two of them are working in the same project.',
  install: '[INSTALL COMMAND — TO CONFIRM]',
  facts: ['no telemetry', 'no account', 'MIT · open source', 'Windows · macOS · Linux'],
  rail: {
    h: 'The pipeline rail',
    p: 'Each session reports where it is in the work: the phase it is in — spec, plan, build, QA, fix — plus approval gates, plan steps checked and QA verdicts.',
  },
  own: {
    h: 'One open session per project',
    p: 'Before an agent starts, the observer checks whether another session is open in that project.',
    rows: [
      ['halt', 'If one is, it stops with HALT and names that session, what it was doing and how long it’s been quiet. You choose to end it or close the new one.'],
      ['end', 'Ending only marks a session ended. Nothing is deleted.'],
      ['blocked', 'If the observer can’t start, BLOCKED stops the session, so nothing runs unobserved.'],
    ],
  },
  states: {
    h: 'Working, waiting, ended',
    rows: [
      ['working', 'The session started, you sent a prompt, or the agent just ran a tool.'],
      ['waiting', 'The agent stopped and is waiting for you. You see it on the page — the observer doesn’t send notifications.'],
      ['ended', 'The session ended. Its record stays.'],
    ],
  },
  how: {
    h: 'How it knows',
    p: 'AIDE’s install and upgrade wire `aidemd-mcp hook` into Claude Code on five events — no extra config. Hooks give real-time signals that watching session files can’t; they print nothing and never fail or block the agent.',
  },
  quiet: {
    h: 'Quiet for 15 minutes',
    p: 'A session quiet for more than 15 minutes is marked “maybe stuck”. Quiet isn’t proof of a crash, so it is never ended for being quiet.',
  },
  local: {
    h: 'Local and private',
    p: 'It serves on 127.0.0.1 behind an access token, so your session data stays on your machine. No telemetry, no account. It’s read-only: it can’t change a session.',
  },
  setup: { h: 'Setup' },
  close: { h: 'Start a session with /aide and the observer is there.' },
};

// Site nav. github / npm are placeholders (#) — see handoff.md §7.
const O2_NAV = [
  { id: 'docs', label: 'docs', href: 'docs.html' },
  { id: 'brain', label: 'brain', href: 'brain.html' },
  { id: 'observer', label: 'observer', href: 'observer.html' },
  { id: 'github', label: 'github ↗', href: '#' },
  { id: 'npm', label: 'npm ↗', href: '#' },
];

// HALT / BLOCKED appear ONLY as these agent-reply snippets, never as an observer screen.
// The text is a placeholder built from the capture's demo data; the server's real wording replaces it.
const AGENT_REPLIES = {
  halt: { word: 'HALT', rest: ' — another session is open in billing-service.\n  session  proration-on-plan-change\n  state    waiting for you\n  quiet    6m\n  last     plan approval\nend that session, or close this one.' },
  blocked: { word: 'BLOCKED', rest: ' — the observer could not start\non any port (24680–24689).\nnothing runs unobserved.' },
};

const Dr = () => <span className="dr" title="founder edits before ship">DRAFT</span>;

// `code` spans inside copy strings
function Tx({ s }) {
  return s.split('`').map((x, i) => (i % 2 ? <code key={i}>{x}</code> : <React.Fragment key={i}>{x}</React.Fragment>));
}

// Nav entry. menuOpen is only used by the canvas to show the mobile drawer open.
function O2Nav({ menuOpen = false }) {
  const [open, setOpen] = React.useState(menuOpen);
  return (
    <React.Fragment>
      <nav className="o2-nav">
        <span className="dots"><i style={{ background: '#ff5f56' }}></i><i style={{ background: '#ffbd2e' }}></i><i style={{ background: '#27c93f' }}></i></span>
        <a className="o2-brand" href="Terminal.html"><b>$</b> aidemd.dev<span>/observer</span></a>
        <div className="o2-links">{O2_NAV.map((n) => <a key={n.id} href={n.href} className={n.id === 'observer' ? 'on' : ''} aria-current={n.id === 'observer' ? 'page' : undefined}>{n.label}</a>)}</div>
        <button className="o2-menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '× close' : '≡ menu'}</button>
      </nav>
      <div className={'o2-drawer' + (open ? ' open' : '')}>
        {O2_NAV.map((n) => <a key={n.id} href={n.href} className={n.id === 'observer' ? 'on' : ''}>{n.label}{n.id === 'observer' && <small>you are here</small>}</a>)}
      </div>
    </React.Fragment>
  );
}

// state icons — shape always paired with a word
function SI({ s }) {
  const c = 'currentColor';
  const g = {
    working: <circle cx="7" cy="7" r="5" fill={c} />,
    waiting: <circle cx="7" cy="7" r="4.6" fill="none" stroke={c} strokeWidth="2" />,
    ended: <path d="M2.5 7.4l3 3 6-6.4" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />,
    halt: <path d="M4.6 1h4.8L13 4.6v4.8L9.4 13H4.6L1 9.4V4.6z" fill={c} />,
    blocked: <path d="M7 1.2L13.2 12.6H.8z" fill={c} />,
    stuck: <path d="M7 1.9L12.4 11.8H1.6z" fill="none" stroke={c} strokeWidth="1.7" strokeLinejoin="round" />,
    end: <path d="M2.5 7.4l3 3 6-6.4" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />,
    pend: <circle cx="7" cy="7" r="4.6" fill="none" stroke={c} strokeWidth="1.4" strokeDasharray="2 2" />,
  }[s];
  return <svg className="si" viewBox="0 0 14 14" aria-hidden="true">{g}</svg>;
}

const SL_TEXT = { working: 'working', waiting: 'waiting for you', ended: 'ended · 2h ago', halt: 'HALT', blocked: 'BLOCKED', stuck: 'maybe stuck · quiet 15m', end: 'end session' };
function SL({ s, children }) {
  return <span className={'sl ' + (s === 'end' ? 'ended' : s)}><SI s={s} />{children || SL_TEXT[s]}</span>;
}

function Install() {
  const [ok, setOk] = React.useState(false);
  return (
    <div className="o2-act">
      <div className="o2-cmd"><span className="p">$</span><span>{O2.install}</span>
        <button onClick={() => { navigator.clipboard && navigator.clipboard.writeText(O2.install); setOk(true); setTimeout(() => setOk(false), 1400); }}>{ok ? 'copied' : 'copy'}</button>
      </div>
      <div className="o2-then"><span>then run <b>/aide</b> — the observer starts with it at</span><code>127.0.0.1:24680</code></div>
    </div>
  );
}

const CAP_ALT = 'The observer’s home view on one machine: billing-service waiting for you at plan approval, acme-api working at build step 3 of 6, mobile-app quiet 25 minutes and marked maybe stuck in QA, docs-site ended.';
function Capture({ pins }) {
  return (
    <div className="cap">
      <img src="assets/observer-capture-aidemd.png" srcSet="assets/observer-capture-aidemd.png 1x, assets/observer-capture-aidemd@2x.png 2x" width="1440" height="1180" alt={CAP_ALT} />
      {(pins || []).map((p) => <a key={p.n} className="pin" href={'#' + p.to} style={{ left: p.x + '%', top: p.y + '%' }} aria-label={'callout ' + p.n + ': ' + p.label} title={p.label}>{p.n}</a>)}
    </div>
  );
}

// State legend (Variant A only).
function Legend() {
  const rows = [['working', 'acting right now'], ['waiting', 'stopped; needs you'], ['stuck', 'quiet over 15 min'], ['ended', 'closed; record kept']];
  const reply = [['halt', 'second session in a project'], ['blocked', 'observer couldn’t start']];
  return (
    <aside className="legend" aria-label="state legend">
      <h3>states <Dr /></h3>
      {rows.map(([s, t]) => <div key={s}><SL s={s} /><small>{t}</small></div>)}
      <div className="sep">agent replies, not in the observer</div>
      {reply.map(([s, t]) => <div key={s}><SL s={s} /><small>{t}</small></div>)}
    </aside>
  );
}

// Not rendered by either variant (the rail section uses the rail capture). Kept as it was in the design.
function RailDemo() {
  const st = [['spec', 'done'], ['plan', 'done', 'gate approved'], ['build', 'cur', 'step 4 of 9'], ['qa', 'pend'], ['fix', 'pend']];
  const sub = { done: 'done', pend: 'pending' };
  return (
    <div className="rail2" role="list" aria-label="pipeline rail example">
      {st.map(([n, s, note]) => <div key={n} role="listitem" className={s}><b><SI s={s === 'done' ? 'ended' : s === 'cur' ? 'working' : 'pend'} />{n}</b><small>{note || sub[s]}</small></div>)}
    </div>
  );
}

// Agent-reply snippet (HALT / BLOCKED), as a terminal block.
function AgentReply({ kind }) {
  const r = AGENT_REPLIES[kind];
  return (
    <div><div className="rh"><span>agent reply · session start</span><span className="ph">placeholder · real wording from the server</span></div><pre><b>{r.word}</b>{r.rest}</pre></div>
  );
}

// Section block
function Blk({ n, id, h, draft = true, children }) {
  return (
    <section className="blk" id={id}>
      <h2>{n && <span className="n">{n}</span>}<span>{h}</span></h2>
      <div>{children}</div>
    </section>
  );
}

const SecRail = ({ n, id }) => <Blk n={n} id={id} h={O2.rail.h}><p><Tx s={O2.rail.p} /><Dr /></p><div className="railshot"><img src="assets/observer-capture-aidemd-rail.png" srcSet="assets/observer-capture-aidemd-rail.png 1x, assets/observer-capture-aidemd-rail@2x.png 2x" width="1018" height="64" alt="One pipeline rail: spec, synthesize, plan and plan approval done, research skipped, build running at step 3 of 6, then QA, fix and done pending." /></div></Blk>;
const SecOwn = ({ n, id }) => (
  <Blk n={n} id={id} h={O2.own.h}>
    <p>{O2.own.p}<Dr /></p>
    <div className="rows">{O2.own.rows.map(([s, t]) => <div key={s}><SL s={s} /><p>{t}</p></div>)}</div>
    <div className="reply">
      <AgentReply kind="halt" />
      <AgentReply kind="blocked" />
    </div>
  </Blk>
);
const SecStates = ({ n, id }) => (
  <Blk n={n} id={id} h={O2.states.h}>
    <div className="rows" style={{ marginTop: 0 }}>{O2.states.rows.map(([s, t]) => <div key={s}><SL s={s}>{s === 'ended' ? 'ended' : undefined}</SL><p>{t}</p></div>)}</div>
    <p><Dr /></p>
  </Blk>
);
const SecHow = ({ n, id }) => (
  <Blk n={n} id={id} h={O2.how.h}>
    <p><Tx s={O2.how.p} /><Dr /></p>
    <div className="hooks">{[['SessionStart', 'working'], ['UserPromptSubmit', 'working'], ['PostToolUse', 'working'], ['Stop', 'waiting'], ['SessionEnd', 'ended']].map(([e, s]) => <div key={e}><code>{e}</code><SL s={s}>{s === 'waiting' ? 'waiting' : s}</SL></div>)}</div>
  </Blk>
);
const SecQuiet = ({ n, id }) => <Blk n={n} id={id} h={O2.quiet.h}><p>{O2.quiet.p}<Dr /></p><p><SL s="stuck" /></p></Blk>;
const SecLocal = ({ n, id }) => <Blk n={n} id={id} h={O2.local.h}><p>{O2.local.p}<Dr /></p></Blk>;
const SecSetup = ({ n, id }) => (
  <Blk n={n} id={id} h={O2.setup.h}>
    <dl className="kv">
      <dt>port</dt><dd><code>AIDE_OBSERVER_PORT</code> if set, else the first free port in <code>24680–24689</code></dd>
      <dt>data root</dt><dd><div><code>AIDEMD_HOME</code> if set, else</div><div>Windows <code>%USERPROFILE%\.aidemd</code></div><div>macOS <code>~/Library/Application Support/aidemd</code></div><div>Linux <code>~/.local/state/aidemd</code></div></dd>
    </dl>
    {/* Point at the Hooks docs section (after Skills) once it ships from @aidemd-mcp/server — handoff.md §7 */}
    <a className="docslink" href="docs.html#hooks">Hooks — full reference in the docs →</a>
  </Blk>
);

function Close() {
  return (
    <section className="close">
      <h2>{O2.close.h}<Dr /></h2>
      <Install />
    </section>
  );
}

function O2Foot() {
  return (
    <footer className="o2-foot">
      <span>© 2026 TetsuKodai Group LLC · MIT</span>
      <div><a href="docs.html">docs</a><a href="#">github ↗</a><a href="#">npm ↗</a></div>
    </footer>
  );
}

function HeroCopy() {
  return (
    <React.Fragment>
      <div className="o2-k">{O2.kicker}</div>
      <h1 className="o2-h1">{O2.h1}<Dr /></h1>
      <p className="o2-sub">{O2.sub}</p>
      <p className="o2-pain">{O2.pain}<Dr /></p>
      <Install />
      <div className="o2-facts">{O2.facts.map((f) => <span key={f}>{f}</span>)}</div>
    </React.Fragment>
  );
}

Object.assign(window, { O2, O2_NAV, AGENT_REPLIES, O2Nav, Dr, Tx, SI, SL, SL_TEXT, Install, CAP_ALT, Capture, Legend, RailDemo, AgentReply, Blk, SecRail, SecOwn, SecStates, SecHow, SecQuiet, SecLocal, SecSetup, Close, O2Foot, HeroCopy });
