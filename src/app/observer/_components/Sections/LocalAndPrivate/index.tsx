import observerCopy from "@/app/observer/_data/observerCopy";
import SectionBlock from "../shared/SectionBlock";

/**
 * The "local and private" section: where the observer serves and what it
 * never does. Mirrors the handoff's `SecLocal`.
 */
export default function LocalAndPrivate() {
	const { heading, body } = observerCopy.local;

	return (
		<SectionBlock heading={heading}>
			<p>{body}</p>
		</SectionBlock>
	);
}
