import SectionScaffold from "@/app/brain/_components/Walkthrough/SectionScaffold";
import SubHeader from "@/app/brain/_components/walkthrough-blocks/SubHeader";
import BodySectionCard from "@/app/brain/_components/walkthrough-blocks/BodySectionCard";
import MCPToolSurface from "@/app/brain/_components/walkthrough-blocks/MCPToolSurface";
import Card from "@/app/brain/_components/primitives/Card";
import WorkedExamples from "@/app/brain/_components/interactive/WorkedExamples";
import SkeletonGenerator from "@/app/brain/_components/interactive/SkeletonGenerator";
import { SECTION_TITLES, SECTION_SUBHEADS } from "@/app/brain/_data/brainCopy";

/**
 * §05 — build your own backend.
 * Matches brain-variant-walkthrough.jsx lines 149–181.
 * Renders in vertical order:
 *   intro paragraph (with inline accent span around "brain.aide")
 *   SubHeader A + Card wrapping MCPToolSurface
 *   SubHeader B + 2-col grid of 6 BodySectionCards
 *   SubHeader C + WorkedExamples
 *   SubHeader D + dim comment line + SkeletonGenerator
 * Server component.
 */
export default function Section05BuildOwn() {
  return (
    <SectionScaffold
      num="05"
      title={SECTION_TITLES["05"]}
      sub={SECTION_SUBHEADS["05"]}
    >
      <div className="text-[13px] text-[color:var(--color-dim)] leading-[1.7] mb-[22px] max-w-[880px]">
        Authoring a custom brain is three artifacts: an MCP server that exposes the right
        tools, a
        <span className="text-[color:var(--color-accent)]"> brain.aide </span>
        file with frontmatter that launches it, and the body sections (orientation +
        aide-config + the four seeds) that teach AIDE how to use it.
      </div>

      <SubHeader>A · what your MCP server must expose</SubHeader>
      <Card className="mb-[26px] rounded-[6px]">
        <MCPToolSurface />
      </Card>

      <SubHeader>B · the body sections you author</SubHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[26px]">
        <BodySectionCard
          tag="aide-orientation"
          who="aide_brain at runtime"
          what="A runtime briefing the agent reads at the start of every brain-touching task. Name your MCP tools, list your entry-point artifacts, set scope rules."
        />
        <BodySectionCard
          tag="aide-config"
          who="/aide:brain config"
          what="The wiring + seeding script. Documents which arg slots are unwired, how to resolve them, what to do after sync, and how to seed the four artifacts."
        />
        <BodySectionCard
          tag="aide-playbook-index"
          who="seed → coding-playbook/coding-playbook.md"
          what="Root hub for the coding playbook. The user's conventions, top-level navigation table."
        />
        <BodySectionCard
          tag="aide-study-playbook"
          who="seed → coding-playbook/study-playbook.md"
          what="Navigation methodology. How agents traverse the playbook hub → section → child note hierarchy."
        />
        <BodySectionCard
          tag="aide-update-playbook"
          who="seed → coding-playbook/update-playbook.md"
          what="Maintenance methodology. How to add, edit, rename, or remove playbook entries safely."
        />
        <BodySectionCard
          tag="aide-research-index"
          who="seed → research/research.md"
          what="Root hub for research notes. Domain index, navigation guidance."
        />
      </div>

      <SubHeader>C · worked examples</SubHeader>
      <WorkedExamples />

      <SubHeader>D · live skeleton generator</SubHeader>
      <div className="text-[12px] text-[color:var(--color-dim)] mb-[12px] leading-[1.7]">
        # pick a preset, name it, optionally override orientation. copy the result into{" "}
        <span className="text-[color:var(--color-accent)]">.aide/config/brain.aide</span>.
      </div>
      <SkeletonGenerator />
    </SectionScaffold>
  );
}
