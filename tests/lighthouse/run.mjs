import auditPage from './auditPage/index.mjs';

const ORIGIN = 'http://localhost:4321';
const DEFAULT_PAGES = ['/', '/docs/methodology/aide-spec/', '/learn/intent-driven-engineering/'];
const THRESHOLD = 0.95;
const date = new Date().toISOString().slice(0, 10);

const requested = process.argv.slice(2);
for (const path of requested) {
  if (!path.startsWith('/') || !path.endsWith('/')) {
    console.error(`paths must start and end with "/": ${path}`);
    process.exit(1);
  }
}
const PAGES = requested.length > 0 ? requested : DEFAULT_PAGES;

function slugOf(path) {
  return path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}

async function isServing() {
  try {
    const response = await fetch(`${ORIGIN}/`);
    return response.ok;
  } catch {
    return false;
  }
}

if (!(await isServing())) {
  console.error('start npm run preview first (serves out/ on :4321)');
  process.exit(1);
}

const rows = [];
for (const path of PAGES) {
  const scores = await auditPage({
    url: `${ORIGIN}${path}`,
    outFile: `.lighthouse/${date}-${slugOf(path)}.json`,
  });
  rows.push({ page: path, ...scores });
}

console.table(
  rows.map((row) => ({
    page: row.page,
    performance: Math.round(row.performance * 100),
    accessibility: Math.round(row.accessibility * 100),
    'best-practices': Math.round(row['best-practices'] * 100),
    seo: Math.round(row.seo * 100),
  })),
);

const failing = rows.flatMap(({ page, ...scores }) =>
  Object.entries(scores)
    .filter(([, score]) => score < THRESHOLD)
    .map(([category, score]) => `${page} ${category} ${Math.round(score * 100)}`),
);
if (failing.length > 0) {
  console.error(`below ${THRESHOLD * 100}: ${failing.join('; ')}`);
  process.exit(1);
}
