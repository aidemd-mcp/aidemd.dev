import type { LearnTemplateLabels } from "@/types/learn";

/**
 * The only words a /learn page shows that are not in its copy record. The page
 * template, the page list (breadcrumb names) and the markdown copy all read
 * them here, so each string exists once. The author credit is not a label: the
 * template reads `siteIdentity.name`.
 */
const templateLabels = {
  faqHeading: "Frequently asked questions",
  faqId: "faq",
  relatedHeading: "Related",
  relatedId: "related",
  asOfPrefix: "as of",
  updatedLabel: "Updated",
  breadcrumbHome: "home",
  breadcrumbLearn: "learn",
} as const satisfies LearnTemplateLabels;

export default templateLabels;
