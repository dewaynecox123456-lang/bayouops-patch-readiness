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


function formatLabel(filename) {
  const match = filename.match(
    /(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})_(.*)\.csv/
  );

  if (!match) return filename;

  const [
    _,
    year,
    month,
    day,
    hour,
    minute,
    second,
    suffix
  ] = match;

  const label =
    suffix
      .replace(/-/g,' ')
      .replace(/\b\w/g,c=>c.toUpperCase());

  return `${month}/${day} ${hour}:${minute} — ${label}`;
}



function classifySeverity(score) {

  if (score < 60) {
    return 'Sev1';
  }

  if (score < 85) {
    return 'Sev2';
  }

  return 'Sev3';
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

  const systems =
    rows.map(row => {
      const systemScore = score(row);

      return {
        host:
          row.ComputerName ||
          row.Hostname ||
          row.Server ||
          'Unknown',

        score: systemScore,

        severity:
          classifySeverity(systemScore),

        reboot:
          row.RebootPending,

        owner:
          row.Owner || 'Unassigned'
      };
    });

  trend.push({
    file,
    label: formatLabel(file),
    systems: rows.length,
    readiness,
    worstSystems:
      systems
        .sort((a,b)=>a.score-b.score)
        .slice(0,5)
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
