import { describe, it, expect } from "vitest";
import countWords from "./index";

describe("countWords", () => {
  it.each([
    ["", 0],
    ["   \n\t ", 0],
    ["word", 1],
    ["  two   words  ", 2],
    ["one\ntwo\tthree four", 4],
    ["intent-driven engineering", 2],
    ["@aidemd-mcp/server", 1],
  ])("counts %j as %i", (text, expected) => {
    expect(countWords(text)).toBe(expected);
  });
});
