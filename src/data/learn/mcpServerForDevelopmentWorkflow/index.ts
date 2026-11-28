import type { LearnCopy } from "@/types/learn";

/**
 * Copy record for /learn/mcp-server-for-development-workflow/: the install
 * quickstart for @aidemd-mcp/server. Drafted from the shipped tools reference,
 * the /aide command and skill files, and the aidemd-mcp facts recorded in the
 * session record. Every fact those sources do not settle ships as a visible
 * [VERIFY] marker. Marked draft until the founder reviews the page live.
 */
const mcpServerForDevelopmentWorkflow: LearnCopy = {
  slug: "mcp-server-for-development-workflow",
  status: "draft",
  title: "MCP server for development workflow: install @aidemd-mcp/server",
  description:
    "Install the @aidemd-mcp/server MCP server with one command, run /aide for the first time, and see the tools it exposes to your AI coding agent.",
  h1: "MCP server for development workflow: install and first run",
  answer: [
    {
      kind: "text",
      text: "@aidemd-mcp/server is the MCP server for aidemd, the intent-driven engineering method. An MCP server gives an AI coding agent tools it can call; this one lets agents find and read a project's .aide intent specs, check their layout and install aidemd's files, so each session works from the same specs.",
    },
  ],
  sections: [
    {
      id: "install",
      heading: "Install the MCP server for your development workflow",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Run one command from the root of the project you want to set up. It fetches the latest @aidemd-mcp/server release with npx and runs its init step in the folder you run it from.",
            },
          ],
        },
        { kind: "code", lang: "bash", code: "npx -y @aidemd-mcp/server@latest init" },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "The init step installs the server globally with npm i -g @aidemd-mcp/server and writes the project's .mcp.json entry as the global aidemd-mcp command, so later sessions start the server without npx. The @latest tag resolves to the newest published release each time you run it.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "To wire it by hand instead, run npm i -g @aidemd-mcp/server, then claude mcp add aide -- aidemd-mcp. The server runs under the name aide, so agents call its tools as mcp__aide__ followed by the tool name. Start a new session afterwards so the client loads the entry. [VERIFY]",
            },
          ],
        },
      ],
    },
    {
      id: "what-install-sets-up",
      heading: "What the MCP server install sets up in your project",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "The documentation for the aide_init tool lists what an install writes, one category at a time, in this order:",
            },
          ],
        },
        {
          kind: "list",
          items: [
            [{ kind: "text", text: "the methodology docs, under .aide/docs" }],
            [{ kind: "text", text: "the tool and hook reference, under .aide/reference" }],
            [{ kind: "text", text: "slash commands, agents and skills" }],
            [{ kind: "text", text: "the MCP entry in the project's config" }],
            [{ kind: "text", text: "a brain config, created only when none exists" }],
            [{ kind: "text", text: "IDE support" }],
            [{ kind: "text", text: "Claude Code hooks" }],
            [{ kind: "text", text: "a README badge" }],
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "A category with only new files is written without asking. A category that would overwrite a file waits for your yes, and an existing brain config or session record is never replaced. Framework, MCP merge, brain folder and IDE choice are always asked. This list comes from the aide_init tool docs; whether the init command writes exactly the same set is [VERIFY].",
            },
          ],
        },
      ],
    },
    {
      id: "first-run",
      heading: "First run: what happens when you type /aide",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "In a session in the project, type /aide. The command is a router: it invokes the observer skill first, then the orchestrator skill. The orchestrator boots before it reads your request:",
            },
          ],
        },
        {
          kind: "list",
          items: [
            [{ kind: "text", text: "It calls aide_info, the boot-time report." }],
            [
              {
                kind: "text",
                text: "If the brain is not wired, it stops and hands off to /aide:brain config.",
              },
            ],
            [
              {
                kind: "text",
                text: "If the server or the project's files are behind, it asks whether to upgrade.",
              },
            ],
            [
              {
                kind: "text",
                text: "It reads the methodology docs, runs aide_discover and reads .aide/session.aide.",
              },
            ],
            [
              {
                kind: "text",
                text: "It lists the project's open kanban tasks, and says so if the board is unreachable.",
              },
            ],
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Only then does it act on your request, and it only dispatches: it delegates the work to subagents. What follows boot is the spec-to-QA pipeline, covered on the ",
            },
            {
              kind: "link",
              text: "Claude Code subagents pipeline",
              href: "/learn/claude-code-subagents-pipeline/",
            },
            { kind: "text", text: " page." },
          ],
        },
      ],
    },
    {
      id: "tools",
      heading: "The tools this MCP server exposes",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "The @aidemd-mcp/server package runs as an MCP server named aide, and agents call each tool as mcp__aide__ followed by its name. It exposes fourteen tools, listed here as the tools reference lists them:",
            },
          ],
        },
        {
          kind: "list",
          items: [
            [{ kind: "text", text: "aide_info: boot-time report" }],
            [{ kind: "text", text: "aide_discover: maps where specs live" }],
            [{ kind: "text", text: "aide_read: reads one .aide file" }],
            [{ kind: "text", text: "aide_inspect: a code symbol's documentation and signature" }],
            [{ kind: "text", text: "aide_validate: health check of the spec layout" }],
            [{ kind: "text", text: "aide_scaffold: creates a blank working file" }],
            [{ kind: "text", text: "aide_frontmatter: reads or moves alignment and status" }],
            [{ kind: "text", text: "aide_cleanup: removes a closed module's plan files" }],
            [{ kind: "text", text: "aide_brain: reads the brain config" }],
            [{ kind: "text", text: "aide_init: installs into a project" }],
            [{ kind: "text", text: "aide_upgrade: applies confirmed upgrades" }],
            [{ kind: "text", text: "aide_observer_start: starts the observer" }],
            [{ kind: "text", text: "aide_observer_event: reports one action" }],
            [{ kind: "text", text: "aide_observer_end_session: ends another open session" }],
          ],
        },
        {
          kind: "paragraph",
          text: [
            { kind: "text", text: "Each tool has its own page covering when to call it, what it takes and what it returns, in the " },
            { kind: "link", text: "tools reference", href: "/docs/tools/" },
            { kind: "text", text: "." },
          ],
        },
      ],
    },
    {
      id: "supported-clients",
      heading: "Which MCP clients the server supports",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "The install step takes a framework option with four values: claude, cursor, windsurf and copilot. It overrides detection of which one a project uses. For VS Code, the install returns a command for the agent to run. The manual route above uses claude mcp add, a Claude Code command.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "The hooks that feed the observer are Claude Code only, and the install wires them with no extra configuration. Whether Cursor, Windsurf and Copilot run the server and its commands to the same extent as Claude Code is [VERIFY]. Until the docs settle it, this page names no other client as supported.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "The package is open source under the MIT license. It runs locally, needs no account, sends no telemetry, and runs on Windows, macOS and Linux.",
            },
          ],
        },
      ],
    },
  ],
  related: [
    {
      label: "Claude Code subagents pipeline",
      href: "/learn/claude-code-subagents-pipeline/",
    },
    { label: "aidemd docs", href: "/docs/" },
  ],
};

export default mcpServerForDevelopmentWorkflow;
