import Eyebrow from "@/app/brain/_components/primitives/Eyebrow";
import {
  HERO_B_EYEBROW,
  HERO_B_LINE_1,
  HERO_B_LINE_2,
  HERO_B_LINE_3,
  HERO_B_SUBHEAD_LINES,
} from "@/app/brain/_data/brainCopy";

/**
 * Cookbook hero strip. Maps to JSX hero strip (lines 34–44).
 * Renders:
 *   - Eyebrow: HERO_B_EYEBROW ("# brain.aide cookbook")
 *   - <h1>: HERO_B_LINE_1 + accent span(HERO_B_LINE_2) + HERO_B_LINE_3
 *     → "recipes for the [brain] plugin interface." where [brain] is accent-colored
 *   - Two dim subhead lines from HERO_B_SUBHEAD_LINES separated by <br/>
 * Server component.
 */
export default function Hero() {
  return (
    <div className="px-[16px] md:px-[36px] pt-[36px] pb-[28px] border-b border-[color:var(--color-border)]">
      <Eyebrow className="mb-[10px]">{HERO_B_EYEBROW}</Eyebrow>
      <h1 className="text-[38px] m-0 font-medium leading-[1.1] tracking-[-0.5px]">
        {HERO_B_LINE_1}
        <span className="text-[color:var(--color-accent)]">{HERO_B_LINE_2}</span>
        {HERO_B_LINE_3}
      </h1>
      <div className="text-[13px] text-[color:var(--color-dim)] mt-[12px] max-w-[760px] leading-[1.65]">
        {HERO_B_SUBHEAD_LINES[0]}
        <br />
        {HERO_B_SUBHEAD_LINES[1]}
      </div>
    </div>
  );
}
