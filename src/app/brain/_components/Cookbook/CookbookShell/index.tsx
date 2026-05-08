"use client";

import { useState } from "react";
import { type RecipeKey } from "@/app/brain/_data/recipeIndex";
import RecipeRail from "@/app/brain/_components/Cookbook/RecipeRail";
import RecipeBody from "@/app/brain/_components/Cookbook/RecipeBody";
import WalkthroughCrossLink from "@/app/brain/_components/Cookbook/WalkthroughCrossLink";
import SkeletonCompact from "@/app/brain/_components/interactive/SkeletonCompact";

/**
 * Client shell that owns activeKey state and lays out the 3-column grid.
 * Maps to JSX three-column section (lines 47–84).
 *
 * State: activeKey: RecipeKey (default 'quickstart', matching JSX line 6–7)
 *
 * Layout: grid-cols-[240px_1fr_380px]
 *   LEFT col:  <RecipeRail/> + <WalkthroughCrossLink/> (RELATED card below rail)
 *   CENTER col: <main><RecipeBody/></main>
 *   RIGHT col:  sticky aside — "STICKY · LIVE GENERATOR" eyebrow + <SkeletonCompact/>
 */
export default function CookbookShell() {
  const [activeKey, setActiveKey] = useState<RecipeKey>("quickstart");

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_380px] min-h-[600px]">
      {/* LEFT — rail + related card */}
      <aside className="md:border-r border-b md:border-b-0 border-[color:var(--color-border)]">
        <RecipeRail activeKey={activeKey} onSelect={setActiveKey} />
        <WalkthroughCrossLink />
      </aside>

      {/* CENTER — recipe body */}
      <main className="px-[24px] md:px-[36px] py-[28px] pb-[60px]">
        <RecipeBody recipeKey={activeKey} />
      </main>

      {/* RIGHT — generator (sticky on md+, normal block on mobile) */}
      <aside className="md:border-l border-t md:border-t-0 border-[color:var(--color-border)] px-[24px] py-[24px] pb-[40px]">
        <div className="relative md:sticky md:top-24">
          <div className="text-[11px] text-[color:var(--color-dim)] tracking-[1.5px] mb-[10px]">
            STICKY · LIVE GENERATOR
          </div>
          <SkeletonCompact />
        </div>
      </aside>
    </div>
  );
}
