import HowItKnows from "./HowItKnows";
import LocalAndPrivate from "./LocalAndPrivate";
import OneSessionPerProject from "./OneSessionPerProject";
import PipelineRail from "./PipelineRail";
import QuietFifteen from "./QuietFifteen";
import Setup from "./Setup";
import WorkingWaitingEnded from "./WorkingWaitingEnded";

/**
 * The Variant A section grid: six explanatory blocks in a two-column layout,
 * then Setup across the full width. Mirrors the handoff's `.sects` wrapper.
 */
export default function Sections() {
	return (
		<div className="sects">
			<PipelineRail />
			<OneSessionPerProject />
			<WorkingWaitingEnded />
			<HowItKnows />
			<QuietFifteen />
			<LocalAndPrivate />
			<div className="wide">
				<Setup />
			</div>
		</div>
	);
}
