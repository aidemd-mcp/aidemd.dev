"use client";

import { useState } from "react";

/**
 * The page's only client component: copies the install command and flips its
 * label for 1.4 s. Mirrors the handoff's `Install` button exactly, including
 * flipping the label when the clipboard API is missing. Labels arrive as props
 * so the client bundle never imports the copy module; `.o2 .o2-cmd button`
 * styles it, hence no className.
 */
export default function CopyButton({
	text,
	idleLabel,
	copiedLabel,
}: {
	text: string;
	idleLabel: string;
	copiedLabel: string;
}) {
	const [copied, setCopied] = useState(false);

	return (
		<button
			type="button"
			onClick={() => {
				navigator.clipboard && navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), 1400);
			}}
		>
			{copied ? copiedLabel : idleLabel}
		</button>
	);
}
