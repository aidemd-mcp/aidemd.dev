import Breadcrumb from "@/app/docs/_components/DocsTemplate/Breadcrumb";
import type { BreadcrumbItem } from "@/types/sitePage";

interface LearnBreadcrumbProps {
  breadcrumb: BreadcrumbItem[];
}

/**
 * The visible trail, reusing the docs Breadcrumb so it looks exactly like the
 * docs trail. The labels and order are the page list's entry for this page, the
 * same entry the BreadcrumbList record is built from; the last step is plain
 * text, as the docs Breadcrumb renders it.
 */
export default function LearnBreadcrumb({ breadcrumb }: LearnBreadcrumbProps) {
  const lastIndex = breadcrumb.length - 1;
  const segments = breadcrumb.map((item, index) =>
    index === lastIndex
      ? { label: item.name }
      : { label: item.name, href: item.urlPath },
  );
  return (
    <nav aria-label="Breadcrumb">
      <Breadcrumb segments={segments} />
    </nav>
  );
}
