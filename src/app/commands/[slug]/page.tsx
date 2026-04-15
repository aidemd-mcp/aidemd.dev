import type { Metadata } from "next";
import artifactMeta from "@/service/scaffold/artifactMeta";
import renderArtifact from "@/service/scaffold/renderArtifact";
import ArtifactPage from "@/components/ArtifactPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [
    { slug: "aide" },
    { slug: "aide-spec" },
    { slug: "aide-research" },
    { slug: "aide-synthesize" },
    { slug: "aide-plan" },
    { slug: "aide-build" },
    { slug: "aide-qa" },
    { slug: "aide-fix" },
    { slug: "aide-refactor" },
    { slug: "aide-align" },
    { slug: "aide-init" },
    { slug: "aide-upgrade" },
    { slug: "aide-update-playbook" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seo = artifactMeta({ slug, kind: "command" });

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

export default async function CommandPage({ params }: Props) {
  const { slug } = await params;
  const artifact = await renderArtifact({ slug, kind: "command" });
  const seo = artifactMeta({ slug, kind: "command" });

  return (
    <ArtifactPage
      artifact={artifact}
      seo={seo}
      jsonLdId={`ld-command-${slug}`}
    />
  );
}
