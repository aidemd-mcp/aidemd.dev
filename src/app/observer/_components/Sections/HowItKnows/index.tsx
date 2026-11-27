import observerCopy from "@/app/observer/_data/observerCopy";
import StateLabel from "../../shared/StateLabel";
import CodeText from "../shared/CodeText";
import SectionBlock from "../shared/SectionBlock";

/**
 * The "how it knows" section: the hook explanation and one cell per Claude
 * Code hook event with the state it signals. Mirrors the handoff's `SecHow`.
 */
export default function HowItKnows() {
	const { heading, body, hooks } = observerCopy.how;

	return (
		<SectionBlock heading={heading}>
			<p>
				<CodeText text={body} />
			</p>
			<div className="hooks">
				{hooks.map(({ event, state, label }) => (
					<div key={event}>
						<code>{event}</code>
						<StateLabel state={state} label={label} />
					</div>
				))}
			</div>
		</SectionBlock>
	);
}
