import observerCopy from "@/app/observer/_data/observerCopy";

/**
 * The hero capture of the observer's home view. A plain `<img>` with a 1x/2x
 * `srcSet`, as in the handoff's `Capture` primitive (no caption, no pins);
 * `next/image` is not used because the site is a static export.
 */
export default function CaptureImage() {
	const { src1x, src2x, width, height, alt } = observerCopy.capture;

	return (
		<div className="cap">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={src1x}
				srcSet={`${src1x} 1x, ${src2x} 2x`}
				width={width}
				height={height}
				alt={alt}
			/>
		</div>
	);
}
