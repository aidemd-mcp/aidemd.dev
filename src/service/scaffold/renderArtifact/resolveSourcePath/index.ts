import path from "node:path";
import type { ScaffoldArtifact } from "@/types/scaffold";

type ResolveSourcePathInput = {
  slug: string;
  kind: ScaffoldArtifact["kind"];
};

/**
 * Maps a slug + kind to the filesystem path of the source markdown file.
 *
 * - agents: `.claude/agents/aide/{slug}.md`
 * - commands: root aide command maps to `.claude/commands/aide.md`; all others
 *   strip the `aide-` prefix to get the filename under `.claude/commands/aide/`
 * - skills: `.claude/skills/{slug}/SKILL.md`
 */
export default function resolveSourcePath({
  slug,
  kind,
}: ResolveSourcePathInput): string {
  const root = process.cwd();

  if (kind === "agent") {
    return path.join(root, ".claude", "agents", "aide", `${slug}.md`);
  }

  if (kind === "skill") {
    return path.join(root, ".claude", "skills", slug, "SKILL.md");
  }

  // kind === "command"
  // "aide" is the root command — lives at .claude/commands/aide.md
  if (slug === "aide") {
    return path.join(root, ".claude", "commands", "aide.md");
  }

  // All other commands strip the "aide-" prefix to get the filename.
  // e.g. "aide-spec" -> "spec.md", "aide-update-playbook" -> "update-playbook.md"
  const filename = slug.replace(/^aide-/, "") + ".md";
  return path.join(root, ".claude", "commands", "aide", filename);
}
