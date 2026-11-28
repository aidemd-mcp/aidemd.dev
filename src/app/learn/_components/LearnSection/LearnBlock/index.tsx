import CodeBlock from "@/components/CodeBlock";
import getHighlighter from "@/lib/shiki";
import type { LearnBlock as LearnBlockRecord } from "@/types/learn";
import RichTextRuns from "../../shared/RichTextRuns";
import GlossaryList from "../GlossaryList";

interface LearnBlockProps {
  block: LearnBlockRecord;
}

/**
 * One content block of a section. Async only so a code block can await the
 * shared highlighter and render with the same `aide-theme` and CodeBlock as
 * docs code; every other kind is synchronous.
 */
export default async function LearnBlock({ block }: LearnBlockProps) {
  switch (block.kind) {
    case "paragraph":
      return (
        <p>
          <RichTextRuns text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul>
          {block.items.map((item, index) => (
            <li key={index}>
              <RichTextRuns text={item} />
            </li>
          ))}
        </ul>
      );
    case "code": {
      const highlighter = await getHighlighter();
      const html = highlighter.codeToHtml(block.code, {
        lang: block.lang,
        theme: "aide-theme",
      });
      return <CodeBlock html={html} code={block.code} label={block.lang} />;
    }
    case "glossary":
      return <GlossaryList terms={block.terms} />;
  }
}
