/** The seven state-label kinds the /observer page renders. `end` is the "end session" label. */
export type ObserverState =
  | "working"
  | "waiting"
  | "stuck"
  | "ended"
  | "end"
  | "halt"
  | "blocked";

export type AgentReplyKind = "halt" | "blocked";

/** `word` renders red bold; `rest` follows it verbatim, including `\n` line breaks. */
export type AgentReply = { word: "HALT" | "BLOCKED"; rest: string };

/** `label` overrides the default label for that state. */
export type StateRow = { state: ObserverState; text: string; label?: string };

export type HookEvent =
  | "SessionStart"
  | "UserPromptSubmit"
  | "PostToolUse"
  | "Stop"
  | "SessionEnd";

export type HookCell = { event: HookEvent; state: ObserverState; label: string };

export type PageImage = {
  src1x: string;
  src2x: string;
  width: number;
  height: number;
  alt: string;
};

/** Renders as `<span>{lead}<b>{command}</b>{trail}</span><code>{address}</code>`. */
export type InstallThen = {
  lead: string;
  command: string;
  trail: string;
  address: string;
};

/** Strings containing inline code use backticks as delimiters; the observer module renders them. */
export type ObserverCopy = {
  meta: { title: string; description: string };
  kicker: string;
  h1: string;
  sub: string;
  pain: string;
  install: string;
  copyButton: { idle: string; done: string };
  then: InstallThen;
  facts: readonly string[];
  stateLabels: Record<ObserverState, string>;
  capture: PageImage;
  legend: {
    ariaLabel: string;
    title: string;
    rows: readonly StateRow[];
    separator: string;
    replyRows: readonly StateRow[];
  };
  rail: { heading: string; body: string; image: PageImage };
  own: {
    heading: string;
    body: string;
    rows: readonly StateRow[];
    replyHeader: string;
    replies: Record<AgentReplyKind, AgentReply>;
  };
  states: { heading: string; rows: readonly StateRow[] };
  how: { heading: string; body: string; hooks: readonly HookCell[] };
  quiet: { heading: string; body: string };
  local: { heading: string; body: string };
  setup: {
    heading: string;
    port: { label: string; value: string };
    dataRoot: { label: string; lines: readonly string[] };
    docsLink: { label: string; href: string };
  };
  close: { heading: string };
};
