import type { Metadata } from "next";
import artifactMeta from "@/service/scaffold/artifactMeta";
import renderArtifact from "@/service/scaffold/renderArtifact";
import ArtifactPage from "@/components/ArtifactPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [{ slug: "study-playbook" }, { slug: "brain" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seo = artifactMeta({ slug, kind: "skill" });

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

export default async function SkillPage({ params }: Props) {
  const { slug } = await params;
  const artifact = await renderArtifact({ slug, kind: "skill" });
  const seo = artifactMeta({ slug, kind: "skill" });

  return (
    <ArtifactPage
      artifact={artifact}
      seo={seo}
      jsonLdId={`ld-skill-${slug}`}
    />
  );
}
