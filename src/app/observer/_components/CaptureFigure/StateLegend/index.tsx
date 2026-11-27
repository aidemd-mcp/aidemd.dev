import observerCopy from "@/app/observer/_data/observerCopy";
import StateLabel from "../../shared/StateLabel";

/**
 * The state legend beside the capture: one row per observer state, a
 * separator, then the two agent-reply states that never appear in the
 * observer. Mirrors the handoff's Variant A `Legend`.
 */
export default function StateLegend() {
	const { ariaLabel, title, rows, separator, replyRows } = observerCopy.legend;

	return (
		<aside className="legend" aria-label={ariaLabel}>
			<h3>{title}</h3>
			{rows.map(({ state, text }) => (
				<div key={state}>
					<StateLabel state={state} />
					<small>{text}</small>
				</div>
			))}
			<div className="sep">{separator}</div>
			{replyRows.map(({ state, text }) => (
				<div key={state}>
					<StateLabel state={state} />
					<small>{text}</small>
				</div>
			))}
		</aside>
	);
}
