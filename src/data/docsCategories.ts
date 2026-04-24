import type { DocSection } from '@/types/docs';

/**
 * Single source of truth for the four docs content roots.
 *
 * - `section`     — DocSection discriminant used throughout the registry
 * - `label`       — top-nav link text (note: 'methodology' section uses label 'docs')
 * - `urlSegment`  — URL path segment under /docs/ (e.g. /docs/methodology/)
 * - `absRoot`     — filesystem root walked by the docs registry at build time
 *
 * Consumed by: top-nav href mapping, DocsSidebar category grouping, and the
 * filesystem-walk roots in src/service/docsRegistry/.
 *
 * Do NOT reorder — the registry's orderRoutes helper uses this array's index to
 * determine section priority (methodology first, skills last).
 */

/**
 * Section-index metadata used by [section]/page.tsx to render section-scoped
 * headers and lede paragraphs. Colocated here for single-sourcing with DOCS_CATEGORIES.
 */
export const SECTION_INDEX_META: Record<DocSection, { label: string; lede: string }> = {
  methodology: { label: 'Methodology', lede: 'the canonical AIDE methodology docs' },
  commands:    { label: 'Commands',    lede: 'the slash commands shipped with @aidemd-mcp/server' },
  agents:      { label: 'Agents',      lede: 'the specialized subagents the AIDE orchestrator delegates to' },
  skills:      { label: 'Skills',      lede: 'the Claude Code skills bundled with the package' },
};
export const DOCS_CATEGORIES: readonly {
  section: DocSection;
  label: string;
  urlSegment: string;
  absRoot: string;
}[] = [
  { section: 'methodology', label: 'docs',      urlSegment: 'methodology', absRoot: '.aide/docs' },
  { section: 'commands',    label: 'commands',   urlSegment: 'commands',    absRoot: '.claude/commands' },
  { section: 'agents',      label: 'agents',     urlSegment: 'agents',      absRoot: '.claude/agents' },
  { section: 'skills',      label: 'skills',     urlSegment: 'skills',      absRoot: '.claude/skills' },
] as const;
