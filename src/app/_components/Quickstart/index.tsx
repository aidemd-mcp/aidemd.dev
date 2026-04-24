import { QUICKSTART_STEPS } from "@/data/quickstart";
import SectionHeader from "@/app/_components/SectionHeader";
import TermStep from "./TermStep";

/**
 * Quickstart section — §07 header + 3-column grid of TermStep cards.
 */
export default function Quickstart() {
  return (
    <div>
      <SectionHeader num="07" title="quickstart" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mt-[28px]">
        {QUICKSTART_STEPS.map((step) => (
          <TermStep key={step.n} n={step.n} cmd={step.cmd} note={step.note} />
        ))}
      </div>
    </div>
  );
}
