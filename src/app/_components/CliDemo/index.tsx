"use client";

import { useEffect, useRef, useState } from "react";
import { DEMO_SCRIPT } from "@/data/demoScript";
import TrafficLights from "@/app/_components/TopBar/TrafficLights";
import DemoCursor from "./DemoCursor";
import DemoLine from "./DemoLine";

type PlayState = "playing" | "paused";

/**
 * Animated CLI terminal demo.
 *
 * Auto-starts on mount and loops. Timer logic ported from shared.jsx CLIDemo
 * (lines 424-444): 900ms delay for prompts, 360ms for all other output lines.
 * Scroll container is 360px tall with auto-scroll on each step advance.
 */
export default function CliDemo() {
  const [step, setStep] = useState(0);
  const [playState, setPlayState] = useState<PlayState>("playing");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever a new line appears
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [step]);

  // Advance timer
  useEffect(() => {
    if (playState !== "playing") return;

    const visibleLines = DEMO_SCRIPT.slice(0, step);
    const nextLine = DEMO_SCRIPT[step];
    if (!nextLine) {
      // Loop: pause briefly then restart
      const loopTimer = setTimeout(() => setStep(0), 1200);
      return () => clearTimeout(loopTimer);
    }

    const delay = "prompt" in nextLine ? 900 : 360;
    const timer = setTimeout(() => setStep((s) => s + 1), delay);
    return () => clearTimeout(timer);
  }, [step, playState]);

  function handlePause() {
    setPlayState("paused");
  }

  function handlePlay() {
    setPlayState("playing");
  }

  function handleRestart() {
    setStep(0);
    setPlayState("playing");
  }

  const isPlaying = playState === "playing";

  return (
    <div
      className="border border-[color:var(--color-border)] rounded-[8px] overflow-hidden"
      style={{ background: "var(--color-card-2)" }}
    >
      {/* Terminal chrome row */}
      <div className="flex items-center gap-[12px] px-[16px] py-[10px] border-b border-[color:var(--color-border)] bg-[color:var(--color-card)]">
        <TrafficLights />
        <span className="flex-1 text-center text-[11px] text-[color:var(--color-dim)] font-mono">
          ~/my-app — zsh — aide
        </span>
        {/* Playback controls */}
        <div className="flex items-center gap-[12px] text-[11px] font-mono">
          <button
            onClick={handlePause}
            disabled={!isPlaying}
            className="text-[color:var(--color-dim)] hover:text-[color:var(--color-fg)] disabled:opacity-40 transition-opacity cursor-pointer"
            aria-label="Pause demo"
          >
            ⏸ pause
          </button>
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="text-[color:var(--color-dim)] hover:text-[color:var(--color-fg)] disabled:opacity-40 transition-opacity cursor-pointer"
            aria-label="Play demo"
          >
            ▶ play
          </button>
          <button
            onClick={handleRestart}
            className="text-[color:var(--color-dim)] hover:text-[color:var(--color-fg)] transition-opacity cursor-pointer"
            aria-label="Restart demo"
          >
            ↻ restart
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div
        ref={scrollRef}
        className="overflow-y-auto px-[18px] py-[14px] font-mono text-[13px] leading-[1.75] space-y-[2px]"
        style={{ height: "360px" }}
      >
        {DEMO_SCRIPT.slice(0, step).map((line, i) => (
          <DemoLine key={i} line={line} />
        ))}
        {/* Blinking cursor at tail while playing */}
        {isPlaying && <DemoCursor />}
      </div>
    </div>
  );
}
