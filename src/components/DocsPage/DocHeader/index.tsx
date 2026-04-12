import type { CitationMeta } from "@/types/docs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://aidemd.dev";

type DocHeaderProps = {
  citationMeta: CitationMeta;
};

const DocHeader = ({ citationMeta }: DocHeaderProps) => {
  const { publishedAt, sourceCommit, versionedUrl, waybackUrl } = citationMeta;

  const citeUrl = `${SITE_URL}${versionedUrl}`;

  return (
    <header className="mb-10 pb-8 border-b border-zinc-800">
      <dl className="flex flex-col gap-2 text-sm font-mono text-zinc-400">
        <div className="flex gap-3">
          <dt className="text-zinc-500 flex-none">Published</dt>
          <dd>{publishedAt}</dd>
        </div>

        <div className="flex gap-3">
          <dt className="text-zinc-500 flex-none">Source commit</dt>
          <dd>
            <code className="text-zinc-300">{sourceCommit}</code>
          </dd>
        </div>

        <div className="flex gap-3">
          <dt className="text-zinc-500 flex-none">Cite as</dt>
          <dd>
            <a
              href={citeUrl}
              className="text-zinc-300 hover:text-zinc-100 transition-colors underline underline-offset-2"
            >
              {citeUrl}
            </a>
          </dd>
        </div>

        {waybackUrl && (
          <div className="flex gap-3">
            <dt className="text-zinc-500 flex-none">Archived</dt>
            <dd>
              <a
                href={waybackUrl}
                className="text-zinc-300 hover:text-zinc-100 transition-colors underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {waybackUrl}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </header>
  );
};

export default DocHeader;
