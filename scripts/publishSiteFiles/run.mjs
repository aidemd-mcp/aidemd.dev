const { default: publishSiteFiles } = await import('./index.ts');
const path = await import('node:path');

try {
  const report = await publishSiteFiles({
    publicDir: path.resolve(process.cwd(), 'public'),
    now: new Date(),
  });
  process.stdout.write(
    `site files published — ${report.files} files, ${report.markdownCopies} markdown copies, ${report.shareImages} share images, ${report.feedEntries} feed entries\n`,
  );
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
