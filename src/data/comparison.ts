import type { ComparisonRow } from '@/types/comparison';

/**
 * Verbatim port from design_handoff_aidemd_site/prototypes/variant-editorial.jsx
 * ComparisonTable component, `rows` const (lines 249-257).
 *
 * Source verification passed: all 7 rows confirmed against the source file exactly.
 * Field name change: `topic` → `dimension` to match the column header in the brand-
 * approved render ("DIMENSION" header, see plan.aide 2h).
 *
 * Column order: dimension | aide | openspec.
 */
export const COMPARISON_ROWS: readonly ComparisonRow[] = [
  { dimension: 'Primary artifact', aide: '.aide (intent + outcomes)', openspec: 'spec.md (proposal + tasks)' },
  { dimension: 'Review model', aide: 'approve at 2 gates: spec + plan', openspec: 'review every proposal' },
  { dimension: 'Agent pipeline', aide: '6 specialized agents', openspec: '1 generalist' },
  { dimension: 'Durable knowledge', aide: 'external brain (vault/MCP)', openspec: 'in-repo markdown' },
  { dimension: 'Domain expertise', aide: 'automated research agent', openspec: 'you supply it' },
  { dimension: 'QA loop', aide: 'intent-tree walk + todo.aide', openspec: 'manual review' },
  { dimension: 'Opinions per kg', aide: 'heavy', openspec: 'light' },
] as const;
