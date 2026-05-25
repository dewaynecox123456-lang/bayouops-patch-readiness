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
    text.trim()
      .split(/\r?\n/)
      .filter(line => line.trim());

  if (!lines.length) {

    throw new Error(
      'CSV file is empty.'
    );
  }

  const headers =
    lines.shift()
      .split(',')
      .map(h => h.trim());

  const uniqueHeaders =
    new Set(headers);

  if (
    headers.some(h => !h)
    || uniqueHeaders.size !== headers.length
  ) {

    throw new Error(
      'CSV header row must contain unique non-empty column names.'
    );
  }

  if (!headers.includes('ComputerName')) {

    throw new Error(
      'CSV inventory must include a ComputerName column.'
    );
  }

  return lines.map((line, index) => {

    const values =
      line.split(',');

    if (values.length > headers.length) {

      // Keep validation conservative: fail only when a row has extra columns the current parser cannot map safely.
      throw new Error(
        `CSV row ${index + 2} has more columns than the header row.`
      );
    }

    return Object.fromEntries(
      headers.map((h, i) => [
        h,
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

let inventory;

try {

  inventory =
    parseCsv(raw);

} catch (error) {

  console.log('');
  console.log(
    `[ERROR] ${error.message}`
  );
  console.log('');
  process.exit(1);
}

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
