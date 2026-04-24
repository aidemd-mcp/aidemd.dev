import { describe, it, expect } from 'vitest';
import parseDocFrontmatter from './index';

describe('parseDocFrontmatter', () => {
  it('returns data.title when present', () => {
    const raw = '---\ntitle: My Title\n---\n\nBody text.';
    const { frontmatter } = parseDocFrontmatter(raw, 'my-slug');
    expect(frontmatter.title).toBe('My Title');
  });

  it('prefers data.title over data.name when both present', () => {
    const raw = '---\ntitle: Explicit Title\nname: ignored-name\n---\n\nBody.';
    const { frontmatter } = parseDocFrontmatter(raw, 'slug');
    expect(frontmatter.title).toBe('Explicit Title');
  });

  it('prefers H1 over data.name when data.title absent but H1 present (SKILL.md shape)', () => {
    // Skill files have name: frontmatter AND an H1 — the H1 is the display title.
    const raw =
      '---\nname: study-playbook\ndescription: Load playbook context\n---\n\n# /study-playbook — Load Coding Playbook Context\n\nBody.';
    const { frontmatter, body } = parseDocFrontmatter(raw, 'skills/study-playbook/SKILL');
    expect(frontmatter.title).toBe('/study-playbook — Load Coding Playbook Context');
    expect(body).not.toContain('# /study-playbook');
  });

  it('falls back to data.name when data.title and H1 are both absent — agent frontmatter convention', () => {
    // Agent files have name: frontmatter but no H1 — use name: directly.
    const raw =
      '---\nname: aide-architect\ndescription: Plans the implementation.\nmodel: opus\ncolor: red\n---\n\nYou are the systems architect.';
    const { frontmatter } = parseDocFrontmatter(raw, 'aide/aide-architect');
    expect(frontmatter.title).toBe('aide-architect');
  });

  it('falls back to H1 when data.title is absent — standard no-title case', () => {
    const raw = '---\ndescription: Some description.\n---\n\n# Derived Heading\n\nBody.';
    const { frontmatter, body } = parseDocFrontmatter(raw, 'fallback-slug');
    expect(frontmatter.title).toBe('Derived Heading');
    expect(body).not.toContain('# Derived Heading');
  });

  it('falls back to slug when frontmatter has no title/name and body has no H1', () => {
    const raw = '---\ndescription: Only description.\n---\n\nNo heading here.';
    const { frontmatter } = parseDocFrontmatter(raw, 'section/the-slug');
    expect(frontmatter.title).toBe('section/the-slug');
  });

  it('handles no frontmatter block — derives title from H1', () => {
    const raw = '# Plain Heading\n\nContent without frontmatter.';
    const { frontmatter, body } = parseDocFrontmatter(raw, 'plain-slug');
    expect(frontmatter.title).toBe('Plain Heading');
    expect(body).not.toContain('# Plain Heading');
  });

  it('handles no frontmatter block and no H1 — falls back to slug', () => {
    const raw = 'Just a plain body with no heading.';
    const { frontmatter } = parseDocFrontmatter(raw, 'bare-slug');
    expect(frontmatter.title).toBe('bare-slug');
  });

  it('passes description through from frontmatter', () => {
    const raw = '---\nname: aide-aligner\ndescription: Verifies spec alignment.\n---\n\nBody.';
    const { frontmatter } = parseDocFrontmatter(raw, 'aide/aide-aligner');
    expect(frontmatter.description).toBe('Verifies spec alignment.');
  });
});
