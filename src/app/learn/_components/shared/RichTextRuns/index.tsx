import Link from "next/link";
import type { RichText } from "@/types/learn";

interface RichTextRunsProps {
  text: RichText;
}

/**
 * Renders one piece of record prose: runs in order with nothing added between
 * them. A text run is its text; a link run whose href starts with `/` is an
 * internal next/link; any other link run is an external anchor.
 *
 * The visible text equals the record's flattened text (every run's `text`
 * concatenated in order), which is what the FAQ and definition records carry.
 */
export default function RichTextRuns({ text }: RichTextRunsProps) {
  return (
    <>
      {text.map((run, index) => {
        if (run.kind === "text") return run.text;
        if (run.href.startsWith("/")) {
          return (
            <Link key={index} href={run.href}>
              {run.text}
            </Link>
          );
        }
        return (
          <a key={index} href={run.href} rel="noopener">
            {run.text}
          </a>
        );
      })}
    </>
  );
}
