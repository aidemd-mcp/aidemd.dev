import type { CitationMeta } from "@/types/docs";
import Link from "next/link";

type DocHeaderProps = {
  citationMeta: CitationMeta;
};

const DocHeader = ({ citationMeta }: DocHeaderProps) => {
  const {
    publishedAt,
    sourceCommit,
    versionedUrl,
    previousVersionUrl,
    waybackUrl,
  } = citationMeta;

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
              href={`https://${versionedUrl}`}
              className="text-zinc-300 hover:text-zinc-100 transition-colors underline underline-offset-2"
            >
              {versionedUrl}
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

        {previousVersionUrl && (
          <div className="flex gap-3">
            <dt className="text-zinc-500 flex-none">Errata</dt>
            <dd>
              <Link
                href={previousVersionUrl}
                className="text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2"
              >
                A newer version of this document exists
              </Link>
            </dd>
          </div>
        )}
      </dl>
    </header>
  );
};

export default DocHeader;
