type TocEntry = {
  level: 2 | 3;
  id: string;
  text: string;
};

type DocTocProps = {
  contentHtml: string;
};

function extractHeadings(html: string): TocEntry[] {
  const headingPattern = /<h([23])[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h[23]>/gi;
  const entries: TocEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingPattern.exec(html)) !== null) {
    const level = parseInt(match[1], 10) as 2 | 3;
    const id = match[2];
    // Strip any inner HTML tags to get plain text
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    if (id && text) {
      entries.push({ level, id, text });
    }
  }

  return entries;
}

const DocToc = ({ contentHtml }: DocTocProps) => {
  const headings = extractHeadings(contentHtml);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 pb-8 border-b border-zinc-800"
    >
      <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
        Contents
      </p>
      <ol className="flex flex-col gap-1">
        {headings.map((entry) => (
          <li
            key={entry.id}
            className={entry.level === 3 ? "pl-4" : ""}
          >
            <a
              href={`#${entry.id}`}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default DocToc;
