import type { ObserverCopy } from "@/types/observer";

/**
 * Every visible string on /observer lives here; the founder edits wording in
 * this one file. Strings come verbatim from `design-handoff/observer/observer-shared.jsx`
 * (typographic characters ’ “ ” — · ↗ → kept as in the source), with only the
 * approved replacements: the install command, the real HALT/BLOCKED reply
 * format (HALT link token shortened to `…`), the "usually" fact fix on the
 * then-line, the Local and private sentence, and the DRAFT markers removed.
 * Backticks mark inline code and are rendered by `CodeText`.
 */
const observerCopy = {
  meta: {
    title: "the observer · AIDEMD.DEV",
    description:
      "Local. Read-only. One web view across every project on your machine.",
  },
  kicker: "# the observer",
  h1: "Monitor every Claude Code session — see which pipeline phase each one is in.",
  sub: "Local. Read-only. One web view across every project on your machine.",
  pain: "Several agent sessions open at once, and no way to tell which one is blocked waiting for you — or whether two of them are working in the same project.",
  install: "npx -y @aidemd-mcp/server@latest init",
  copyButton: { idle: "copy", done: "copied" },
  then: {
    lead: "then run ",
    command: "/aide",
    trail: " — the observer starts with it, usually at",
    address: "127.0.0.1:24680",
  },
  facts: [
    "no telemetry",
    "no account",
    "MIT · open source",
    "Windows · macOS · Linux",
  ],
  stateLabels: {
    working: "working",
    waiting: "waiting for you",
    ended: "ended · 2h ago",
    halt: "HALT",
    blocked: "BLOCKED",
    stuck: "maybe stuck · quiet 15m",
    end: "end session",
  },
  capture: {
    src1x: "/observer/observer-capture-aidemd.png",
    src2x: "/observer/observer-capture-aidemd@2x.png",
    width: 1440,
    height: 1180,
    alt: "The observer’s home view on one machine: billing-service waiting for you at plan approval, acme-api working at build step 3 of 6, mobile-app quiet 25 minutes and marked maybe stuck in QA, docs-site ended.",
  },
  legend: {
    ariaLabel: "state legend",
    title: "states",
    rows: [
      { state: "working", text: "acting right now" },
      { state: "waiting", text: "stopped; needs you" },
      { state: "stuck", text: "quiet over 15 min" },
      { state: "ended", text: "closed; record kept" },
    ],
    separator: "agent replies, not in the observer",
    replyRows: [
      { state: "halt", text: "second session in a project" },
      { state: "blocked", text: "observer couldn’t start" },
    ],
  },
  rail: {
    heading: "The pipeline rail",
    body: "Each session reports where it is in the work: the phase it is in — spec, plan, build, QA, fix — plus approval gates, plan steps checked and QA verdicts.",
    image: {
      src1x: "/observer/observer-capture-aidemd-rail.png",
      src2x: "/observer/observer-capture-aidemd-rail@2x.png",
      width: 1018,
      height: 64,
      alt: "One pipeline rail: spec, synthesize, plan and plan approval done, research skipped, build running at step 3 of 6, then QA, fix and done pending.",
    },
  },
  own: {
    heading: "One open session per project",
    body: "Before an agent starts, the observer checks whether another session is open in that project.",
    rows: [
      {
        state: "halt",
        text: "If one is, it stops with HALT and names that session, what it was doing and how long it’s been quiet. You choose to end it or close the new one.",
      },
      {
        state: "end",
        text: "Ending only marks a session ended. Nothing is deleted.",
      },
      {
        state: "blocked",
        text: "If the observer can’t start, BLOCKED stops the session, so nothing runs unobserved.",
      },
    ],
    replyHeader: "agent reply · session start",
    replies: {
      halt: {
        word: "HALT",
        rest: ": another session of this project is open. Nothing proceeds until the user approves ending it with aide_observer_end_session, or closes this session.\n- 20261126T052349471Z-5d304a · waiting on the user · quiet 6 min · last activity 2026-11-26T05:38:49.471Z · pipeline proration-on-plan-change · phase plan\nObserver: http://127.0.0.1:24680/p/billing-service-e97500/s/20261126T052349471Z-5d304a?token=…",
      },
      blocked: {
        word: "BLOCKED",
        rest: ": the observer could not start, so nothing proceeds. No port could be bound: 24680 (in use), 24681 (in use), 24682 (in use), 24683 (in use), 24684 (in use), 24685 (in use), 24686 (in use), 24687 (in use), 24688 (in use), 24689 (in use)",
      },
    },
  },
  states: {
    heading: "Working, waiting, ended",
    rows: [
      {
        state: "working",
        text: "The session started, you sent a prompt, or the agent just ran a tool.",
      },
      {
        state: "waiting",
        text: "The agent stopped and is waiting for you. You see it on the page — the observer doesn’t send notifications.",
      },
      {
        state: "ended",
        text: "The session ended. Its record stays.",
        label: "ended",
      },
    ],
  },
  how: {
    heading: "How it knows",
    body: "AIDE’s install and upgrade wire `aidemd-mcp hook` into Claude Code on five events — no extra config. Hooks give real-time signals that watching session files can’t; they print nothing and never fail or block the agent.",
    hooks: [
      { event: "SessionStart", state: "working", label: "working" },
      { event: "UserPromptSubmit", state: "working", label: "working" },
      { event: "PostToolUse", state: "working", label: "working" },
      { event: "Stop", state: "waiting", label: "waiting" },
      { event: "SessionEnd", state: "ended", label: "ended" },
    ],
  },
  quiet: {
    heading: "Quiet for 15 minutes",
    body: "A session quiet for more than 15 minutes is marked “maybe stuck”. Quiet isn’t proof of a crash, so it is never ended for being quiet.",
  },
  local: {
    heading: "Local and private",
    body: "It serves on 127.0.0.1, so your session data stays on your machine; an access token guards who can open it. No telemetry, no account. It’s read-only: it can’t change a session.",
  },
  setup: {
    heading: "Setup",
    port: {
      label: "port",
      value: "`AIDE_OBSERVER_PORT` if set, else the first free port in `24680–24689`",
    },
    dataRoot: {
      label: "data root",
      lines: [
        "`AIDEMD_HOME` if set, else",
        "Windows `%USERPROFILE%\\.aidemd`",
        "macOS `~/Library/Application Support/aidemd`",
        "Linux `~/.local/state/aidemd`",
      ],
    },
    docsLink: {
      label: "Hooks — full reference in the docs →",
      href: "/docs/hooks/index/",
    },
  },
  close: {
    heading: "Start a session with /aide and the observer is there.",
  },
} as const satisfies ObserverCopy;

export default observerCopy;
