import type { LlmsSection } from '@/types/llmsTxt';
import renderLink from '../renderLink';

/**
 * Renders one H2 section — heading plus link list — for the llms.txt document.
 * Each section maps to exactly one H2; never shared, never merged.
 * Appends a trailing blank line after the last link so sections are
 * visually separated when joined by the composer.
 */
export default function renderSection(section: LlmsSection): string {
  const heading = `## ${section.heading}\n\n`;
  const links = section.entries.map(renderLink).join('');
  return heading + links + '\n';
}
