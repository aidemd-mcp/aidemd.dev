import observerCopy from "@/app/observer/_data/observerCopy";
import StateLabel from "../../shared/StateLabel";
import SectionBlock from "../shared/SectionBlock";

/**
 * The "quiet for 15 minutes" section: the maybe-stuck rule with its state
 * label. Mirrors the handoff's `SecQuiet`.
 */
export default function QuietFifteen() {
	const { heading, body } = observerCopy.quiet;

	return (
		<SectionBlock heading={heading}>
			<p>{body}</p>
			<p>
				<StateLabel state="stuck" />
			</p>
		</SectionBlock>
	);
}
