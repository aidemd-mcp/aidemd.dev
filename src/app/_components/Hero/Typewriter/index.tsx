"use client";

import { useEffect, useRef, useState } from "react";

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
 * full reveal. No layout shift regardless of animation state.
 */
export default function Typewriter({ text, speed = 40 }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const directionRef = useRef<"typing" | "pausing">("typing");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function tick() {
      if (directionRef.current === "pausing") {
        directionRef.current = "typing";
        indexRef.current = 0;
        setDisplayed("");
        timerRef.current = setTimeout(tick, speed);
        return;
      }

      indexRef.current += 1;
      const next = text.slice(0, indexRef.current);
      setDisplayed(next);

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
        <span
          className="inline-block w-[2px] h-[0.85em] bg-[color:var(--color-accent)] ml-[2px] align-middle animate-[aideCursor_1s_steps(2)_infinite]"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
