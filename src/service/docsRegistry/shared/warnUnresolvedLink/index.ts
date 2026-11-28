import path from 'node:path';

/**
 * Keys already warned about in this process, one per (linking file, resolved target).
 * The registry build and Next's metadata and page renders all see the same broken
 * link, and the log must show it once.
 */
const warned = new Set<string>();

/** Formats an absolute path relative to process.cwd() with `/` separators, for build-log lines. */
function toLogPath(absPath: string): string {
  return path.relative(process.cwd(), absPath).split(path.sep).join('/');
}

/**
 * Prints the one build warning for a doc link whose target doc does not exist.
 * Deduplicated per process on the normalized linking file plus the normalized
 * resolved target, not on the href string: the HTML render and the markdown body
 * can see the same link in different encodings, but they resolve to the same path.
 * A warning never fails the build; the link stays as written.
 */
export default function warnUnresolvedLink({
  href,
  fromPath,
  resolvedPath,
}: {
  href: string;
  fromPath: string;
  resolvedPath: string;
}): void {
  const normalizedFrom = path.normalize(fromPath);
  const normalizedTarget = path.normalize(resolvedPath);
  const key = `${normalizedFrom}\n${normalizedTarget}`;
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(
    `docsRegistry: unresolved doc link "${href}" in ${toLogPath(normalizedFrom)} — no doc at ${toLogPath(normalizedTarget)}; left as written`,
  );
}
