import Link from "next/link";
import templateLabels from "@/data/learn/templateLabels";
import type { RelatedLink } from "@/types/learn";

interface RelatedLinksProps {
  links: RelatedLink[];
}

/** The page's related list: internal hrefs through next/link, external ones as plain anchors. */
export default function RelatedLinks({ links }: RelatedLinksProps) {
  return (
    <nav aria-labelledby={templateLabels.relatedId}>
      <h2 id={templateLabels.relatedId}>{templateLabels.relatedHeading}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            {link.href.startsWith("/") ? (
              <Link href={link.href}>{link.label}</Link>
            ) : (
              <a href={link.href} rel="noopener">
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
