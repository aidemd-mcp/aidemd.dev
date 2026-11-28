/**
 * What version history says about one file. A field is absent when history
 * cannot say it, never an empty string or a guessed value.
 */
export type FileHistory = {
  /** Author date (ISO 8601 with offset) of the commit that first added the file, following renames back to its original name. */
  firstAdded?: string;
  /** Author date (ISO 8601 with offset) of the newest commit that touched the file. */
  lastChanged?: string;
  /** Short id of the newest commit that touched the file. */
  lastCommit?: string;
};

/** The change letter git prints per file: added, broken pair, copied, deleted, modified, renamed, type changed, unmerged, unknown. */
export type HistoryChangeStatus = 'A' | 'B' | 'C' | 'D' | 'M' | 'R' | 'T' | 'U' | 'X';

/** One file change in one commit; `path` is repository-relative with `/` separators as git prints it, `fromPath` is the source path, present only for a rename or copy. */
export type HistoryChange = {
  status: HistoryChangeStatus;
  path: string;
  fromPath?: string;
};

/** One commit of the history read: short id, author date (ISO 8601 with offset) and the files it changed (empty for a merge or an empty commit). */
export type HistoryCommit = {
  hash: string;
  date: string;
  changes: HistoryChange[];
};
