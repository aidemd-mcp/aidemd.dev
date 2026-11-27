import { Fragment } from "react";

/**
 * Renders copy that marks inline code with backticks: odd segments of the
 * backtick split become `<code>`, even ones plain text. Mirrors the handoff's
 * `Tx` primitive so the copy module can stay plain strings.
 */
export default function CodeText({ text }: { text: string }) {
	return text
		.split("`")
		.map((segment, index) =>
			index % 2 ? (
				<code key={index}>{segment}</code>
			) : (
				<Fragment key={index}>{segment}</Fragment>
			),
		);
}
