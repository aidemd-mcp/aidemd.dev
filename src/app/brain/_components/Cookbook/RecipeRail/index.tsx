"use client";

import { RECIPE_INDEX, type RecipeKey } from "@/app/brain/_data/recipeIndex";
import cn from "@/lib/cn";

interface RecipeRailProps {
  activeKey: RecipeKey;
  onSelect: (k: RecipeKey) => void;
}

/**
 * Vertical list of recipe nav buttons.
 * Maps to JSX rail (lines 49–66).
 * Props-driven — no internal state.
 *
 * Each button:
 *   - Block display, full-width, left-aligned
 *   - Active: border-l-2 accent, accent bg tint, accent label foreground
 *   - Inactive: transparent border-left, fg label
 *   - Shows entry.label (12.5px line 1) + dim entry.subtitle (11px line 2)
 */
export default function RecipeRail({ activeKey, onSelect }: RecipeRailProps) {
  return (
    <div className="py-[20px]">
      {RECIPE_INDEX.map((entry) => {
        const active = entry.id === activeKey;
        return (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelect(entry.id)}
            className={cn(
              "block w-full text-left px-[22px] py-[12px] font-mono cursor-pointer",
              "border-l-2 border-none transition-colors",
              active
                ? "bg-[rgba(61,107,74,0.12)] border-l-[color:var(--color-accent)]"
                : "bg-transparent border-l-transparent"
            )}
            style={{
              borderLeft: `2px solid ${active ? "var(--color-accent)" : "transparent"}`,
            }}
          >
            <div
              className={cn(
                "text-[12.5px] mb-[2px]",
                active
                  ? "text-[color:var(--color-accent)]"
                  : "text-[color:var(--color-fg)]"
              )}
            >
              {entry.label}
            </div>
            <div className="text-[11px] text-[color:var(--color-dim)]">
              {entry.subtitle}
            </div>
          </button>
        );
      })}
    </div>
  );
}
