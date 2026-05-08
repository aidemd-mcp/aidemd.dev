import SectionScaffold from "@/app/brain/_components/Walkthrough/SectionScaffold";
import BootStates from "@/app/brain/_components/walkthrough-blocks/BootStates";
import { SECTION_TITLES, SECTION_SUBHEADS } from "@/app/brain/_data/brainCopy";

/**
 * §04 — verify with the boot reporter.
 * Matches brain-variant-walkthrough.jsx lines 142–145.
 * Renders BootStates only — all FOUR states (ok, no-brain-aide, no-mcp-entry, mcp-drift).
 * Server component.
 */
export default function Section04Verify() {
  return (
    <SectionScaffold
      num="04"
      title={SECTION_TITLES["04"]}
      sub={SECTION_SUBHEADS["04"]}
    >
      <BootStates />
    </SectionScaffold>
  );
}
