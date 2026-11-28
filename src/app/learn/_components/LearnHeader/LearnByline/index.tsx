import siteIdentity from "@/data/siteIdentity";
import templateLabels from "@/data/learn/templateLabels";

interface LearnBylineProps {
  modified?: string;
}

/**
 * The slim date and author line under the answer: "Updated <date> · <author>",
 * or the author alone when no date is known. The date is the first ten
 * characters of the page's git author date, never a build stamp. The author is
 * the organization; no person and no link.
 */
export default function LearnByline({ modified }: LearnBylineProps) {
  const date = modified?.slice(0, 10);
  return (
    <div className="mb-[28px] text-[12px] text-[color:var(--color-dim-text)]">
      {date ? (
        <>
          {templateLabels.updatedLabel} <time dateTime={date}>{date}</time>
          {` · ${siteIdentity.name}`}
        </>
      ) : (
        siteIdentity.name
      )}
    </div>
  );
}
