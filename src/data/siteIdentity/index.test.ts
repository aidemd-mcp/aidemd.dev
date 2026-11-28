import { describe, it, expect } from "vitest";
import siteIdentity from "./index";

describe("siteIdentity record", () => {
  it("has exactly the five keys and no profile, sameAs or person field", () => {
    expect(Object.keys(siteIdentity).sort()).toEqual(
      ["logo", "name", "securityContact", "siteName", "url"],
    );
  });

  it("holds the exact values", () => {
    expect(siteIdentity.name).toBe("Lowmeadow LLC");
    expect(siteIdentity.siteName).toBe("aidemd.dev");
    expect(siteIdentity.url).toBe("https://aidemd.dev");
    expect(siteIdentity.logo).toBe("https://aidemd.dev/icon-512.png");
    expect(siteIdentity.securityContact).toBe(
      "https://github.com/aidemd-mcp/server/security/advisories/new",
    );
  });

  it("has no trailing slash on url", () => {
    expect(siteIdentity.url.endsWith("/")).toBe(false);
  });

  it("points no value other than securityContact at github.com or npmjs.com", () => {
    const { securityContact: _securityContact, ...rest } = siteIdentity;
    for (const value of Object.values(rest)) {
      expect(value).not.toMatch(/github\.com|npmjs\.com/);
    }
  });

  it("never contains the old company name", () => {
    for (const value of Object.values(siteIdentity)) {
      expect(value.toLowerCase()).not.toContain("tetsukod");
    }
  });
});
