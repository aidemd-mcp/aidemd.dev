import { describe, it, expect } from "vitest";
import templateLabels from "./index";

describe("templateLabels", () => {
  it("holds exactly the eight shared /learn words and ids", () => {
    expect(templateLabels).toEqual({
      faqHeading: "Frequently asked questions",
      faqId: "faq",
      relatedHeading: "Related",
      relatedId: "related",
      asOfPrefix: "as of",
      updatedLabel: "Updated",
      breadcrumbHome: "home",
      breadcrumbLearn: "learn",
    });
  });
});
