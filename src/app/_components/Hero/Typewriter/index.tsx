"use client";

import { useEffect, useRef, useState } from "react";
import Caret, { CARET_BLINK_PERIOD_MS } from "./Caret";
import prefersReducedMotion from "./prefersReducedMotion";

interface TypewriterProps {
  text: string;
  speed?: number;
}

/**
 * CLS-safe typewriter headline.
 *
 * The invisible span containing the full text reserves the final box
 * dimensions before first paint. The visible span overlays it and
 * reveals one character per `speed` ms. Cycles with a 2s pause at
 * full reveal. The reserve box keeps the text still; the caret is remounted
 * on every reveal step (keyed by revealed length) with its blink phase carried
 * over, so it never registers as a shifted element. No layout shift regardless
 * of animation state. Visitors with prefers-reduced-motion get the finished
 * headline at once, with no timers.
 */
export default function Typewriter({ text, speed = 40 }: TypewriterProps) {
  const [{ displayed, caretPhaseMs }, setReveal] = useState({ displayed: "", caretPhaseMs: 0 });
  const blinkOriginRef = useRef(0);
  const indexRef = useRef(0);
  const directionRef = useRef<"typing" | "pausing">("typing");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReveal({ displayed: text, caretPhaseMs: 0 });
      return;
    }

    blinkOriginRef.current = performance.now();

    function reveal(next: string) {
      const caretPhase = (performance.now() - blinkOriginRef.current) % CARET_BLINK_PERIOD_MS;
      setReveal({ displayed: next, caretPhaseMs: caretPhase });
    }

    function tick() {
      if (directionRef.current === "pausing") {
        directionRef.current = "typing";
        indexRef.current = 0;
        reveal("");
        timerRef.current = setTimeout(tick, speed);
        return;
      }

      indexRef.current += 1;
      const next = text.slice(0, indexRef.current);
      reveal(next);

      if (indexRef.current >= text.length) {
        directionRef.current = "pausing";
        timerRef.current = setTimeout(tick, 2000);
      } else {
        timerRef.current = setTimeout(tick, speed);
      }
    }

    timerRef.current = setTimeout(tick, speed);
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [text, speed]);

  return (
    <span className="relative block">
      {/* Screen-reader exposure — static, announced once, never updated */}
      <span className="sr-only">{text}</span>
      {/* Reserve final box dimensions — invisible but occupies space */}
      <span
        className="block"
        style={{ visibility: "hidden", userSelect: "none" }}
        aria-hidden="true"
      >
        {text}
      </span>
      {/* Visible overlay — absolutely positioned over the reserved space */}
      <span
        className="absolute inset-0 block"
        aria-hidden="true"
      >
        {displayed}
        <Caret key={displayed.length} phaseMs={caretPhaseMs} />
      </span>
    </span>
  );
}
