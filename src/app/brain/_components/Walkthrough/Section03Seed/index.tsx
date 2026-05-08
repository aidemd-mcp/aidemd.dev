import SectionScaffold from "@/app/brain/_components/Walkthrough/SectionScaffold";
import SeedRow from "@/app/brain/_components/walkthrough-blocks/SeedRow";
import CodeBlock from "@/app/brain/_components/primitives/CodeBlock";
import { SECTION_TITLES, SECTION_SUBHEADS } from "@/app/brain/_data/brainCopy";
import { SEED_PREVIEW } from "@/app/brain/_data/codeSamples";

/**
 * §03 — seed the entry-point artifacts.
 * Matches brain-variant-walkthrough.jsx lines 106–138.
 * 2-col grid (1.1fr / 1fr): LEFT — intro prose + 4 SeedRow rows + closer prose;
 * RIGHT — CodeBlock with the seed write call example.
 * Server component.
 */
export default function Section03Seed() {
  return (
    <SectionScaffold
      num="03"
      title={SECTION_TITLES["03"]}
      sub={SECTION_SUBHEADS["03"]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[28px]">
        <div>
          <div className="text-[13px] text-[color:var(--color-fg)] leading-[1.7] mb-[14px]">
            On the second run, the integration&apos;s{" "}
            <span className="text-[color:var(--color-accent)]">aide-config</span> prose calls
            the brain&apos;s own MCP write tool to create:
          </div>
          <div className="font-mono text-[12px] leading-[2]">
            <SeedRow
              path="coding-playbook/coding-playbook.md"
              fromTag="aide-playbook-index"
            />
            <SeedRow
              path="coding-playbook/study-playbook.md"
              fromTag="aide-study-playbook"
            />
            <SeedRow
              path="coding-playbook/update-playbook.md"
              fromTag="aide-update-playbook"
            />
            <SeedRow path="research/research.md" fromTag="aide-research-index" />
          </div>
          <div className="mt-[14px] text-[12px] text-[color:var(--color-dim)] leading-[1.7]">
            Each is presence-checked first; existing files are left alone. After the first
            seed pass, the seed bytes in{" "}
            <span className="text-[color:var(--color-accent)]">brain.aide</span> go dormant
            — the brain owns those files now, and humans edit them in the brain UI.
          </div>
        </div>
        <CodeBlock label="seed write call (obsidian)" code={SEED_PREVIEW} />
      </div>
    </SectionScaffold>
  );
}
