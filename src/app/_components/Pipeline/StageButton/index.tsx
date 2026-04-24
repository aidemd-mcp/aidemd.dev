"use client";

import cn from "@/lib/cn";
import type { PipelineStage } from "@/types/pipeline";

interface StageButtonProps {
  stage: PipelineStage;
  isActive: boolean;
  onSelect: (id: PipelineStage["id"]) => void;
  index: number;
}

/**
 * Individual pipeline stage tab button.
 * Active: card bg, accent border, accent name color.
 * When active, a 14×14 rotated-45° accent-bordered square sits at bottom-center as a downward pointer.
 */
export default function StageButton({ stage, isActive, onSelect, index }: StageButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(stage.id)}
      className={cn(
        "relative text-left p-[14px_14px_16px] rounded-[6px] border transition-all duration-[160ms] cursor-pointer",
        isActive
          ? "bg-[color:var(--color-card)] border-[color:var(--color-accent)]"
          : "bg-[color:var(--color-bg)] border-[color:var(--color-border)]"
      )}
    >
      <div className="font-mono text-[11px] text-[color:var(--color-dim)] mb-[6px]">
        {String(index + 1).padStart(2, "0")} · {stage.cmd}
      </div>
      <div
        className={cn(
          "text-[14px] font-semibold",
          isActive ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-fg)]"
        )}
      >
        {stage.name}
      </div>
      {isActive && (
        <div
          aria-hidden="true"
          className="absolute w-[14px] h-[14px] bg-[color:var(--color-card)] border-l border-b border-[color:var(--color-accent)]"
          style={{
            left: "50%",
            bottom: -8,
            transform: "translateX(-50%) rotate(-45deg)",
          }}
        />
      )}
    </button>
  );
}
