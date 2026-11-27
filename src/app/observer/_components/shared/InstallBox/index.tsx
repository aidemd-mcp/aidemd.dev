import observerCopy from "@/app/observer/_data/observerCopy";
import CopyButton from "./CopyButton";

/**
 * The install command box with its copy button and the "then run /aide" line,
 * shown in both the hero and the closing panel. Mirrors the handoff's
 * `Install` primitive; all strings come from the copy module.
 */
export default function InstallBox() {
	const { install, copyButton, then } = observerCopy;

	return (
		<div className="o2-act">
			<div className="o2-cmd">
				<span className="p">$</span>
				<span>{install}</span>
				<CopyButton
					text={install}
					idleLabel={copyButton.idle}
					copiedLabel={copyButton.done}
				/>
			</div>
			<div className="o2-then">
				<span>
					{then.lead}
					<b>{then.command}</b>
					{then.trail}
				</span>
				<code>{then.address}</code>
			</div>
		</div>
	);
}
