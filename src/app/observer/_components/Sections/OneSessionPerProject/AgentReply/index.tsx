import observerCopy from "@/app/observer/_data/observerCopy";
import type { AgentReplyKind } from "@/types/observer";

/**
 * One agent-reply terminal block (HALT or BLOCKED): header strip plus the
 * server's reply text with its leading word in bold. Mirrors the handoff's
 * `AgentReply` minus the `.ph` placeholder tag, which the real reply format
 * replaces.
 */
export default function AgentReply({ kind }: { kind: AgentReplyKind }) {
	const { replyHeader, replies } = observerCopy.own;
	const { word, rest } = replies[kind];

	return (
		<div>
			<div className="rh">
				<span>{replyHeader}</span>
			</div>
			<pre>
				<b>{word}</b>
				{rest}
			</pre>
		</div>
	);
}
