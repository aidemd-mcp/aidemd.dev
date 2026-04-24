"use client";

import { useState } from "react";
import cn from "@/lib/cn";
import { PIPELINE_STAGES } from "@/data/pipeline";
import type { PipelineStage } from "@/types/pipeline";
import StageButton from "./StageButton";
import StagePanel from "./StagePanel";

/**
 * §02 the pipeline — interactive stage selector.
 * Local state tracks active stage; panel remounts with key for 180ms fade animation.
 */
export default function Pipeline() {
  const [activeId, setActiveId] = useState<PipelineStage["id"]>("spec");
  const activeStage = PIPELINE_STAGES.find((s) => s.id === activeId)!;

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-[6px] mb-[20px]">
        {PIPELINE_STAGES.map((stage, i) => (
          <StageButton
            key={stage.id}
            stage={stage}
            index={i}
            isActive={stage.id === activeId}
            onSelect={setActiveId}
          />
        ))}
      </div>
      <div
        key={activeId}
        className={cn(
          "transition-all duration-[180ms]",
          "opacity-100 translate-y-0"
        )}
      >
        <StagePanel stage={activeStage} />
      </div>
    </div>
  );
}
