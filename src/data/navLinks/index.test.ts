import { describe, it, expect } from "vitest";
import navLinks from "./index";

describe("navLinks roster", () => {
  it("lists the five entries in order", () => {
    expect(navLinks.map((link) => link.label)).toEqual([
      "docs",
      "brain",
      "observer",
      "github ↗",
      "npm ↗",
    ]);
  });

  it("points each entry at its href", () => {
    expect(navLinks.map((link) => link.href)).toEqual([
      "/docs",
      "/brain",
      "/observer",
      "https://github.com/aidemd-mcp/server",
      "https://www.npmjs.com/package/@aidemd-mcp/server",
    ]);
  });

  it("shows docs, brain and observer on mobile and hides github and npm", () => {
    const visibility = Object.fromEntries(
      navLinks.map((link) => [link.label, link.mobileVisible]),
    );
    expect(visibility).toEqual({
      docs: true,
      brain: true,
      observer: true,
      "github ↗": false,
      "npm ↗": false,
    });
  });

  it("flags only github and npm as external", () => {
    expect(navLinks.filter((link) => link.external).map((link) => link.label)).toEqual([
      "github ↗",
      "npm ↗",
    ]);
  });
});
