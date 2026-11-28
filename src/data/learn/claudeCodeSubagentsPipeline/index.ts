import type { InlineRun, LearnCopy } from "@/types/learn";

/** A plain run of prose. */
function text(value: string): InlineRun {
  return { kind: "text", text: value };
}

/** A link run; `href` is a site path with a trailing slash. */
function link(label: string, href: string): InlineRun {
  return { kind: "link", text: label, href };
}

/**
 * The words of /learn/claude-code-subagents-pipeline/. Drafted only from the
 * shipped package docs (`/aide`, the stage commands, the pipeline agents, the
 * hooks reference) and the founder-verified observer facts; the founder reviews
 * the page live and edits this record alone to change any word on it.
 */
const claudeCodeSubagentsPipeline: LearnCopy = {
  slug: "claude-code-subagents-pipeline",
  status: "draft",
  title: "Claude Code subagents pipeline: spec to QA, step by step",
  description:
    "How an intent-driven AIDE pipeline runs spec, research, synthesize, plan, build, QA and fix as Claude Code subagents that hand off through files.",
  h1: "Claude Code subagents pipeline: from spec to QA",
  answer: [
    text(
      "A Claude Code subagents pipeline is a chain of separate agents, each started with fresh context to do one stage of the work and to hand its result to the next through files rather than chat memory. In intent-driven AIDE the stages are spec, research, synthesize, plan, build, QA and fix. This page walks each stage, the agent behind it and what it hands on.",
    ),
  ],
  sections: [
    {
      id: "how-the-pipeline-runs",
      heading: "How a Claude Code subagents pipeline runs",
      blocks: [
        {
          kind: "paragraph",
          text: [
            text(
              "You start it by typing /aide in Claude Code. That command is a router: it opens the observer session, then hands your request to the aide skill, which drives the stages. They run in a fixed order: spec, research, synthesize, plan, build, QA and fix. Each stage is a separate subagent that starts with fresh context, so no stage inherits the chat of the one before it. The ",
            ),
            link("commands docs", "/docs/commands/"),
            text(" list every stage command."),
          ],
        },
        {
          kind: "paragraph",
          text: [
            text(
              "What passes between stages is files. The spec writer leaves a .aide intent spec, the strategist a brief.aide, the architect a plan.aide and the QA agent a todo.aide; the research stage leaves notes in the brain. The next agent reads those files instead of a conversation, so the state of the work lives in files you can open and read.",
            ),
          ],
        },
        {
          kind: "paragraph",
          text: [
            text(
              "Two stages are optional. Research and synthesize are skipped by default and run only when a feature needs them, as the two sections on those stages explain.",
            ),
          ],
        },
      ],
    },
    {
      id: "spec",
      heading: "Spec: aide-spec-writer writes the intent",
      blocks: [
        {
          kind: "paragraph",
          text: [
            text(
              "The first stage is /aide:spec, run by the aide-spec-writer agent in a fresh context. The orchestrator interviews you and passes what it learned to the agent in a prompt, because the agent does not talk to you itself. The agent then writes the frontmatter of a .aide intent spec: the scope, a one-sentence description, an intent paragraph of at most 100 words, and three to six desired and three to six undesired outcomes, each of them falsifiable.",
            ),
          ],
        },
        {
          kind: "paragraph",
          text: [
            text(
              "It hands on that .aide file and two yes-or-no signals: whether research is needed, and whether strategy is needed. Research is for a domain nobody on the team knows yet. Strategy is for a feature that is itself a pipeline, with several modules handing off in a fixed order. When both answers are no, the pipeline goes straight to plan.",
            ),
          ],
        },
      ],
    },
    {
      id: "research",
      heading: "Research: aide-domain-expert fills the brain",
      blocks: [
        {
          kind: "paragraph",
          text: [
            text(
              "Research is optional. /aide:research runs only when the module needs domain knowledge the team does not have, and it stops at once when the brain already covers the topic. The aide-domain-expert agent starts fresh, gathers sources, then saves its findings to the brain filed by domain, such as research/local-seo/, and not by project, so other projects can reuse them. Each saved note carries sources with ratings and dates, attributed data points, patterns seen across sources and how any conflict between them was settled.",
            ),
          ],
        },
        {
          kind: "paragraph",
          text: [
            text(
              "It hands on those brain notes. The strategist or the architect reads them instead of asking you again. With no external brain configured, the agent writes a research.aide file beside the spec, which the command doc treats as a weaker fallback.",
            ),
          ],
        },
      ],
    },
    {
      id: "synthesize",
      heading: "Synthesize: aide-strategist writes the hand-offs",
      blocks: [
        {
          kind: "paragraph",
          text: [
            text(
              "Synthesize is also optional. It applies only when the feature is a pipeline: several modules, each doing one thing in a fixed order, handing off through calls, events, a clock or state changes. /aide:synthesize starts the aide-strategist agent in a fresh session. It reads the spec's frontmatter, the pipeline flow the orchestrator captured from you and any research in the brain. It then fills the five body sections of the .aide spec: Context, Strategy, Good examples, Bad examples and References. A partial body is forbidden, so it fills all five or escalates.",
            ),
          ],
        },
        {
          kind: "paragraph",
          text: [
            text(
              "It also writes a sibling brief.aide that records what the spec cannot hold: type shapes, exact strings, contracts between modules and open questions. A self-contained module skips this stage and goes straight to plan.",
            ),
          ],
        },
      ],
    },
    {
      id: "plan",
      heading: "Plan: aide-architect writes the recipe",
      blocks: [
        {
          kind: "paragraph",
          text: [
            text(
              "/aide:plan runs the aide-architect agent in a fresh context. It reads the spec, the brief.aide when synthesize produced one, the coding playbook from the brain and the code already in the module. It then writes plan.aide: a Project Structure tree of every file that will exist, checkboxed steps in cooking order, and the Decisions behind them. Each step lists the playbook entries the builder must read first. The architect writes no code, and when the spec is ambiguous it stops and escalates instead of inventing an answer.",
            ),
          ],
        },
        {
          kind: "paragraph",
          text: [
            text(
              "Then the pipeline pauses. The plan and any brief start as proposed, and nothing is built until you approve them. If you ask for changes, the architect revises the plan, and a revised plan returns to proposed for another approval.",
            ),
          ],
        },
      ],
    },
    {
      id: "build",
      heading: "Build: aide-implementor runs the steps",
      blocks: [
        {
          kind: "paragraph",
          text: [
            text(
              "/aide:build starts only when the plan reads approved; the agent checks that itself and stops when it does not. The orchestrator sends one fresh aide-implementor per numbered step, and the lettered sub-steps of one number, such as 3a to 3c, share one agent. Each implementor loads the playbook entries on its step's Read line, writes the code and the tests, ticks the step's checkbox in plan.aide, then runs the tests and the type checker.",
            ),
          ],
        },
        {
          kind: "paragraph",
          text: [
            text(
              "The orchestrator confirms the box is ticked and that every Read entry was reported as loaded before it moves on. A step that is ambiguous goes back to the architect and is never guessed. What the build hands on is the code, its tests and a plan with its boxes ticked.",
            ),
          ],
        },
      ],
    },
    {
      id: "qa",
      heading: "QA: aide-qa checks the outcomes",
      blocks: [
        {
          kind: "paragraph",
          text: [
            text(
              "/aide:qa runs the aide-qa agent, in a fresh context, against the spec's outcomes. It asks two questions: does the output meet every desired outcome, and does it trip any undesired one. It also looks for hidden failures, such as output that passes its tests but breaks the intent, or code that drifted from brief.aide. It reads brief.aide and never changes it.",
            ),
          ],
        },
        {
          kind: "paragraph",
          text: [
            text(
              "The result is a todo.aide beside the spec. Each issue has a checkbox, a file and line, a one-line description, the outcome it breaks and a misalignment tag such as plan-gap or implementation-drift; a retro section records which stage lost the intent. The agent does not propose fixes. When it finds no issues, the pipeline skips the fix stage and goes to completion.",
            ),
          ],
        },
      ],
    },
    {
      id: "fix",
      heading: "Fix: aide-implementor takes one item",
      blocks: [
        {
          kind: "paragraph",
          text: [
            text(
              "The fix loop is autonomous. The orchestrator reads todo.aide, approves the list itself and routes each item by its misalignment tag. An implementation-drift or test-gap item goes straight to a fresh aide-implementor in fix mode. A plan-gap or strategy-gap item goes to aide-architect first, to amend the plan. It interrupts you only for a decision, such as a change to what an outcome promises.",
            ),
          ],
        },
        {
          kind: "paragraph",
          text: [
            text(
              "/aide:fix takes exactly one unchecked item per session, checks that nothing else regressed, ticks the box, commits the fix on its own and ends. The next item gets a new session. After each fix aide-qa re-validates the module, and the loop repeats until todo.aide is clear. A defect the feature did not cause is not fixed in the loop: it stays unchecked with a one-line note and is offered to you as a task at the end.",
            ),
          ],
        },
      ],
    },
    {
      id: "orchestration",
      heading: "AI coding agent orchestration: how /aide coordinates the agents",
      blocks: [
        {
          kind: "paragraph",
          text: [
            text(
              "In AI coding agent orchestration, one coordinator decides which agent works next. Here that coordinator is the /aide orchestrator, and it is a dispatcher only: it never writes files or code. Every stage goes to a named agent through Claude Code's Agent tool, and because each agent starts fresh, the delegation prompt carries the context while the files carry the rest. Between stages the orchestrator checks statuses, pauses for your approval of the plan and routes fix items by their tags. The ",
            ),
            link("agents docs", "/docs/agents/"),
            text(
              " describe each agent. The orchestrator does not skip a stage on a hunch: research and synthesize are skipped only when the spec writer's signals and your confirmation say so. Questions about the code go to aide-explorer, a read-only agent. After QA passes, aide-maintainer removes the per-module brief.aide, plan.aide and todo.aide; the project's .aide/session.aide, which records where the pipeline stopped, is never deleted.",
            ),
          ],
        },
      ],
    },
    {
      id: "hooks-and-observer",
      heading: "Hooks and the observer show which stage a session is in",
      blocks: [
        {
          kind: "paragraph",
          text: [
            text(
              "Claude Code runs hooks itself at fixed moments in a session, and intent-driven AIDE listens to five of them through one command, aidemd-mcp hook. Each call records whether the session is working, waiting on the user or ended. A hook prints nothing, never blocks the agent and never fails it. The ",
            ),
            link("Hooks docs", "/docs/hooks/"),
            text(" list the five events."),
          ],
        },
        {
          kind: "paragraph",
          text: [
            text(
              "Hooks report presence only. What a session is doing comes from the agent's own reports, which name its pipeline and phase. ",
            ),
            link("The observer", "/observer/"),
            text(
              " shows that on its pipeline rail, so you can see which stage a session is in. It is a local, read-only web view on 127.0.0.1 behind an access token, one per user, covering every project. It allows one open session per project: a second /aide start is halted until the first ends. A session quiet for 15 minutes shows as maybe stuck.",
            ),
          ],
        },
        {
          kind: "paragraph",
          text: [
            text(
              "Hooks work with Claude Code only. There are no desktop notifications, no telemetry and no account.",
            ),
          ],
        },
      ],
    },
    {
      id: "run-it",
      heading: "Run the pipeline on your own project",
      blocks: [
        {
          kind: "paragraph",
          text: [
            text(
              "Install intent-driven AIDE from the root of your project, then start Claude Code in that folder.",
            ),
          ],
        },
        { kind: "code", lang: "bash", code: "npx -y @aidemd-mcp/server@latest init" },
        {
          kind: "paragraph",
          text: [
            text(
              "Then type /aide followed by what you want built. The orchestrator opens the observer session and starts the observer. It stops when another session of the project is open or the observer cannot start, and otherwise runs the stages above. The install wires the hooks too, with no extra configuration. When a stage needs a decision from you, the orchestrator asks, and the plan always waits for your approval. Everything stays on your machine: the observer is local, with no telemetry and no account. Intent-driven AIDE is MIT-licensed and open source, and the observer runs on Windows, macOS and Linux. The ",
            ),
            link("MCP server guide", "/learn/mcp-server-for-development-workflow/"),
            text(" covers the install in full."),
          ],
        },
      ],
    },
  ],
  related: [
    { label: "The observer", href: "/observer/" },
    { label: "Hooks reference", href: "/docs/hooks/" },
    { label: "MCP server for development workflow", href: "/learn/mcp-server-for-development-workflow/" },
    { label: "Intent-driven engineering", href: "/learn/intent-driven-engineering/" },
  ],
};

export default claudeCodeSubagentsPipeline;
