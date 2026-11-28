import type { LearnCopy } from "@/types/learn";

/**
 * The /learn page for "open source agentic sdlc framework": intent-driven AIDE
 * (aidemd) mapped onto the classic lifecycle phases, with only the
 * founder-verified open-source facts (MIT, local, no account, no telemetry).
 * Drafted from the SEO/AEO research (query rank 6 and 9, the contested
 * "agentic SDLC" definition) and the shipped command docs; every fact the
 * sources do not settle ships as a visible `[VERIFY]` marker. One record holds
 * every word the page, its structured data and its markdown copy show.
 */
const openSourceAgenticSdlcFramework: LearnCopy = {
  slug: "open-source-agentic-sdlc-framework",
  status: "draft",
  title: "Open source agentic SDLC framework: intent-driven AIDE",
  description:
    "Intent-driven AIDE (aidemd) is an MIT-licensed open source agentic SDLC framework. See which pipeline stage covers each lifecycle phase, from requirements on.",
  h1: "An open source agentic SDLC framework: intent-driven AIDE",
  answer: [
    {
      kind: "text",
      text: "AIDE (intent-driven, aidemd) is an open source agentic SDLC framework: it runs the software lifecycle as a pipeline of specialised AI agents in Claude Code, each working from a written intent spec instead of a chat prompt. The agents hand work to each other through files, and a person approves the plan before any code is built. The code is MIT licensed and runs locally.",
    },
  ],
  sections: [
    {
      id: "stage-to-phase",
      heading: "Pipeline stages mapped to SDLC phases",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "The pipeline has seven stages: spec, research, synthesize, plan, build, QA and fix. Research and synthesize are skipped when a feature does not need them. Read against the classic lifecycle, the stages cover five phases.",
            },
          ],
        },
        {
          kind: "list",
          items: [
            [
              {
                kind: "text",
                text: "Requirements: spec (aide-spec-writer) writes the intent spec, a contract of intent plus desired and undesired outcomes. Research (aide-domain-expert) adds domain knowledge when it is missing.",
              },
            ],
            [
              {
                kind: "text",
                text: "Design: synthesize (aide-strategist) writes how the modules interact. Plan (aide-architect) writes plan.aide, with folder structure and ordered steps, then waits for approval.",
              },
            ],
            [
              {
                kind: "text",
                text: "Implementation: build (aide-implementor) executes the approved plan, checking off each step.",
              },
            ],
            [
              {
                kind: "text",
                text: "Testing: build writes tests for the outcomes. QA (aide-qa) compares real output with them and records the gaps in todo.aide.",
              },
            ],
            [
              {
                kind: "text",
                text: "Maintenance: fix works one todo.aide item per session. Align rechecks specs after outcomes change, and refactor audits working code against the coding playbook.",
              },
            ],
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Deployment, release and operations have no stage, so the pipeline does not claim them.",
            },
          ],
        },
      ],
    },
    {
      id: "why-intent-specs-keep-agents-aligned",
      heading: "Why intent specs keep agents aligned",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "In intent-driven AIDE, every stage works from the same written contract, the intent spec, rather than from a chat history. Each agent starts in a fresh context and receives its input through files: the spec, plan.aide, todo.aide and brain notes. Nothing a previous agent said has to survive.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "The spec's desired and undesired outcomes are the standard downstream. The plan traces each step to the spec, build writes tests for the outcomes, and QA checks the result against them, flagging output that is technically valid but violates intent.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Alignment holds through later changes too. Specs form a tree in which each child narrows its parent's intent. When outcomes change, the aligner compares every child against its ancestors and reports contradictions, and an edited spec returns to unreviewed until it is checked again. ",
            },
            {
              kind: "link",
              text: "Cascading alignment",
              href: "/docs/methodology/cascading-alignment/",
            },
            { kind: "text", text: " describes the protocol in full." },
          ],
        },
      ],
    },
    {
      id: "open-source-facts",
      heading: "What open source means for this framework",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "AIDE (intent-driven, aidemd) is open source under the MIT license. The code is at ",
            },
            {
              kind: "link",
              text: "github.com/aidemd-mcp/server",
              href: "https://github.com/aidemd-mcp/server",
            },
            { kind: "text", text: " and the package is " },
            {
              kind: "link",
              text: "@aidemd-mcp/server on npm",
              href: "https://www.npmjs.com/package/@aidemd-mcp/server",
            },
            {
              kind: "text",
              text: ". The license, the code and the package are public, so anyone can read what runs on their machine. The commands and agents install into a project's Claude Code folders. AIDE (intent-driven) runs locally on Windows, macOS and Linux, needs no account and sends no telemetry.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "The optional observer follows the same local rule: it is read-only and listens on 127.0.0.1 behind a token, and one observer per user covers every project. Hooks that report session state work with Claude Code only. Installing or upgrading the package wires them without extra configuration, and there are no desktop notifications.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Beyond these facts, this page states nothing about community size, adoption, a hosted service or governance.",
            },
          ],
        },
      ],
    },
    {
      id: "no-settled-definition",
      heading: "Agentic SDLC has no settled definition",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Sonar, Jellyfish, Red Hat, Cognizant and Forrester each define agentic SDLC differently. The common thread is AI agents working across lifecycle stages, with people approving at checkpoints.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "That reading is the one used on this page. In intent-driven AIDE the agents work across the stages above, and the user approves the plan before build starts. Other readings stress other things, so compare how each framework maps its stages to the phases you care about. Whether a framework is open source is a separate question from whether its agents cover the lifecycle, so judge each on its own terms.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "AIDE (aidemd) is one open source option among others. Searches for the phrase also return an agentic-sdlc package on PyPI and the AIWG sdlc-complete framework [VERIFY].",
            },
          ],
        },
      ],
    },
    {
      id: "glossary",
      heading: "Glossary: agentic SDLC",
      blocks: [
        {
          kind: "glossary",
          terms: [
            {
              id: "agentic-sdlc",
              term: "Agentic SDLC",
              definition: [
                {
                  kind: "text",
                  text: "A software development lifecycle in which AI agents do the work of its stages, from requirements to maintenance, with people approving at checkpoints. The phrase has no single standard definition.",
                },
              ],
            },
            {
              id: "open-source-framework",
              term: "Open source agentic SDLC framework",
              definition: [
                {
                  kind: "text",
                  text: "A freely licensed set of commands, agents and conventions that runs those stages. Intent-driven AIDE (aidemd) is one, under the MIT license. The license decides who may read, change and share the code.",
                },
              ],
            },
            {
              id: "intent-spec",
              term: "Intent spec",
              definition: [
                {
                  kind: "text",
                  text: "A short .aide file holding a module's intent and its desired and undesired outcomes, which every later stage works from. ",
                },
                {
                  kind: "link",
                  text: "Read the intent spec doc",
                  href: "/docs/methodology/aide-spec/",
                },
                { kind: "text", text: "." },
              ],
            },
            {
              id: "cascading-alignment",
              term: "Cascading alignment",
              definition: [
                {
                  kind: "text",
                  text: "The check that each child spec's outcomes stay consistent with its ancestors' outcomes, so intent does not drift as specs multiply. ",
                },
                {
                  kind: "link",
                  text: "Read the cascading alignment doc",
                  href: "/docs/methodology/cascading-alignment/",
                },
                { kind: "text", text: "." },
              ],
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is an open source agentic SDLC framework?",
      answer: [
        {
          kind: "text",
          text: "An open source agentic SDLC framework is a freely licensed set of tools that runs software lifecycle stages with AI agents, from requirements through maintenance. AIDE (intent-driven, aidemd) is one: its agents work from written intent specs, under the MIT license.",
        },
      ],
    },
    {
      question: "Is intent-driven AIDE open source, and under what license?",
      answer: [
        {
          kind: "text",
          text: "Yes. AIDE (intent-driven, aidemd) is open source under the MIT license, with its code on GitHub at aidemd-mcp/server and its package on npm as @aidemd-mcp/server.",
        },
      ],
    },
    {
      question: "Does intent-driven AIDE need an account or send telemetry?",
      answer: [
        {
          kind: "text",
          text: "No. AIDE (intent-driven, aidemd) needs no account and sends no telemetry. It runs locally on Windows, macOS and Linux.",
        },
      ],
    },
    {
      question: "Which SDLC phases does the intent-driven AIDE pipeline cover?",
      answer: [
        {
          kind: "text",
          text: "The aidemd pipeline covers requirements, design, implementation, testing and maintenance. Spec and research cover requirements, synthesize and plan cover design, build covers implementation, build and QA cover testing, and fix, align and refactor cover maintenance. Deployment and operations have no stage.",
        },
      ],
    },
    {
      question: "How do intent specs keep agents aligned?",
      answer: [
        {
          kind: "text",
          text: "In intent-driven AIDE, an intent spec records a module's intent and its desired and undesired outcomes, and every stage works from it. The plan traces each step to the spec, QA checks the code against the outcomes, and the aligner rechecks child specs against their ancestors when outcomes change.",
        },
      ],
    },
    {
      question: "Is intent-driven AIDE the only open source agentic SDLC framework?",
      answer: [
        {
          kind: "text",
          text: "No. Agentic SDLC has no single standard definition, and other open source projects use the phrase. AIDE (intent-driven, aidemd) is one option among them.",
        },
      ],
    },
  ],
  related: [
    {
      label: "Intent-driven engineering: the definition",
      href: "/learn/intent-driven-engineering/",
    },
    {
      label: "The Claude Code subagents pipeline, stage by stage",
      href: "/learn/claude-code-subagents-pipeline/",
    },
    { label: "The aidemd documentation", href: "/docs/" },
  ],
};

export default openSourceAgenticSdlcFramework;
