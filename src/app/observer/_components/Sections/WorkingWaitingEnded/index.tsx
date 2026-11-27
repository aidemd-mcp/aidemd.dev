import observerCopy from "@/app/observer/_data/observerCopy";
import StateLabel from "../../shared/StateLabel";
import SectionBlock from "../shared/SectionBlock";

/**
 * The "working, waiting, ended" section: one row per lifecycle state. Mirrors
 * the handoff's `SecStates`; the trailing DRAFT-marker paragraph is not
 * rendered. The inline `marginTop: 0` is the handoff's own and stays because
 * a Tailwind utility cannot beat the unlayered page stylesheet.
 */
export default function WorkingWaitingEnded() {
	const { heading, rows } = observerCopy.states;

	return (
		<SectionBlock heading={heading}>
			<div className="rows" style={{ marginTop: 0 }}>
				{rows.map((row) => (
					<div key={row.state}>
						<StateLabel
							state={row.state}
							label={"label" in row ? row.label : undefined}
						/>
						<p>{row.text}</p>
					</div>
				))}
			</div>
		</SectionBlock>
	);
}
