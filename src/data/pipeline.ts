import type { PipelineStage } from '@/types/pipeline';

/**
 * Verbatim port from design_handoff_aidemd_site/prototypes/shared.jsx lines 3-57.
 * Describes the 6 AIDE pipeline stages shown in the marketing Pipeline section.
 */
export const PIPELINE_STAGES: readonly PipelineStage[] = [
  {
    id: 'spec',
    cmd: '/aide:spec',
    name: 'Spec Writer',
    role: 'Turns your interview answers into a falsifiable contract.',
    reads: ['your intent'],
    writes: ['.aide frontmatter: scope, intent, outcomes.desired, outcomes.undesired'],
    detail: 'No body sections, no research, no code. The spec writer structures intent; the orchestrator owns the user conversation.',
  },
  {
    id: 'research',
    cmd: '/aide:research',
    name: 'Domain Expert',
    role: 'Fills the brain with durable domain knowledge.',
    reads: ['your sources', 'web', 'prior brain notes'],
    writes: ['research/<domain>/*.md in the vault'],
    detail: 'Optional. Skips if the brain already has coverage or you hold the knowledge. Never writes .aide files — the output is reusable research filed by domain, not by project.',
  },
  {
    id: 'synthesize',
    cmd: '/aide:synthesize',
    name: 'Strategist',
    role: 'Distills research into decisions.',
    reads: ['.aide frontmatter', 'brain notes', 'parent .aide chain'],
    writes: ['## Context, ## Strategy, ## Good examples, ## Bad examples, ## References'],
    detail: 'Every strategy decision must trace to an outcome. Anything that does not serve the intent gets cut.',
  },
  {
    id: 'plan',
    cmd: '/aide:plan',
    name: 'Architect',
    role: 'Translates intent into a checkboxed plan.',
    reads: ['.aide spec', 'coding-playbook', 'current codebase'],
    writes: ['plan.aide with Project Structure + Plan + Decisions'],
    detail: 'Picks files, names, sequencing, contracts, reuse. No code. Presented to you for approval before build begins.',
  },
  {
    id: 'build',
    cmd: '/aide:build',
    name: 'Implementor',
    role: 'Executes the plan top-to-bottom.',
    reads: ['plan.aide', '.aide spec', 'playbook Read: lists'],
    writes: ['application code + tests'],
    detail: 'One fresh agent per numbered step. Checks each box as it completes. If the plan is ambiguous, escalates back to the architect rather than inventing an answer.',
  },
  {
    id: 'qa',
    cmd: '/aide:qa',
    name: 'QA + Aligner',
    role: 'Walks the intent tree, finds drift, writes the todo.',
    reads: ['full intent tree (root → leaf)', 'actual output'],
    writes: ['todo.aide with misalignment tags and a retro'],
    detail: 'Compares output against outcomes.desired and checks for outcomes.undesired. Each issue traces to a spec line and is tagged with the pipeline stage where intent was lost.',
  },
] as const;
