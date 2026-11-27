import type { ReactNode } from "react";
import type { ObserverState } from "@/types/observer";

const checkPath = (
	<path
		d="M2.5 7.4l3 3 6-6.4"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.9"
		strokeLinecap="round"
		strokeLinejoin="round"
	/>
);

const glyphs: Record<ObserverState, ReactNode> = {
	working: <circle cx="7" cy="7" r="5" fill="currentColor" />,
	waiting: (
		<circle
			cx="7"
			cy="7"
			r="4.6"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
		/>
	),
	ended: checkPath,
	halt: <path d="M4.6 1h4.8L13 4.6v4.8L9.4 13H4.6L1 9.4V4.6z" fill="currentColor" />,
	blocked: <path d="M7 1.2L13.2 12.6H.8z" fill="currentColor" />,
	stuck: (
		<path
			d="M7 1.9L12.4 11.8H1.6z"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinejoin="round"
		/>
	),
	end: checkPath,
};

/**
 * The shape half of a state label: every state pairs a distinct glyph with a
 * word so colour is never the only signal. Mirrors the handoff's `SI`
 * primitive (the draft-only `pend` glyph is not shipped); the `.si` class sizes
 * and aligns it in `observer.css`.
 */
export default function StateIcon({ state }: { state: ObserverState }) {
	return (
		<svg className="si" viewBox="0 0 14 14" aria-hidden="true">
			{glyphs[state]}
		</svg>
	);
}
