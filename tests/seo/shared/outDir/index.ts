import path from 'node:path';

/** Absolute path of the static export every built-site check reads. */
const outDir: string = path.resolve(__dirname, '../../../../out');

export default outDir;
