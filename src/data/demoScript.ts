import type { DemoLine } from '@/types/demo';

/**
 * Verbatim port from design_handoff_aidemd_site/prototypes/shared.jsx lines 397-422.
 * Consumed by the CliDemo marketing section terminal animation.
 */
export const DEMO_SCRIPT: readonly DemoLine[] = [
  { prompt: true, text: 'npx @aidemd-mcp/server@latest init' },
  { out: 'Scaffolding .aide/ and brain pointers...' },
  { out: 'Wrote .aide/intent.aide' },
  { out: 'Wrote .aide/docs/' },
  { out: 'Connected Obsidian vault: ~/brain' },
  { out: '✓ ready' },
  { prompt: true, text: '/aide' },
  { out: 'Interviewing for new module...' },
  { out: '  What are you building? _ lapsed-customer retention emails' },
  { out: '  Who receives this? _ users with no order in 60+ days' },
  { out: 'Dispatching to /aide:spec...' },
  { aide: true, path: 'src/service/retention/.aide' },
  { out: 'Spec frontmatter written. Awaiting your confirmation...' },
  { prompt: true, text: 'approve' },
  { out: 'Dispatching to /aide:research → domain expert' },
  { out: '  → reading research/email-marketing/* (brain)' },
  { out: '  → fetching 4 new sources' },
  { out: '  → wrote 3 notes: research/email-marketing/opener-patterns.md (+2)' },
  { out: 'Dispatching to /aide:synthesize → strategist' },
  { out: '  → walked intent tree: .aide/intent.aide → src/.aide → retention/.aide' },
  { out: '  → wrote Context, Strategy, Good/Bad examples, References' },
  { out: 'Dispatching to /aide:plan → architect' },
  { plan: true, path: 'src/service/retention/plan.aide' },
  { out: 'Plan ready. 7 numbered steps. Review and approve...' },
] as const;
