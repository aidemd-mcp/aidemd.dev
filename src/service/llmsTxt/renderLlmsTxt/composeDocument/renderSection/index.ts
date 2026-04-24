import type { RouteGroup } from '@/service/llmsTxt/types';
import renderLink from '../renderLink';

/**
 * Renders one H2 section — heading plus link list — for the llms.txt document.
 * Each group maps to exactly one H2; never shared, never merged.
 * Appends a trailing blank line after the last link so sections are
 * visually separated when joined by the composer.
 */
export default function renderSection(group: RouteGroup): string {
  const heading = `## ${group.label}\n\n`;
  const links = group.entries.map(renderLink).join('');
  return heading + links + '\n';
}
