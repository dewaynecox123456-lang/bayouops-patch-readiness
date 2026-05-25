import fs from 'fs';

const file =
  process.argv[2];

if (!file) {

  console.log('');
  console.log(
    '[ERROR] Missing CSV file.'
  );

  console.log('');
  console.log(
    'Usage:'
  );

  console.log(
    'node tools/import-operational-context.mjs <file.csv>'
  );

  console.log('');
  process.exit(1);
}

if (!fs.existsSync(file)) {

  console.log('');
  console.log(
    `[ERROR] File not found: ${file}`
  );

  console.log('');
  process.exit(1);
}

const raw =
  fs.readFileSync(
    file,
    'utf8'
  );

const lines =
  raw.trim()
    .split(/\r?\n/)
    .filter(line => line.trim());

if (!lines.length) {

  console.log('');
  console.log(
    '[ERROR] CSV file is empty.'
  );
  console.log('');
  process.exit(1);
}

const header =
  lines.shift()
    .split(',')
    .map(h => h.trim());

const requiredColumns = [
  'Hostname',
  'Environment'
];

const uniqueHeader =
  new Set(header);

if (
  header.some(h => !h)
  || uniqueHeader.size !== header.length
) {

  console.log('');
  console.log(
    '[ERROR] CSV header row must contain unique non-empty column names.'
  );
  console.log('');
  process.exit(1);
}

const missingColumns =
  requiredColumns.filter(
    column => !header.includes(column)
  );

if (missingColumns.length) {

  console.log('');
  console.log(
    `[ERROR] Missing required CSV columns: ${missingColumns.join(', ')}`
  );
  console.log('');
  process.exit(1);
}

const records = [];

for (const [index, line] of lines.entries()) {

  const cols =
    line.split(',');

  if (cols.length > header.length) {

    // Extra columns are rejected because this lightweight parser does not support quoted commas.
    console.log('');
    console.log(
      `[ERROR] CSV row ${index + 2} has more columns than the header row.`
    );
    console.log('');
    process.exit(1);
  }

  const row = {};

  header.forEach(
    (h, i) => {
      row[h] =
        cols[i]?.trim() || '';
    }
  );

  if (!row.Hostname) {

    console.log('');
    console.log(
      `[ERROR] CSV row ${index + 2} is missing Hostname.`
    );
    console.log('');
    process.exit(1);
  }

  records.push({

    hostname:
      row.Hostname,

    infrastructure_owner:
      row.OperationalOwner,

    application_owner:
      row.ApplicationOwner,

    site:
      row.Site,

    floor:
      row.Floor,

    rack_location:
      row.Rack,

    environment:
      row.Environment,

    platform:
      row.Platform,

    maintenance_window:
      row.MaintenanceWindow,

    escalation_contact:
      row.EscalationContact,

    validation_team:
      row.ValidationTeam,

    pci_scope:
      (
        row.PCI || ''
      ).toLowerCase() === 'yes',

    reboot_approval_required:
      row.Environment
        .toLowerCase()
        .includes('prod'),

    operational_notes:
      row.Notes || ''
  });
}

fs.mkdirSync(
  'data/ownership',
  { recursive: true }
);

fs.writeFileSync(
  'data/ownership/ownership-registry.json',
  JSON.stringify(
    records,
    null,
    2
  )
);

console.log('');
console.log(
  '[SUCCESS] Operational context import complete.'
);

console.log('');
console.log(
  `Imported systems: ${records.length}`
);

console.log('');
console.log(
  'data/ownership/ownership-registry.json'
);

console.log('');
