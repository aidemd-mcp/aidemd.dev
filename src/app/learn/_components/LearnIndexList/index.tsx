import Link from "next/link";
import type { LearnRosterEntry } from "@/types/learn";

interface LearnIndexListProps {
  entries: LearnRosterEntry[];
}

/** The /learn index list: each page's title as a link, then its description, in the order given. */
export default function LearnIndexList({ entries }: LearnIndexListProps) {
  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.slug}>
          <Link href={entry.urlPath}>{entry.title}</Link>
          {` — ${entry.description}`}
        </li>
      ))}
    </ul>
  );
}
