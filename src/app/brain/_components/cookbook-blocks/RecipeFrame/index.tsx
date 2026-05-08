import type { ReactNode } from "react";

interface RecipeFrameProps {
  title: string;
  sub: string;
  children: ReactNode;
}

/**
 * Frame wrapping every recipe body. Maps to JSX `wrap(...)` helper (lines 100–107).
 * Renders:
 *   - dim "RECIPE" eyebrow (11px, dim, tracking 1.5px, mb 6px)
 *   - bold <h2> title (26px, fw 600, letter-spacing -0.3, mb 8px)
 *   - dim subtitle paragraph (13px, dim, line-height 1.65, mb 22px, max-w 720px)
 *   - children slot
 * Server component.
 */
export default function RecipeFrame({ title, sub, children }: RecipeFrameProps) {
  return (
    <div>
      <div className="text-[11px] text-[color:var(--color-dim)] tracking-[1.5px] mb-[6px]">
        RECIPE
      </div>
      <h2 className="text-[26px] font-semibold m-0 mb-[8px] tracking-[-0.3px]">
        {title}
      </h2>
      <div className="text-[13px] text-[color:var(--color-dim)] leading-[1.65] mb-[22px] max-w-[720px]">
        {sub}
      </div>
      {children}
    </div>
  );
}
