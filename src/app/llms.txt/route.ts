export const dynamic = "force-static";

const content = `# AIDE -- Autonomous Intent-Driven Engineering

> AIDE is a software development methodology that puts intent at the center of engineering. Short .aide spec files live next to the code they govern, forming a cascading intent tree. A pipeline of eight specialized AI agents -- spec writer, domain expert, strategist, architect, implementor, QA, aligner, auditor -- translates intent into production-quality software.

## Core Concepts

- AIDE Spec: https://aidemd.dev/docs/aide-spec
- AIDE Template: https://aidemd.dev/docs/aide-template
- Progressive Disclosure: https://aidemd.dev/docs/progressive-disclosure
- Cascading Alignment: https://aidemd.dev/docs/cascading-alignment
- Agent-Readable Code: https://aidemd.dev/docs/agent-readable-code
- Automated QA: https://aidemd.dev/docs/automated-qa
- Plan Spec: https://aidemd.dev/docs/plan-aide
- Todo Spec: https://aidemd.dev/docs/todo-aide

## Agents

- AIDE Spec Writer: https://aidemd.dev/agents/aide-spec-writer -- Interviews stakeholders and domain experts to draft a structured .aide intent spec that governs a code module through the full agent pipeline.
- AIDE Domain Expert: https://aidemd.dev/agents/aide-domain-expert -- Supplies business-domain knowledge to the spec and strategy phases, ensuring agent pipeline decisions reflect real-world constraints and terminology.
- AIDE Strategist: https://aidemd.dev/agents/aide-strategist -- Reads an intent spec and produces a high-level approach document that resolves ambiguities before the architect writes a single implementation step.
- AIDE Architect: https://aidemd.dev/agents/aide-architect -- Reads a strategy spec and brain research, then produces a step-by-step plan.aide that the implementor executes without further design decisions.
- AIDE Implementor: https://aidemd.dev/agents/aide-implementor -- Executes plan.aide steps top-to-bottom, writing production-quality code with zero architectural drift from the architect's specification.
- AIDE QA: https://aidemd.dev/agents/aide-qa -- Validates implemented code against the intent spec, producing a todo.aide of misalignments for the implementor to fix one item per session.
- AIDE Aligner: https://aidemd.dev/agents/aide-aligner -- Checks that child .aide specs do not contradict their parent specs, enforcing cascading alignment across the full intent tree of a project.
- AIDE Auditor: https://aidemd.dev/agents/aide-auditor -- Performs a final code review against the intent spec, catching drift, dead code, and contract violations before a feature is marked complete.
- AIDE Explorer: https://aidemd.dev/agents/aide-explorer -- Navigates an unfamiliar codebase using progressive disclosure tiers, building a minimal context map before any implementation work begins.

## Commands

- /aide: https://aidemd.dev/commands/aide -- The root dispatcher in the AIDE Claude Code toolchain, routing to spec, plan, build, qa, and other pipeline subcommands from a single entry point.
- /aide:spec: https://aidemd.dev/commands/aide-spec -- Launches the AIDE spec writer agent to produce or update a .aide intent spec for the current module through an interactive interview process.
- /aide:research: https://aidemd.dev/commands/aide-research -- Invokes the AIDE domain expert agent to gather and synthesize domain knowledge into the brain vault before spec or strategy work begins.
- /aide:synthesize: https://aidemd.dev/commands/aide-synthesize -- Runs the AIDE strategist agent to transform a finalized intent spec into a high-level strategy document that resolves open design questions.
- /aide:plan: https://aidemd.dev/commands/aide-plan -- Runs the AIDE architect agent to convert a strategy document into a sequenced plan.aide that the implementor can execute step by step.
- /aide:build: https://aidemd.dev/commands/aide-build -- Runs the AIDE implementor agent to execute the current plan.aide, writing production-quality code for each unchecked step in sequence.
- /aide:qa: https://aidemd.dev/commands/aide-qa -- Runs the AIDE QA agent to validate implemented code against its intent spec, writing a todo.aide of misalignments for the fix loop.
- /aide:fix: https://aidemd.dev/commands/aide-fix -- Runs the AIDE implementor in fix mode, resolving exactly one unchecked item from todo.aide per session to avoid context contamination.
- /aide:refactor: https://aidemd.dev/commands/aide-refactor -- Guides a controlled refactor under AIDE governance, updating the intent spec first so code changes remain aligned with documented intent.
- /aide:align: https://aidemd.dev/commands/aide-align -- Runs the AIDE aligner agent to verify that all child .aide specs in a project do not contradict or exceed their parent spec's scope.
- /aide:init: https://aidemd.dev/commands/aide-init -- Bootstraps the full AIDE scaffold into a project: .aide/ docs, .claude/agents/, .claude/commands/, and .claude/skills/ with all canonical files.
- /aide:upgrade: https://aidemd.dev/commands/aide-upgrade -- Syncs all AIDE scaffold files -- docs, agents, commands, and skills -- to the latest canonical versions without touching project-specific .aide specs.
- /aide:update-playbook: https://aidemd.dev/commands/aide-update-playbook -- Pulls the latest coding playbook notes from the brain vault into the active session context so agents work from current conventions.

## Skills

- study-playbook: https://aidemd.dev/skills/study-playbook -- Navigates the coding playbook hub top-down, loading only the section notes relevant to the current task rather than the entire playbook.
- brain: https://aidemd.dev/skills/brain -- Reads from a persistent external knowledge store (Obsidian vault via MCP) to load domain research and engineering conventions into the agent session.

## Key Terms

- .aide file: A structured intent spec (scope, intent, outcomes, strategy) that lives next to the code it governs.
- Intent tree: The hierarchy of .aide specs from project root to deepest module, where each child narrows its parent's intent.
- Progressive disclosure: Code structured in tiers (folder tree, JSDoc, inline comments) so agents read only the depth they need.
- Cascading alignment: Parent intent flows down the tree; child specs inherit and narrow, never contradict.
- Brain: A persistent external knowledge store (Obsidian vault, MCP memory) holding domain research and engineering conventions.
- Fix loop: QA produces a todo.aide, implementor fixes one item per session in clean context, QA re-validates.

## Install

npx @aidemd-mcp/server@latest

## Publisher

TetsuKodai Group LLC -- https://tetsukod.ai
`;

/** Serves llms.txt at the site root for LLM-readable artifact discovery. */
export function GET(): Response {
  return new Response(content, {
    headers: { "Content-Type": "text/plain" },
  });
}
