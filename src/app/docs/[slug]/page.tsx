import type { Metadata } from "next";
import renderHub from "@/service/docs/renderHub";
import renderCanonical from "@/service/docs/renderCanonical";
import docMeta from "@/service/docs/docMeta";
import DocsPage from "@/components/DocsPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const docs = await renderHub();
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await renderCanonical({ slug });
  const meta = docMeta(slug, doc.citationMeta.publishedAt);

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.canonicalUrl,
      siteName: meta.siteName,
      type: "article",
    },
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = await renderCanonical({ slug });
  const meta = docMeta(slug, doc.citationMeta.publishedAt);

  return (
    <>
      <script
        id={`ld-doc-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(meta.jsonLd) }}
      />
      <DocsPage doc={doc} />
    </>
  );
}
