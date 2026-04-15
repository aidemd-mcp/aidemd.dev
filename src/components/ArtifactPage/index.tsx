import type { ScaffoldArtifact, PageSeo } from "@/types/scaffold";
import DocLayout from "@/components/DocsPage/DocLayout";
import InstallFooter from "@/components/shared/InstallFooter";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://aidemd.dev";

type ArtifactPageProps = {
  artifact: ScaffoldArtifact;
  seo: PageSeo;
  jsonLdId: string;
};

/**
 * Shared page component for agent, command, and skill artifact pages.
 *
 * Renders the artifact title, citation metadata header (published date, commit
 * SHA, citation URL), markdown content, TechArticle JSON-LD, and install footer
 * inside the standard DocLayout shell. Route pages supply the artifact and seo
 * objects; this component handles the rendering only.
 */
const ArtifactPage = ({ artifact, seo, jsonLdId }: ArtifactPageProps) => {
  const { publishedAt, commitSha } = artifact;
  const citeUrl = commitSha
    ? `${SITE_URL}${new URL(seo.canonicalUrl).pathname}?v=${commitSha}`
    : seo.canonicalUrl;

  const jsonLdWithDate = {
    ...seo.jsonLd,
    datePublished: publishedAt,
  };

  return (
    <DocLayout>
      <article>
        <h1 className="text-2xl font-bold font-mono text-zinc-100 mb-8">
          {artifact.title}
        </h1>

        <header className="mb-10 pb-8 border-b border-zinc-800">
          <dl className="flex flex-col gap-2 text-sm font-mono text-zinc-400">
            <div className="flex gap-3">
              <dt className="text-zinc-500 flex-none">Published</dt>
              <dd>{publishedAt}</dd>
            </div>

            {commitSha && (
              <div className="flex gap-3">
                <dt className="text-zinc-500 flex-none">Source commit</dt>
                <dd>
                  <code className="text-zinc-300">{commitSha}</code>
                </dd>
              </div>
            )}

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
          </dl>
        </header>

        <div
          className="prose prose-invert prose-zinc max-w-none prose-headings:font-mono prose-code:text-zinc-300 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:overflow-x-auto prose-hr:my-12 prose-a:text-zinc-300 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-zinc-100 overflow-hidden mb-16"
          dangerouslySetInnerHTML={{ __html: artifact.contentHtml }}
        />
      </article>
      <script
        id={jsonLdId}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWithDate) }}
      />
      <InstallFooter />
    </DocLayout>
  );
};

export default ArtifactPage;
