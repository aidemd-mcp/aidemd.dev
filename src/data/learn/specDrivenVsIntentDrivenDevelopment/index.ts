import type { LearnCopy } from "@/types/learn";

/**
 * The copy record for /learn/spec-driven-vs-intent-driven-development/: how
 * the two approaches differ, a side-by-side table on concrete dimensions, and
 * a fair account of the criticisms spec-driven development attracts. Drafted
 * from the brain's SEO/AEO research note on target queries and competitors and
 * the canonical methodology docs; facts those sources do not state ship as
 * `[VERIFY]` or `[NEEDS COLLECTION]`. Marked draft until the founder reviews it
 * live. Every surface that shows this page's words reads this one record.
 */
const specDrivenVsIntentDrivenDevelopment: LearnCopy = {
  slug: "spec-driven-vs-intent-driven-development",
  status: "draft",
  title: "Spec-driven development vs intent-driven development",
  description:
    "How spec-driven development and intent-driven development differ, side by side, with the fair criticisms of spec-driven and where each approach falls short.",
  h1: "Spec-driven development vs intent-driven development",
  answer: [
    {
      kind: "text",
      text: "Spec-driven development builds from a specification written up front, while intent-driven development builds from a short statement of what each module is for and how to tell it is right, kept beside the code. Specs in spec-driven tools vary in size and in how long they are kept; AIDE (aidemd), an intent-driven approach, caps each intent paragraph at one hundred words and checks the code against its outcomes in a QA stage. Both put a written artifact ahead of the code, and both pay for it in writing and review.",
    },
  ],
  sections: [
    {
      id: "what-spec-driven-means",
      heading: "What spec-driven development means",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Spec-driven development has an AI coding agent build from a written specification instead of a loose prompt. Birgitta Böckeler of Thoughtworks, writing on martinfowler.com on 2025-10-15, ",
            },
            {
              kind: "link",
              text: "splits the practice into three levels",
              href: "https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html",
            },
            {
              kind: "text",
              text: " (spec-first, spec-anchored and spec-as-source) and notes that the definition is still in flux. [VERIFY: Böckeler's definition of each level; the research names the levels without defining them.]",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "She compared three tools in that article. Kiro is an AWS-built IDE based on VS Code with a requirements, design and tasks flow. Spec-kit is GitHub's CLI toolkit. Tessl Framework was in private beta at the time and is the only one of the three aiming at spec-as-source. A separate academic paper frames the approach as making the specification the primary artifact.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            { kind: "text", text: "The approach carries institutional weight. The " },
            {
              kind: "link",
              text: "Thoughtworks Technology Radar",
              href: "https://www.thoughtworks.com/radar/techniques/spec-driven-development",
            },
            {
              kind: "text",
              text: " lists spec-driven development as a technique, and Gartner published a note in April 2026 describing it as key to scaling AI-native software development. [VERIFY: the exact Gartner document and its wording.]",
            },
          ],
        },
      ],
    },
    {
      id: "what-intent-driven-changes",
      heading: "What intent-driven development changes",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Intent-driven development, as AIDE practises it, keeps a short ",
            },
            { kind: "link", text: "intent spec", href: "/docs/methodology/aide-spec/" },
            {
              kind: "text",
              text: " in the folder of each module it governs. The spec holds the module's purpose in one paragraph of at most one hundred words, plus three to six desired outcomes and three to six undesired ones, the failure modes that look right and are not. The full definition is on the ",
            },
            {
              kind: "link",
              text: "intent-driven engineering page",
              href: "/learn/intent-driven-engineering/",
            },
            { kind: "text", text: "." },
          ],
        },
        {
          kind: "paragraph",
          text: [
            { kind: "text", text: "Specs form a " },
            {
              kind: "link",
              text: "cascading intent tree",
              href: "/docs/methodology/cascading-alignment/",
            },
            {
              kind: "text",
              text: ": each child narrows its parent, and an aligner agent compares a child's outcomes against every ancestor's. A QA agent then checks the code against the outcomes, and when the code drifts from the intent, the code is what is wrong. Implementation detail lives in per-feature working files, brief.aide, plan.aide and todo.aide, which are deleted after QA passes.",
            },
          ],
        },
      ],
    },
    {
      id: "is-spec-driven-development-waterfall",
      heading: "Is spec-driven development just waterfall?",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Some practitioners describe spec-driven development as waterfall revisited, and a Hacker News thread frames it the same way. The objection is the familiar one against waterfall: specify first, build second. A Scrum.org post replies that spec-driven development is not waterfall unless you use it that way, so the criticism targets a practice, not a necessity.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Intent-driven engineering answers part of it. The spec is short, and when the intent changes the spec changes and the code follows; the plan, brief and todo files belong to one feature and are discarded after QA. It does not answer all of it. The pipeline is still staged, with spec, plan, build, QA and fix in order, and a spec comes before code. Research and synthesize are skipped when a feature does not need them; the spec stage is not. Whether this feels less like waterfall in practice is unmeasured. [NEEDS COLLECTION: any study or user report comparing the two.]",
            },
          ],
        },
      ],
    },
    {
      id: "too-much-markdown",
      heading: "Does spec-driven development produce too much markdown?",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Böckeler reported that the spec-driven tools she tried produced too much markdown to review, gave a false sense of control, and were overkill for small tasks. That is a fair criticism from someone who used the tools, and it is a review cost, not a style complaint.",
            },
          ],
        },
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "Intent-driven engineering limits the size of what stays. The brevity contract caps the intent paragraph at one hundred words and targets about 150 lines per spec file, and agents read the nearest spec and its ancestors rather than everything. It does not remove the cost. A feature still produces working files while it runs, and a person still has to judge whether the spec is right: a passing ",
            },
            {
              kind: "link",
              text: "QA check",
              href: "/docs/methodology/automated-qa/",
            },
            {
              kind: "text",
              text: " shows the code matches the spec as written, not that the spec is correct. No review-load measurement was found for either approach. [NEEDS COLLECTION: review time per feature under each approach.]",
            },
          ],
        },
      ],
    },
    {
      id: "how-to-choose",
      heading: "How to choose between spec-driven and intent-driven development",
      blocks: [
        {
          kind: "paragraph",
          text: [
            {
              kind: "text",
              text: "The two overlap more than the names suggest: both make a written artifact the starting point and both ask a person to write and judge it. Choose on what you need around that artifact.",
            },
          ],
        },
        {
          kind: "list",
          items: [
            [
              {
                kind: "text",
                text: "If you want a specific tool's flow, such as an IDE with requirements, design and tasks or a CLI toolkit, compare the tools on the ",
              },
              {
                kind: "link",
                text: "spec-kit alternatives page",
                href: "/learn/spec-kit-alternatives/",
              },
              { kind: "text", text: "." },
            ],
            [
              {
                kind: "text",
                text: "If you want one short spec per module, checked against its ancestors and verified by a separate QA stage, intent-driven development is built for that.",
              },
            ],
            [
              {
                kind: "text",
                text: "If you work in Claude Code, the intent-driven AIDE pipeline agents install into the project's .claude/agents/aide/ folder; for other environments the support is unknown. [VERIFY: supported clients.]",
              },
            ],
            [
              { kind: "text", text: "The " },
              {
                kind: "link",
                text: "methodology docs",
                href: "/docs/methodology/",
              },
              { kind: "text", text: " cover the format and the pipeline in full." },
            ],
          ],
        },
      ],
    },
  ],
  comparison: {
    caption:
      "Spec-driven development and intent-driven development compared on seven dimensions",
    columns: [
      "Dimension",
      "Spec-driven development",
      "Intent-driven development (AIDE)",
    ],
    rows: [
      {
        cells: [
          { text: "Role of the spec" },
          {
            text: "The specification is the primary artifact the agent builds from. How long it is kept depends on the level: spec-first, spec-anchored or spec-as-source. [VERIFY: level definitions]",
          },
          {
            text: "The intent spec is the contract and the code is its current expression; when code drifts from the intent, the code is wrong.",
          },
        ],
      },
      {
        cells: [
          { text: "What the spec says" },
          { text: "Varies by tool; Kiro uses requirements, design and tasks." },
          {
            text: "What a module is for, plus desired and undesired outcomes. Type shapes and exact strings go in a separate brief that is deleted after QA.",
          },
        ],
      },
      {
        cells: [
          { text: "Keeping spec and code in step" },
          { text: "unknown" },
          {
            text: "An aligner agent checks each spec against its ancestors; a QA agent checks code against outcomes and writes a todo list of the drift it finds.",
          },
        ],
      },
      {
        cells: [
          { text: "Review load" },
          {
            text: "Böckeler reported that the tools she tried produced too much markdown to review.",
          },
          {
            text: "Size caps on the spec and per-feature files deleted after QA limit what stays; no review-load measurement was found. [NEEDS COLLECTION]",
          },
        ],
      },
      {
        cells: [
          { text: "Fit for small tasks" },
          { text: "Böckeler found the tools she tried overkill for small tasks." },
          {
            text: "unknown. The pipeline has several stages; research and synthesize are skipped when a feature does not need them.",
          },
        ],
      },
      {
        cells: [
          { text: "What both still cost" },
          {
            text: "A person writes and judges the spec; Böckeler reported a false sense of control.",
          },
          {
            text: "A person writes and judges the intent spec. The QA stage exists because agent output drifts from the spec, so a pass shows the code matches the spec as written, not that the spec is right.",
          },
        ],
      },
      {
        cells: [
          { text: "Independent evidence" },
          {
            text: "Listed as a technique on the Thoughtworks Technology Radar; a Gartner note is cited. [VERIFY: exact Gartner document and date] No verified study of defect outcomes was found.",
          },
          { text: "None found. [NEEDS COLLECTION]" },
        ],
      },
    ],
  },
  related: [
    {
      label: "Intent-driven engineering, defined",
      href: "/learn/intent-driven-engineering/",
    },
    {
      label: "Spec-kit alternatives compared",
      href: "/learn/spec-kit-alternatives/",
    },
    {
      label: "The intent-driven methodology docs",
      href: "/docs/methodology/",
    },
  ],
};

export default specDrivenVsIntentDrivenDevelopment;
