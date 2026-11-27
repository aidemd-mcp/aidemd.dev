import type { ReactNode } from "react";

/**
 * One titled block of the page's section grid. Mirrors the handoff's `Blk`
 * without the Variant B number and id; the `h2 > span` wrapper is what
 * `observer.css` styles.
 */
export default function SectionBlock({
	heading,
	children,
}: {
	heading: string;
	children: ReactNode;
}) {
	return (
		<section className="blk">
			<h2>
				<span>{heading}</span>
			</h2>
			<div>{children}</div>
		</section>
	);
}
