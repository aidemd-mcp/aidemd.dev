import type { HistoryChange, HistoryChangeStatus, HistoryCommit } from '@/types/fileHistory';

const RECORD_SEPARATOR = '\x1e';
const UNIT_SEPARATOR = '\x1f';
const FIELD_END = '\0';

const STATUS_LETTERS: readonly string[] = ['A', 'B', 'C', 'D', 'M', 'R', 'T', 'U', 'X'];

/** Narrows a status token's first letter to git's change letters, so an unknown letter fails loudly instead of being passed on. */
function isStatusLetter(letter: string): letter is HistoryChangeStatus {
  return STATUS_LETTERS.includes(letter);
}

/** Reads one commit's change fields left to right: `R` and `C` take an old and a new path, every other status takes one. */
function parseChanges(fields: readonly string[]): HistoryChange[] {
  const changes: HistoryChange[] = [];
  let index = 0;
  while (index < fields.length) {
    const status = fields[index].charAt(0);
    if (!isStatusLetter(status)) {
      throw new Error(`parseGitLog: unknown change status "${fields[index]}"`);
    }
    const takesTwoPaths = status === 'R' || status === 'C';
    const pathCount = takesTwoPaths ? 2 : 1;
    const paths = fields.slice(index + 1, index + 1 + pathCount);
    if (paths.length < pathCount || paths.some((path) => path === '')) {
      throw new Error(`parseGitLog: status "${fields[index]}" is missing its path`);
    }
    changes.push(takesTwoPaths ? { status, fromPath: paths[0], path: paths[1] } : { status, path: paths[0] });
    index += 1 + pathCount;
  }
  return changes;
}

/** Parses one commit record: the header (hash and date), then the change fields. */
function parseRecord(record: string): HistoryCommit {
  const headerEnd = record.indexOf(FIELD_END);
  const header = headerEnd === -1 ? record : record.slice(0, headerEnd);
  const headerFields = header.split(UNIT_SEPARATOR);
  if (headerFields.length !== 2 || headerFields[0] === '' || headerFields[1] === '') {
    throw new Error(`parseGitLog: malformed commit header "${header}"`);
  }
  const [hash, date] = headerFields;

  const rest = headerEnd === -1 ? '' : record.slice(headerEnd + 1).replace(/^\n/, '');
  const fields = rest.split(FIELD_END);
  if (fields[fields.length - 1] === '') fields.pop();

  return { hash, date, changes: parseChanges(fields) };
}

/**
 * Turns the stdout of the history command (`git log -z --root -M --diff-merges=off
 * --name-status --format=%x1e%h%x1f%aI`) into commits, newest first as git printed
 * them. It parses but never interprets: renames are recorded as they appear and
 * followed elsewhere. Paths are kept exactly as git printed them. Malformed output
 * throws an error starting `parseGitLog:`; empty output is no commits.
 */
export default function parseGitLog(stdout: string): HistoryCommit[] {
  return stdout
    .split(RECORD_SEPARATOR)
    .slice(1)
    .map(parseRecord);
}
