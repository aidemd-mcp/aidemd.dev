import type { Metadata } from "next";
import artifactMeta from "@/service/scaffold/artifactMeta";
import renderArtifact from "@/service/scaffold/renderArtifact";
import ArtifactPage from "@/components/ArtifactPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [
    { slug: "aide-spec-writer" },
    { slug: "aide-domain-expert" },
    { slug: "aide-strategist" },
    { slug: "aide-architect" },
    { slug: "aide-implementor" },
    { slug: "aide-qa" },
    { slug: "aide-aligner" },
    { slug: "aide-auditor" },
    { slug: "aide-explorer" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seo = artifactMeta({ slug, kind: "agent" });

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalUrl,
      siteName: "AIDE",
      type: "article",
    },
  };
}

export default async function AgentPage({ params }: Props) {
  const { slug } = await params;
  const artifact = await renderArtifact({ slug, kind: "agent" });
  const seo = artifactMeta({ slug, kind: "agent" });

  return (
    <ArtifactPage
      artifact={artifact}
      seo={seo}
      jsonLdId={`ld-agent-${slug}`}
    />
  );
}
