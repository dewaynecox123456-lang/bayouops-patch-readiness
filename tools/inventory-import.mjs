import fs from 'fs';
import path from 'path';

const INCOMING =
  'incoming';

function latestCsv(folder) {

  const files =
    fs.readdirSync(folder)
      .filter(f => f.endsWith('.csv'))
      .map(f => ({
        file: f,
        time:
          fs.statSync(
            path.join(folder, f)
          ).mtimeMs
      }))
      .sort((a,b) =>
        b.time - a.time
      );

  if (!files.length) {

    console.log('');
    console.log(
      '[ERROR] No CSV inventory files found.'
    );
    console.log('');

    process.exit(1);
  }

  return path.join(
    folder,
    files[0].file
  );
}

function parseCsv(text) {

  const lines =
    text.trim().split(/\r?\n/);

  const headers =
    lines.shift().split(',');

  return lines.map(line => {

    const values =
      line.split(',');

    return Object.fromEntries(
      headers.map((h, i) => [
        h.trim(),
        values[i]?.trim() || ''
      ])
    );
  });
}

const latestFile =
  latestCsv(INCOMING);

console.log('');
console.log(
  `[INFO] Processing inventory: ${latestFile}`
);
console.log('');

const raw =
  fs.readFileSync(
    latestFile,
    'utf8'
  );

const inventory =
  parseCsv(raw);

fs.mkdirSync(
  'build/inventory',
  { recursive: true }
);

fs.writeFileSync(
  'build/inventory/inventory-normalized.json',
  JSON.stringify(inventory, null, 2)
);

console.log(
  '[SUCCESS] Inventory normalized.'
);

console.log('');
console.log(
  'build/inventory/inventory-normalized.json'
);
console.log('');
