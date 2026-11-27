import observerCopy from "@/app/observer/_data/observerCopy";
import type { ObserverState } from "@/types/observer";
import StateIcon from "./StateIcon";

/**
 * A coloured state label (icon plus word) used by the legend, the section rows
 * and the hook cells. Mirrors the handoff's `SL` primitive: the `end` state
 * shares the `ended` colour class, and `label` overrides the default wording
 * from the copy module.
 */
export default function StateLabel({
	state,
	label,
}: {
	state: ObserverState;
	label?: string;
}) {
	return (
		<span className={"sl " + (state === "end" ? "ended" : state)}>
			<StateIcon state={state} />
			{label ?? observerCopy.stateLabels[state]}
		</span>
	);
}
