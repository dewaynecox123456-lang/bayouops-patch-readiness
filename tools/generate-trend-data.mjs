import fs from 'fs';
import path from 'path';

const HISTORY_DIR = 'data/history';

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');

  return lines.map(line => {
    const values = line.split(',');
    return Object.fromEntries(
      headers.map((h, i) => [h.trim(), values[i]?.trim() || ''])
    );
  });
}

function isLegacy(os = '') {
  return os.includes('2012') || os.includes('2008');
}

function score(row) {
  let s = 100;

  if (row.RebootPending === 'True') s -= 15;
  if (row.WUA !== 'Running') s -= 20;
  if (row.BITS !== 'Running') s -= 10;
  if (!row.Owner) s -= 15;
  if (!row.LOB) s -= 10;
  if (isLegacy(row.OS)) s -= 25;
  if (parseInt(row.Uptime || '0') > 90) s -= 10;

  return Math.max(s, 0);
}

if (!fs.existsSync(HISTORY_DIR)) {
  console.error(`[ERROR] History directory missing: ${HISTORY_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(HISTORY_DIR)
  .filter(f => f.endsWith('.csv'))
  .sort();

const trend = [];

for (const file of files) {
  const full = path.join(HISTORY_DIR, file);
  const rows = parseCsv(fs.readFileSync(full, 'utf8'));

  const readiness = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + score(row), 0) / rows.length)
    : 0;

  trend.push({
    file,
    systems: rows.length,
    readiness
  });
}

fs.mkdirSync('build', { recursive: true });

fs.writeFileSync(
  'build/readiness-trend.json',
  JSON.stringify(trend, null, 2)
);

console.log('');
console.log('[SUCCESS] Trend data generated:');
console.log('');
console.log('build/readiness-trend.json');
console.log('');
