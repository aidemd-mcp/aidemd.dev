import path from "node:path";
import archivePages from "./index";

const cwd = process.cwd();

async function main(): Promise<void> {
  await archivePages({
    contentType: "docs",
    urlPrefix: "/docs",
    versionsPath: path.join(cwd, ".aide", "docs", "versions.json"),
  });

  await archivePages({
    contentType: "agents",
    urlPrefix: "/agents",
    versionsPath: path.join(cwd, ".aide", "agents", "versions.json"),
  });

  await archivePages({
    contentType: "commands",
    urlPrefix: "/commands",
    versionsPath: path.join(cwd, ".aide", "commands", "versions.json"),
  });

  await archivePages({
    contentType: "skills",
    urlPrefix: "/skills",
    versionsPath: path.join(cwd, ".aide", "skills", "versions.json"),
  });
}

main().catch((err: unknown) => {
  process.stderr.write(`${(err as Error).message}\n`);
  process.exit(1);
});
