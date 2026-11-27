import Link from "next/link";
import observerCopy from "@/app/observer/_data/observerCopy";
import CodeText from "../shared/CodeText";
import SectionBlock from "../shared/SectionBlock";

/**
 * The "setup" section: port and data-root facts plus the link to the hooks
 * reference in the docs. Mirrors the handoff's `SecSetup`, with the link
 * pointing at the real docs page instead of the prototype's `docs.html#hooks`.
 */
export default function Setup() {
	const { heading, port, dataRoot, docsLink } = observerCopy.setup;

	return (
		<SectionBlock heading={heading}>
			<dl className="kv">
				<dt>{port.label}</dt>
				<dd>
					<CodeText text={port.value} />
				</dd>
				<dt>{dataRoot.label}</dt>
				<dd>
					{dataRoot.lines.map((line) => (
						<div key={line}>
							<CodeText text={line} />
						</div>
					))}
				</dd>
			</dl>
			<Link className="docslink" href={docsLink.href}>
				{docsLink.label}
			</Link>
		</SectionBlock>
	);
}
