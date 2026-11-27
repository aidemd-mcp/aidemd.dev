import observerCopy from "@/app/observer/_data/observerCopy";

/**
 * The row of short facts under the install box. Mirrors the markup of the
 * handoff's `HeroCopy` fact row; the green separator dot comes from CSS.
 */
export default function FactList() {
	return (
		<div className="o2-facts">
			{observerCopy.facts.map((fact) => (
				<span key={fact}>{fact}</span>
			))}
		</div>
	);
}
