import { describe, it, expect } from "vitest";
import observerCopy from "../observerCopy";
import observerMetadata from ".";

describe("observerMetadata", () => {
  it("uses an absolute title that bypasses the root template", () => {
    expect(observerMetadata.title).toEqual({ absolute: "the observer · AIDEMD.DEV" });
  });

  it("sets the canonical and og:url to the trailing-slash page URL", () => {
    expect(observerMetadata.alternates?.canonical).toBe("https://aidemd.dev/observer/");
    expect(observerMetadata.openGraph?.url).toBe("https://aidemd.dev/observer/");
  });

  it("uses the hero capture as the OG image at its natural size", () => {
    const images = observerMetadata.openGraph?.images as Array<{
      url: string;
      width: number;
      height: number;
    }>;
    expect(images[0].url).toBe("/observer/observer-capture-aidemd.png");
    expect(images[0].width).toBe(1440);
    expect(images[0].height).toBe(1180);
  });

  it("restates the shared og:type and og:site_name", () => {
    expect(observerMetadata.openGraph).toMatchObject({
      type: "website",
      siteName: expect.any(String),
    });
  });

  it("uses a large-image twitter card with an image", () => {
    expect(observerMetadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(observerMetadata.twitter?.images).toBeDefined();
  });

  it("sets the description to the page subhead", () => {
    expect(observerMetadata.description).toBe(observerCopy.sub);
  });
});
