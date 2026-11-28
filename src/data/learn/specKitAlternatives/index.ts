import type { LearnCopy } from "@/types/learn";

/**
 * The copy record for /learn/spec-kit-alternatives: a fair, dated comparison of
 * the spec-driven tools searchers weigh against spec-kit, with intent-driven
 * AIDE (aidemd) as one option among nine. Competitor facts come only from the
 * brain note research/seo-aeo/2026-11-25-agentic-sdlc-target-queries-and-competitors.md;
 * any fact that note does not establish ships as `unknown` in the table or as a
 * visible [NEEDS COLLECTION] / [VERIFY] marker in the prose. GitHub figures are
 * entered by hand from the note's GitHub REST API table (retrieved 2026-11-25).
 * Ships as a draft until the founder reviews the page live.
 */
const specKitAlternatives: LearnCopy = {
  slug: "spec-kit-alternatives",
  status: "draft",
  title: "Spec-kit alternatives and spec-kit vs OpenSpec compared",
  description:
    "Spec-kit alternatives compared: spec-kit, OpenSpec, BMAD-METHOD, superpowers, Kiro, Tessl, Agent OS, Task Master and intent-driven AIDE.",
  h1: "Spec-kit alternatives: nine spec-driven development tools compared",
  answer: [
    {
      kind: "text",
      text: "The main spec-kit alternatives are OpenSpec, BMAD-METHOD, superpowers, Kiro, Tessl, Agent OS and Task Master, plus intent-driven AIDE (aidemd) for teams that want the spec kept as short .aide files beside the code. The table compares all nine on what each is, its licence and its GitHub stars as of 2026-11-25, and marks any fact the research does not establish as unknown.",
    },
  ],
  sections: [
    {
      id: "spec-kit-vs-openspec",
      heading: "Spec-kit vs OpenSpec: the comparison searchers run first",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Spec-kit and OpenSpec are the two tools searchers weigh against each other most often. Spec-kit is GitHub's command-line toolkit for spec-driven development; GitHub publishes its own concept page, a launch post on the GitHub blog and a Microsoft Learn training module, and Thoughtworks lists it in its Technology Radar. OpenSpec, from the Fission-AI organisation, is described in its Hacker News listing as a lightweight and configurable AI spec framework.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "On GitHub, spec-kit had 151,401 stars and OpenSpec 75,742 as of 2026-11-25, and both repositories were pushed to that day. Google autocomplete shows spec-kit searched against OpenSpec, superpowers, Kiro and Claude Code. Neither figure says which tool fits a given team better. This page does not compare their day-to-day workflows; each project's own README is the place for that.",
            },
          ],
        },
      ],
    },
    {
      id: "reading-the-table",
      heading: "How to read the stars, last push and unknown cells",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Every number in the table is a GitHub figure entered by hand from the GitHub REST API on 2026-11-25, never refreshed automatically. Stars are an adoption proxy with distortions: they reflect distribution and hype cycles rather than usage, and counts grow fast, so treat them as a snapshot. Superpowers has the most stars of the nine, but it is a skills and workflow framework rather than a pure spec-driven tool, so the comparison is not like for like.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Last push shows recent activity and nothing more. A quiet repository is not an abandoned one, and this page makes no claim either way about Task Master or Agent OS. A cell reading unknown means the research behind this page does not establish that fact, so it is left unfilled rather than guessed. Kiro and Tessl show unknown for stars and last push for that reason.",
            },
          ],
        },
      ],
    },
    {
      id: "who-fits-toolkits",
      heading: "Who spec-kit, OpenSpec, BMAD-METHOD and superpowers fit",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Each take uses the terms that tool's own project or users use, drawn from the research. Where the research is silent, the take ships as a marker rather than a guess.",
            },
          ],
        },
        {
          kind: "list",
          items: [
            [
              {
                kind: "text",
                text: "Spec-kit: teams that want GitHub's own toolkit, with an official concept page, a launch post and a Microsoft Learn module to start from. Birgitta Böckeler's comparison treats it as the command-line toolkit of the three she examined.",
              },
            ],
            [
              {
                kind: "text",
                text: "OpenSpec: people who want a lightweight, configurable spec framework, which is how its Hacker News listing describes it.",
              },
            ],
            [
              {
                kind: "text",
                text: "BMAD-METHOD: [NEEDS COLLECTION] how its own users describe the people it suits. The research records its GitHub activity but not its workflow.",
              },
            ],
            [
              {
                kind: "text",
                text: "Superpowers: people who want a skills and workflow framework rather than a pure spec-driven tool, which is what the research calls it.",
              },
            ],
          ],
        },
      ],
    },
    {
      id: "who-fits-others",
      heading: "Who Kiro, Tessl, Agent OS, Task Master and intent-driven AIDE fit",
      blocks: [
        {
          kind: "list",
          items: [
            [
              {
                kind: "text",
                text: "Kiro: people who want an AWS-built, VS Code-based IDE with a requirements, design and tasks flow.",
              },
            ],
            [
              {
                kind: "text",
                text: "Tessl: people drawn to spec-as-source, the level Böckeler found only Tessl aiming at. Its framework was in private beta when she compared it, so its current availability is [VERIFY].",
              },
            ],
            [
              {
                kind: "text",
                text: "Agent OS: [NEEDS COLLECTION] how its own users describe the people it suits. A claim that it was downsized is unverified community commentary, so this page does not repeat it.",
              },
            ],
            [
              {
                kind: "text",
                text: "Task Master: [NEEDS COLLECTION] how its own users describe the people it suits. The research records only its repository and its last push.",
              },
            ],
            [
              { kind: "text", text: "Intent-driven AIDE (aidemd): teams that want the spec kept as short " },
              {
                kind: "link",
                text: ".aide intent files",
                href: "/docs/methodology/aide-spec/",
              },
              {
                kind: "text",
                text: " beside the code under an MIT licence, as described in ",
              },
              {
                kind: "link",
                text: "spec-driven vs intent-driven development",
                href: "/learn/spec-driven-vs-intent-driven-development/",
              },
              { kind: "text", text: " and " },
              {
                kind: "link",
                text: "what intent-driven engineering is",
                href: "/learn/intent-driven-engineering/",
              },
              {
                kind: "text",
                text: ". It is one option here, not the only right answer, and it is a different project from the Agent-Informed Development Engineering methodology of a similar name.",
              },
            ],
          ],
        },
      ],
    },
  ],
  comparison: {
    caption:
      "Spec-kit alternatives compared on what each tool is, its licence, whether it aims at spec-as-source, GitHub stars and last push. Stars and last push as of 2026-11-25; unknown means the research does not establish it.",
    columns: [
      "Tool",
      "What it is",
      "Aims at spec-as-source",
      "License",
      "GitHub stars",
      "Last push",
    ],
    rows: [
      {
        cells: [
          { text: "spec-kit" },
          { text: "GitHub's command-line toolkit for spec-driven development" },
          { text: "No, per Böckeler's comparison" },
          { text: "unknown" },
          { text: "151,401", asOf: "2026-11-25" },
          { text: "2026-11-25", asOf: "2026-11-25" },
        ],
      },
      {
        cells: [
          { text: "OpenSpec" },
          { text: "Spec framework described as lightweight and configurable" },
          { text: "unknown" },
          { text: "unknown" },
          { text: "75,742", asOf: "2026-11-25" },
          { text: "2026-11-25", asOf: "2026-11-25" },
        ],
      },
      {
        cells: [
          { text: "BMAD-METHOD" },
          { text: "A project in the bmad-code-org GitHub organisation; other facts unknown" },
          { text: "unknown" },
          { text: "unknown" },
          { text: "55,759", asOf: "2026-11-25" },
          { text: "2026-11-25", asOf: "2026-11-25" },
        ],
      },
      {
        cells: [
          { text: "superpowers" },
          { text: "A skills and workflow framework rather than a pure spec-driven tool" },
          { text: "unknown" },
          { text: "unknown" },
          { text: "326,728", asOf: "2026-11-25" },
          { text: "2026-11-24", asOf: "2026-11-25" },
        ],
      },
      {
        cells: [
          { text: "Kiro" },
          { text: "AWS-built, VS Code-based IDE with a requirements, design and tasks flow" },
          { text: "No, per Böckeler's comparison" },
          { text: "unknown" },
          { text: "unknown" },
          { text: "unknown" },
        ],
      },
      {
        cells: [
          { text: "Tessl" },
          { text: "Tessl Framework, in private beta at the time of Böckeler's comparison" },
          { text: "Yes, the only one of the three she compared that aims at it" },
          { text: "unknown" },
          { text: "unknown" },
          { text: "unknown" },
        ],
      },
      {
        cells: [
          { text: "Agent OS" },
          { text: "A project in the buildermethods GitHub organisation; other facts unknown" },
          { text: "unknown" },
          { text: "unknown" },
          { text: "5,640", asOf: "2026-11-25" },
          { text: "2026-10-07", asOf: "2026-11-25" },
        ],
      },
      {
        cells: [
          { text: "Task Master" },
          { text: "The claude-task-master repository by eyaltoledano; other facts unknown" },
          { text: "unknown" },
          { text: "unknown" },
          { text: "28,550", asOf: "2026-11-25" },
          { text: "2026-04-28", asOf: "2026-11-25" },
        ],
      },
      {
        cells: [
          { text: "AIDE (intent-driven, aidemd)" },
          { text: "Intent-driven .aide spec files with an MCP server" },
          { text: "unknown" },
          { text: "MIT" },
          { text: "4", asOf: "2026-11-25" },
          { text: "2026-11-26", asOf: "2026-11-26" },
        ],
      },
    ],
  },
  related: [
    {
      label: "Spec-driven vs intent-driven development",
      href: "/learn/spec-driven-vs-intent-driven-development/",
    },
    {
      label: "What is intent-driven engineering?",
      href: "/learn/intent-driven-engineering/",
    },
  ],
};

export default specKitAlternatives;
