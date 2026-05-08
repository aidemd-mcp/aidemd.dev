import SectionScaffold from "@/app/brain/_components/Walkthrough/SectionScaffold";
import Callout from "@/app/brain/_components/primitives/Callout";
import ConfigFlow from "@/app/brain/_components/interactive/ConfigFlow";
import { SECTION_TITLES, SECTION_SUBHEADS } from "@/app/brain/_data/brainCopy";

/**
 * §02 — wire it: /aide:brain config.
 * Matches brain-variant-walkthrough.jsx lines 86–102.
 * Renders: intro prose (with accent spans) + ConfigFlow + Callout kind="why-stop".
 * Server component.
 */
export default function Section02Wire() {
  return (
    <SectionScaffold
      num="02"
      title={SECTION_TITLES["02"]}
      sub={SECTION_SUBHEADS["02"]}
    >
      <div className="text-[13px] text-[color:var(--color-dim)] mb-[18px] leading-[1.7] max-w-[880px]">
        Run{" "}
        <span className="text-[color:var(--color-accent)]">/aide:brain config</span> from
        inside Claude Code. The command reads the{" "}
        <span className="text-[color:var(--color-accent)]">aide-config</span> body section,
        which is integration-specific prose that knows how to handle the unwired slots for{" "}
        <em>this</em> backend. Click the buttons below to see what fires when:
      </div>
      <ConfigFlow />
      <Callout kind="why-stop" label="WHY THE STOP" className="mt-[22px]">
        The brain&apos;s MCP server is registered at session start. The{" "}
        <em>just-wired</em> brain isn&apos;t loaded in the running session — sync wrote
        the entry but Claude Code didn&apos;t see it boot. So the wiring flow stops, you
        restart, and the <em>second</em> run of{" "}
        <span className="text-[color:var(--color-accent)]">/aide:brain config</span> takes
        the seeding path.
      </Callout>
    </SectionScaffold>
  );
}
