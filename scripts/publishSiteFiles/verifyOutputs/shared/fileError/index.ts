/** Builds the error every read-back check throws: it names the file and the broken rule. */
export default function fileError(file: string, rule: string): Error {
  return new Error(`publishSiteFiles: ${file}: ${rule}`);
}
