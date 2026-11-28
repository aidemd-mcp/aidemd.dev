import type { RichText } from "@/types/learn";
import RichTextRuns from "../shared/RichTextRuns";
import LearnByline from "./LearnByline";

interface LearnHeaderProps {
  h1: string;
  answer: RichText;
  modified?: string;
}

/**
 * The page head: the H1, the answer paragraph as its next element sibling
 * (nothing renders between them), then the date and author line.
 */
export default function LearnHeader({ h1, answer, modified }: LearnHeaderProps) {
  return (
    <header>
      <h1>{h1}</h1>
      <p>
        <RichTextRuns text={answer} />
      </p>
      <LearnByline modified={modified} />
    </header>
  );
}
