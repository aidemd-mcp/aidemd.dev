import type { CanonicalDoc } from "@/types/docs";
import DocLayout from "@/components/DocsPage/DocLayout";
import DocHeader from "@/components/DocsPage/DocHeader";
import DocToc from "@/components/DocsPage/DocToc";
import DocBody from "@/components/DocsPage/DocBody";
import InstallFooter from "@/components/shared/InstallFooter";

type DocsPageProps = {
  doc: CanonicalDoc;
};

const DocsPage = ({ doc }: DocsPageProps) => {
  return (
    <DocLayout>
      <DocHeader citationMeta={doc.citationMeta} />
      <DocToc contentHtml={doc.contentHtml} />
      <DocBody contentHtml={doc.contentHtml} />
      <InstallFooter />
    </DocLayout>
  );
};

export default DocsPage;
