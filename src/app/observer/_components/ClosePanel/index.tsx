import observerCopy from "@/app/observer/_data/observerCopy";
import InstallBox from "../shared/InstallBox";

/**
 * The closing call-to-action panel: a heading above the same install box the
 * hero shows. Mirrors the handoff's `Close` primitive.
 */
export default function ClosePanel() {
	return (
		<section className="close">
			<h2>{observerCopy.close.heading}</h2>
			<InstallBox />
		</section>
	);
}
