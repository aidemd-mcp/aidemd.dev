import type { LearnCopy } from "@/types/learn";

/**
 * The one copy record for /learn/intent-driven-engineering/: the definition
 * page for intent-driven engineering. It opens with the definition, names
 * intent-driven development in its headings, holds the glossary whose term ids
 * other pages link to by anchor, and answers the questions searchers ask.
 * Drafted from the SEO/AEO research and the canonical methodology docs; every
 * fact a source does not state ships as a visible [VERIFY] marker. Status stays
 * "draft" until the founder has reviewed the page live.
 */
const intentDrivenEngineering: LearnCopy = {
  slug: "intent-driven-engineering",
  status: "draft",
  title: "What is intent-driven engineering? A plain definition",
  description:
    "Intent-driven engineering makes a short written intent the contract that planning, building and QA work from. Definition, glossary, criticism and FAQ.",
  h1: "What is intent-driven engineering?",
  answer: [
    {
      kind: "text",
      text: "Intent-driven engineering is a way of building software in which a short written statement of intent, covering what a module is for and what success and failure look like, is the contract that planning, building and testing all work from. When the code drifts from the intent, the code is wrong, and the code is what gets fixed.",
    },
  ],
  sections: [
    {
      id: "what-it-means",
      heading: "What intent-driven engineering means in practice",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Intent-driven engineering puts the reason for a piece of software ahead of its code, its tests and its prompts. Before anything is built, the intent is written down in a short document that lives beside the code it governs. That document says what the module is for, what a good result looks like and which almost-right results count as failures. Architects plan from it, implementors build from it and QA checks the result against it. When the intent changes, the code changes. When the code and the intent disagree, the code is wrong.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "The code is treated as the current expression of the intent, not as the durable asset. The intent persists, and the code is rewritten when the intent moves.",
            },
          ],
        },
      ],
    },
    {
      id: "intent-driven-development",
      heading: "Intent-driven development: the working loop",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Intent-driven development is the day-to-day loop that follows from that idea. The intent is written first, from an interview with the person who owns the work. One agent turns it into a plan. Another builds from the plan, and a third checks the result against the spec's outcomes. Each agent starts with fresh context, so what passes between steps is a file, not a conversation. QA does not ask whether the code looks right. It asks whether the code satisfies every desired outcome and trips none of the undesired ones, and anything it finds goes into a to-do list that is fixed one item at a time. Build starts only once the plan is approved. AIDE (Autonomous Intent-Driven Engineering) is one open source implementation of this loop.",
            },
          ],
        },
      ],
    },
    {
      id: "glossary",
      heading: "Glossary of intent-driven engineering terms",
      blocks: [
        {
          kind: "glossary",
          terms: [
            {
              id: "intent-spec",
              term: "Intent spec",
              definition: [
                {
                  kind: "text",
                  text: "A short file, named .aide, that sits in the folder of the module it governs. It holds a purpose of at most 100 words plus desired and undesired outcomes. ",
                },
                { kind: "link", text: "Intent spec reference", href: "/docs/methodology/aide-spec/" },
                { kind: "text", text: "." },
              ],
            },
            {
              id: "cascading-intent-tree",
              term: "Cascading intent tree",
              definition: [
                {
                  kind: "text",
                  text: "The hierarchy of intent specs in a project: a root spec at .aide/intent.aide and a spec per module below it, each narrowing its parent. An aligner agent checks that no child contradicts an ancestor. ",
                },
                { kind: "link", text: "Cascading alignment", href: "/docs/methodology/cascading-alignment/" },
                { kind: "text", text: "." },
              ],
            },
            {
              id: "outcomes",
              term: "Outcomes",
              definition: [
                {
                  kind: "text",
                  text: "The falsifiable success and failure criteria in an intent spec. Desired outcomes are the target. Undesired outcomes are the tripwire for almost-right results that pass tests. QA measures the code against both lists. ",
                },
                { kind: "link", text: "Outcomes reference", href: "/docs/methodology/aide-spec/" },
                { kind: "text", text: "." },
              ],
            },
            {
              id: "brain",
              term: "Brain",
              definition: [
                {
                  kind: "text",
                  text: "The external, team-shareable knowledge store, such as a personal knowledge base or a team wiki, that holds durable domain research and the coding playbook so neither bloats the repository. ",
                },
                { kind: "link", text: "Brain reference", href: "/docs/methodology/brain-aide/" },
                { kind: "text", text: "." },
              ],
            },
            {
              id: "pipeline-stages",
              term: "Pipeline stages",
              definition: [
                {
                  kind: "text",
                  text: "The ordered phases the orchestrator drives: spec, research, synthesize, plan, build, QA and fix. Research and synthesize run only when a feature needs them. Each phase hands on through files. ",
                },
                { kind: "link", text: "Orchestrator command", href: "/docs/commands/aide/" },
                { kind: "text", text: "." },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "spec-driven-development",
      heading: "Intent-driven engineering and spec-driven development",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "People who search for spec-driven development are often after the same thing: a written artifact that agents work from instead of an ad hoc prompt. Birgitta Böckeler of Thoughtworks split spec-driven development into three levels in an article dated 2025-10-15: spec-first, spec-anchored and spec-as-source. Kiro, spec-kit and Tessl are the three tools that article compares. There is no standard definition of intent-driven development, and some authors treat spec-driven development as a subset of it. The AIDE repository describes itself as intent-driven development with .aide spec files rather than as spec-driven. In AIDE's vocabulary the unit is the intent spec, a statement of purpose with desired and undesired outcomes. For a side-by-side view of the two, read ",
            },
            {
              kind: "link",
              text: "spec-driven versus intent-driven development",
              href: "/learn/spec-driven-vs-intent-driven-development/",
            },
            { kind: "text", text: "." },
          ],
        },
      ],
    },
    {
      id: "waterfall-criticism",
      heading: "Is intent-driven development just waterfall with more markdown?",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "The criticism is fair to raise. Böckeler found that the spec-driven tools she examined, Kiro, spec-kit and Tessl, produced a lot of markdown to review and a false sense of control, and that they were overkill for small tasks. Commentators call the approach waterfall revisited, and a Scrum.org post replies that it is not waterfall unless it is used that way. Intent-driven engineering answers part of this. Its specs are capped: an intent is at most 100 words, and a spec file aims for about 150 lines. Specs are written iteratively and change as outcomes change, and a feature that needs no research or synthesis skips those stages. It does not answer all of it. An intent spec is still text that a person must read and keep current, and no source reviewed for this page measures whether short specs reduce review load [VERIFY].",
            },
          ],
        },
      ],
    },
    {
      id: "how-to-start",
      heading: "How to start with intent-driven engineering",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Start with the root intent: one short spec for the whole project, stating its purpose and the outcomes every part must serve. In an AIDE (Autonomous Intent-Driven Engineering) project, the first run of the /aide command interviews you and writes it to .aide/intent.aide. Then agree the folder structure before writing any module spec, because a spec's folder is its scope and its parent folder's spec is the intent it narrows. Write each module's spec next to its code, parents before children. Plan, build and check each module against its own outcomes. Installing AIDE adds the methodology and its agents to a project, and it does not write the project's intent for you. The install command is on the page about the ",
            },
            {
              kind: "link",
              text: "MCP server for development workflow",
              href: "/learn/mcp-server-for-development-workflow/",
            },
            { kind: "text", text: "." },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is intent-driven engineering?",
      answer: [
        {
          kind: "text",
          text: "Intent-driven engineering is a way of building software in which a short written statement of intent is the contract that planning, building and testing work from. The intent says what a module is for and which results count as success or failure, and when the code drifts from it, the code is what gets fixed.",
        },
      ],
    },
    {
      question: "What is the difference between intent-driven and spec-driven development?",
      answer: [
        {
          kind: "text",
          text: "Both put a written artifact in front of the coding agent. There is no standard definition of intent-driven development, and some authors treat spec-driven development as a subset of it. In AIDE (Autonomous Intent-Driven Engineering) the artifact is an intent spec holding a purpose plus desired and undesired outcomes. A full comparison is on the page about ",
        },
        {
          kind: "link",
          text: "spec-driven versus intent-driven development",
          href: "/learn/spec-driven-vs-intent-driven-development/",
        },
        { kind: "text", text: "." },
      ],
    },
    {
      question: "Is intent-driven development just waterfall?",
      answer: [
        {
          kind: "text",
          text: "Critics say spec-driven approaches revisit waterfall and produce too much markdown to review, while a Scrum.org post replies that they are not waterfall unless used that way. Intent-driven engineering keeps specs short, with an intent of at most 100 words, and revises them as outcomes change. Whether this lowers review load is not measured in the sources reviewed [VERIFY].",
        },
      ],
    },
    {
      question: "How do I start with intent-driven engineering?",
      answer: [
        {
          kind: "text",
          text: "Write one short root intent for the project, agree the folder structure, then write a spec for each module next to its code and check the result against its outcomes. AIDE (Autonomous Intent-Driven Engineering) follows this flow: its /aide command interviews you and writes the root intent on the first run.",
        },
      ],
    },
  ],
  related: [
    {
      label: "Spec-driven vs intent-driven development",
      href: "/learn/spec-driven-vs-intent-driven-development/",
    },
    {
      label: "Claude Code subagents pipeline",
      href: "/learn/claude-code-subagents-pipeline/",
    },
    {
      label: "Open source agentic SDLC framework",
      href: "/learn/open-source-agentic-sdlc-framework/",
    },
    { label: "Intent-driven methodology docs", href: "/docs/methodology/" },
    { label: "Intent spec reference", href: "/docs/methodology/aide-spec/" },
  ],
};

export default intentDrivenEngineering;
