import observerCopy from "@/app/observer/_data/observerCopy";
import CodeText from "../shared/CodeText";
import SectionBlock from "../shared/SectionBlock";

/**
 * The "pipeline rail" section: a sentence on what each session reports plus
 * the rail screenshot. Mirrors the handoff's `SecRail`, without the DRAFT
 * marker and Variant B number.
 */
export default function PipelineRail() {
	const { heading, body, image } = observerCopy.rail;

	return (
		<SectionBlock heading={heading}>
			<p>
				<CodeText text={body} />
			</p>
			<div className="railshot">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={image.src1x}
					srcSet={`${image.src1x} 1x, ${image.src2x} 2x`}
					width={image.width}
					height={image.height}
					alt={image.alt}
				/>
			</div>
		</SectionBlock>
	);
}
