import observerCopy from "@/app/observer/_data/observerCopy";
import StateLabel from "../../shared/StateLabel";
import SectionBlock from "../shared/SectionBlock";
import AgentReply from "./AgentReply";

/**
 * The "one open session per project" section: the rule, its three outcomes
 * (HALT, end session, BLOCKED) and the two real agent replies. Mirrors the
 * handoff's `SecOwn`.
 */
export default function OneSessionPerProject() {
	const { heading, body, rows } = observerCopy.own;

	return (
		<SectionBlock heading={heading}>
			<p>{body}</p>
			<div className="rows">
				{rows.map(({ state, text }) => (
					<div key={state}>
						<StateLabel state={state} />
						<p>{text}</p>
					</div>
				))}
			</div>
			<div className="reply">
				<AgentReply kind="halt" />
				<AgentReply kind="blocked" />
			</div>
		</SectionBlock>
	);
}
