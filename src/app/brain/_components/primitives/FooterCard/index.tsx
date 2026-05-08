import Link from "next/link";
import cn from "@/lib/cn";

interface FooterCardProps {
  href: string;
  cta: string;
  title: string;
  body?: string;
  external?: boolean;
  className?: string;
}

/**
 * Spec / RELATED card primitive used at the bottom of brain sections.
 * `cta` — small accent-green eyebrow line (e.g. "docs/brain-aide.md →").
 * `title` — bold body title (e.g. "the spec").
 * `body` — optional dim sub-prose.
 * When `external` is true, renders <a target="_blank" rel="noopener noreferrer">.
 * Otherwise renders Next.js <Link>.
 * Matches walkthrough.jsx lines 336–345: card background, 1px border,
 * 2px left accent border, 4px radius, no text-decoration, padding 20px/22px.
 * Server component.
 */
export default function FooterCard({
  href,
  cta,
  title,
  body,
  external = false,
  className,
}: FooterCardProps) {
  const baseClass = cn(
    "flex flex-col px-[22px] py-[20px]",
    "bg-[color:var(--color-card)] border border-[color:var(--color-border)]",
    "border-l-2 border-l-[color:var(--color-accent)]",
    "rounded no-underline text-[color:var(--color-fg)]",
    className
  );

  const content = (
    <>
      <div className="text-[11px] text-[color:var(--color-accent)] tracking-[1.5px] mb-[6px]">
        {cta}
      </div>
      <div className="text-[18px] font-semibold mb-[8px]">{title}</div>
      {body && (
        <div className="text-[13px] text-[color:var(--color-dim)] leading-[1.6]">
          {body}
        </div>
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClass}>
      {content}
    </Link>
  );
}
