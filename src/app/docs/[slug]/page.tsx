import type { Metadata } from "next";
import renderHub from "@/service/docs/renderHub";
import renderCanonical from "@/service/docs/renderCanonical";
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

  return {
    title: `${doc.title} — AIDE`,
    description: `Canonical AIDE methodology document: ${doc.title}`,
    openGraph: {
      title: `${doc.title} — AIDE`,
      description: `Canonical AIDE methodology document: ${doc.title}`,
      url: `https://aidemd.dev/docs/${slug}`,
      siteName: "AIDE",
      type: "article",
    },
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = await renderCanonical({ slug });
  return <DocsPage doc={doc} />;
}
