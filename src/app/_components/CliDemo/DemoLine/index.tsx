import type { DemoLine as DemoLineType } from "@/types/demo";

interface DemoLineProps {
  line: DemoLineType;
}

/**
 * Renders a single line of the CLI demo script.
 *
 * kind=prompt  → accent › prefix + text
 * kind=out     → dim paragraph
 * kind=aide    → faux .aide block: green + path + yaml-style fields
 * kind=plan    → faux plan.aide block: blue header + step list
 */
export default function DemoLine({ line }: DemoLineProps) {
  if ("prompt" in line) {
    return (
      <div className="flex items-start gap-[8px]">
        <span className="text-[color:var(--color-accent)] select-none">›</span>
        <span className="text-[color:var(--color-fg)]">{line.text}</span>
      </div>
    );
  }

  if ("out" in line) {
    return (
      <p className="text-[color:var(--color-dim)] pl-[16px]">{line.out}</p>
    );
  }

  if ("aide" in line) {
    return (
      <div className="pl-[16px] mt-[4px] mb-[4px]">
        {/* FauxAideBlock — mirrors shared.jsx lines 487-505 */}
        <div className="text-[color:var(--color-accent)] text-[12px]">
          + {line.path}
        </div>
        <div className="ml-[12px] mt-[2px] text-[12px] text-[color:var(--color-dim)] leading-[1.6]">
          <div>
            <span className="text-[color:var(--color-dim-2)]">scope: </span>
            <span className="text-[color:var(--color-fg)]">
              src/service/retention
            </span>
          </div>
          <div>
            <span className="text-[color:var(--color-dim-2)]">intent: </span>
            <span className="text-[color:var(--color-fg)]">
              re-engage customers with no order in 60+ days
            </span>
          </div>
          <div className="text-[color:var(--color-accent)]">
            desired: [draft opener emails, personalized per segment]
          </div>
          <div className="text-[color:var(--color-todo)]">
            undesired: [generic blasts, discount-only messaging]
          </div>
        </div>
      </div>
    );
  }

  if ("plan" in line) {
    return (
      <div className="pl-[16px] mt-[4px] mb-[4px]">
        {/* FauxPlanBlock — mirrors shared.jsx lines 507-521 */}
        <div className="text-[color:var(--color-plan)] text-[12px]">
          + {line.path}
        </div>
        <div className="ml-[12px] mt-[2px] text-[12px] text-[color:var(--color-dim)] leading-[1.6]">
          <div className="text-[color:var(--color-fg)]">## Prerequisites</div>
          <div>- retention/.aide (spec approved)</div>
          <div className="mt-[2px] text-[color:var(--color-fg)]">
            ## Steps
          </div>
          <div>- [ ] 1. scaffold service module</div>
          <div>- [ ] 2. write segment-query helper</div>
          <div>- [ ] 3. build email-template renderer</div>
          <div>- [ ] 4. wire send queue</div>
          <div>- [ ] 5. unit tests per spec outcomes</div>
        </div>
      </div>
    );
  }

  return null;
}
