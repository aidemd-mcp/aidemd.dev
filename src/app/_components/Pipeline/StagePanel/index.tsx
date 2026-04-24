import type { PipelineStage } from "@/types/pipeline";
import IOBlock from "../IOBlock";

interface StagePanelProps {
  stage: PipelineStage;
}

/**
 * Detail panel for the active pipeline stage.
 * 2-col grid: left = cmd/name/role/detail, right = reads + writes IOBlocks.
 */
export default function StagePanel({ stage }: StagePanelProps) {
  return (
    <div
      className="bg-[color:var(--color-card)] border border-[color:var(--color-accent)] rounded-[8px]"
      style={{ padding: "24px 26px" }}
    >
      <div className="grid grid-cols-2 gap-[32px]">
        {/* Left column */}
        <div>
          <div
            className="font-mono text-[11px] text-[color:var(--color-accent)] mb-[6px]"
            style={{ letterSpacing: "1px" }}
          >
            {stage.cmd.toUpperCase()}
          </div>
          <div className="text-[22px] font-semibold text-[color:var(--color-fg)] mb-[8px]">
            {stage.name}
          </div>
          <div className="text-[14px] text-[color:var(--color-fg)] leading-[1.55] mb-[14px]">
            {stage.role}
          </div>
          <div className="text-[13px] text-[color:var(--color-dim)] leading-[1.6]">
            {stage.detail}
          </div>
        </div>
        {/* Right column */}
        <div className="flex flex-col gap-[14px]">
          <IOBlock label="reads" items={stage.reads} />
          <IOBlock label="writes" items={stage.writes} />
        </div>
      </div>
    </div>
  );
}
