import {
  HERO_A_EYEBROW,
  HERO_A_LINE_1,
  HERO_A_LINE_2,
  HERO_A_SUBHEAD,
  HERO_A_SUBHEAD_ACCENT,
  HERO_A_CHECKS,
} from "@/app/brain/_data/brainCopy";

/**
 * Walkthrough variant hero block.
 * Matches brain-variant-walkthrough.jsx lines 22–39.
 * Renders: accent eyebrow, two-line h1 (line 2 dimmed), subhead paragraph
 * (with inline accent span around brain.aide), and the checkmark trio.
 * Server component.
 */
export default function Hero() {
  // Split the subhead around the accent word for inline span injection.
  const accentIdx = HERO_A_SUBHEAD.indexOf(HERO_A_SUBHEAD_ACCENT);
  const before = HERO_A_SUBHEAD.slice(0, accentIdx);
  const after = HERO_A_SUBHEAD.slice(accentIdx + HERO_A_SUBHEAD_ACCENT.length);

  return (
    <div className="px-[24px] md:px-[64px] pt-[60px] pb-[40px] max-w-[1180px]">
      <div className="text-[12px] text-[color:var(--color-accent)] tracking-[2px] mb-[16px]">
        {HERO_A_EYEBROW}
      </div>
      <h1
        className="text-[56px] m-0 font-medium leading-[1.05]"
        style={{ letterSpacing: -0.5 }}
      >
        {HERO_A_LINE_1}
        <br />
        <span className="text-[color:var(--color-dim)]">{HERO_A_LINE_2}</span>
      </h1>
      <p className="text-[16px] leading-[1.7] text-[color:var(--color-dim)] mt-[22px] max-w-[720px]">
        {before}
        <span className="text-[color:var(--color-accent)]">{HERO_A_SUBHEAD_ACCENT}</span>
        {after}
      </p>
      <div className="flex flex-wrap items-center gap-[14px] mt-[24px] text-[12px] text-[color:var(--color-dim)]">
        {HERO_A_CHECKS.map((check) => (
          <span key={check} className="flex items-center gap-[4px]">
            <span className="text-[color:var(--color-accent)]">[ ✓ ]</span>
            <span>{check}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
