import SectionScaffold from "@/app/brain/_components/Walkthrough/SectionScaffold";
import CmdLine from "@/app/brain/_components/primitives/CmdLine";
import CodeBlock from "@/app/brain/_components/primitives/CodeBlock";
import { SECTION_TITLES, SECTION_SUBHEADS } from "@/app/brain/_data/brainCopy";
import { SCAFFOLD_PREVIEW } from "@/app/brain/_data/codeSamples";

/**
 * §01 — install + scaffold the default.
 * Matches brain-variant-walkthrough.jsx lines 43–82.
 * 2-col grid: LEFT — CmdLine + prose (YAML null colored warn) + dim alternative comment;
 * RIGHT — CodeBlock showing the just-scaffolded brain.aide.
 * Server component.
 */
export default function Section01Install() {
  return (
    <SectionScaffold
      num="01"
      title={SECTION_TITLES["01"]}
      sub={SECTION_SUBHEADS["01"]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] items-start">
        <div>
          <CmdLine cmd="npx aidemd-mcp init" />
          <div className="text-[12px] text-[color:var(--color-dim)] mt-[14px] leading-[1.7]">
            Run this in any project root. It creates{" "}
            <span className="text-[color:var(--color-accent)]">.aide/</span> with the
            methodology docs, scaffolds{" "}
            <span className="text-[color:var(--color-accent)]">.aide/config/brain.aide</span>{" "}
            using the bundled Obsidian template, and stops. The file lands with{" "}
            <span className="text-[color:var(--color-warn)]">YAML null</span> at the unwired
            arg slot — that&apos;s the signal that you still need to point it at a vault.
          </div>
          <div className="text-[11px] text-[color:var(--color-dim-2)] mt-[18px] leading-[1.7]">
            # alternative:{" "}
            <span className="text-[color:var(--color-accent)]">
              --brain &lt;integration&gt;
            </span>{" "}
            selects a different
            <br /># bundled template at install time.
          </div>
        </div>
        <CodeBlock
          label=".aide/config/brain.aide (just-scaffolded)"
          code={SCAFFOLD_PREVIEW}
        />
      </div>
    </SectionScaffold>
  );
}
