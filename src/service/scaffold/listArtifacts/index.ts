import type { ScaffoldTreeEntry } from "@/types/scaffold";

/**
 * Returns the complete ordered list of all scaffold artifacts for the tree view.
 *
 * Hardcoded — all slugs are known at build time. Order follows the spec's
 * llms.txt section: docs first (from the canonical hub), then agents,
 * then commands, then skills.
 *
 * Doc entries link to `/docs/{slug}` and are included for the scaffold tree;
 * agent/command/skill entries link to their respective dynamic route pages.
 */
export default function listArtifacts(): ScaffoldTreeEntry[] {
  const docs: ScaffoldTreeEntry[] = [
    {
      filename: "aide-spec.md",
      slug: "aide-spec",
      title: "AIDE Spec",
      kind: "doc",
    },
    {
      filename: "aide-template.md",
      slug: "aide-template",
      title: "AIDE Template",
      kind: "doc",
    },
    {
      filename: "progressive-disclosure.md",
      slug: "progressive-disclosure",
      title: "Progressive Disclosure",
      kind: "doc",
    },
    {
      filename: "cascading-alignment.md",
      slug: "cascading-alignment",
      title: "Cascading Alignment",
      kind: "doc",
    },
    {
      filename: "agent-readable-code.md",
      slug: "agent-readable-code",
      title: "Agent-Readable Code",
      kind: "doc",
    },
    {
      filename: "automated-qa.md",
      slug: "automated-qa",
      title: "Automated QA",
      kind: "doc",
    },
    {
      filename: "plan-aide.md",
      slug: "plan-aide",
      title: "Plan Spec",
      kind: "doc",
    },
    {
      filename: "todo-aide.md",
      slug: "todo-aide",
      title: "Todo Spec",
      kind: "doc",
    },
  ];

  const agents: ScaffoldTreeEntry[] = [
    {
      filename: "aide-spec-writer.md",
      slug: "aide-spec-writer",
      title: "AIDE Spec Writer",
      kind: "agent",
    },
    {
      filename: "aide-domain-expert.md",
      slug: "aide-domain-expert",
      title: "AIDE Domain Expert",
      kind: "agent",
    },
    {
      filename: "aide-strategist.md",
      slug: "aide-strategist",
      title: "AIDE Strategist",
      kind: "agent",
    },
    {
      filename: "aide-architect.md",
      slug: "aide-architect",
      title: "AIDE Architect",
      kind: "agent",
    },
    {
      filename: "aide-implementor.md",
      slug: "aide-implementor",
      title: "AIDE Implementor",
      kind: "agent",
    },
    {
      filename: "aide-qa.md",
      slug: "aide-qa",
      title: "AIDE QA",
      kind: "agent",
    },
    {
      filename: "aide-aligner.md",
      slug: "aide-aligner",
      title: "AIDE Aligner",
      kind: "agent",
    },
    {
      filename: "aide-auditor.md",
      slug: "aide-auditor",
      title: "AIDE Auditor",
      kind: "agent",
    },
    {
      filename: "aide-explorer.md",
      slug: "aide-explorer",
      title: "AIDE Explorer",
      kind: "agent",
    },
  ];

  const commands: ScaffoldTreeEntry[] = [
    {
      filename: "aide.md",
      slug: "aide",
      title: "aide",
      kind: "command",
    },
    {
      filename: "spec.md",
      slug: "aide-spec",
      title: "aide:spec",
      kind: "command",
    },
    {
      filename: "research.md",
      slug: "aide-research",
      title: "aide:research",
      kind: "command",
    },
    {
      filename: "synthesize.md",
      slug: "aide-synthesize",
      title: "aide:synthesize",
      kind: "command",
    },
    {
      filename: "plan.md",
      slug: "aide-plan",
      title: "aide:plan",
      kind: "command",
    },
    {
      filename: "build.md",
      slug: "aide-build",
      title: "aide:build",
      kind: "command",
    },
    {
      filename: "qa.md",
      slug: "aide-qa",
      title: "aide:qa",
      kind: "command",
    },
    {
      filename: "fix.md",
      slug: "aide-fix",
      title: "aide:fix",
      kind: "command",
    },
    {
      filename: "refactor.md",
      slug: "aide-refactor",
      title: "aide:refactor",
      kind: "command",
    },
    {
      filename: "align.md",
      slug: "aide-align",
      title: "aide:align",
      kind: "command",
    },
    {
      filename: "init.md",
      slug: "aide-init",
      title: "aide:init",
      kind: "command",
    },
    {
      filename: "upgrade.md",
      slug: "aide-upgrade",
      title: "aide:upgrade",
      kind: "command",
    },
    {
      filename: "update-playbook.md",
      slug: "aide-update-playbook",
      title: "aide:update-playbook",
      kind: "command",
    },
  ];

  const skills: ScaffoldTreeEntry[] = [
    {
      filename: "SKILL.md",
      slug: "study-playbook",
      title: "study-playbook",
      kind: "skill",
    },
    {
      filename: "SKILL.md",
      slug: "brain",
      title: "brain",
      kind: "skill",
    },
  ];

  return [...docs, ...agents, ...commands, ...skills];
}
