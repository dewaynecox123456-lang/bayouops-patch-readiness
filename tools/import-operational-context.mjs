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
  raw.trim().split('\n');

const header =
  lines.shift()
    .split(',');

const records = [];

for (const line of lines) {

  const cols =
    line.split(',');

  const row = {};

  header.forEach(
    (h, i) => {
      row[h.trim()] =
        cols[i]?.trim() || '';
    }
  );

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
