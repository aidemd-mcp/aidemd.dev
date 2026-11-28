import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { LearnSlug } from "@/types/learn";
import copyBySlug from "@/data/learn/copyBySlug";
import priorityOrder from "@/data/learn/priorityOrder";
import sourcePathBySlug from "./index";

describe("sourcePathBySlug", () => {
  it.each(priorityOrder.map((slug) => [slug]))("%s names an existing copy module", async (slug) => {
    const sourcePath = sourcePathBySlug[slug as LearnSlug];
    expect(sourcePath).not.toContain("\\");
    expect(existsSync(path.resolve(process.cwd(), sourcePath))).toBe(true);

    const imported = (await import(/* @vite-ignore */ path.resolve(process.cwd(), sourcePath))) as { default: unknown };
    expect(imported.default).toBe(copyBySlug[slug as LearnSlug]);
  });
});
