import CaptureImage from "./CaptureImage";
import StateLegend from "./StateLegend";

/**
 * The capture and its state legend, side by side. A `div`, not a `<figure>`:
 * the handoff's `.capgrid` is a div and a figure would add default margins.
 */
export default function CaptureFigure() {
	return (
		<div className="capgrid">
			<CaptureImage />
			<StateLegend />
		</div>
	);
}
