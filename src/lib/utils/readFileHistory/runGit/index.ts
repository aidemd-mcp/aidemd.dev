import { execFileSync } from 'node:child_process';

/**
 * Runs git with an argument array and returns its raw stdout.
 *
 * No shell is involved: arguments reach git untouched, so nothing needs
 * quoting and the `%` signs in a `--format` string are not read as variable
 * references (through `cmd.exe` on Windows, `%x1e%` would be). The output
 * buffer is raised to 64 MB because Node's 1 MB default overflows as history
 * grows, and an overflow must fail, never truncate the output.
 *
 * Any failure (non-zero exit, git missing, buffer overflow) is rethrown with
 * the `readFileHistory:` prefix and the command that failed.
 */
export default function runGit(args: readonly string[]): string {
  try {
    return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`readFileHistory: git ${args.join(' ')} failed: ${reason}`);
  }
}
