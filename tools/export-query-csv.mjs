import fs from 'fs';

const query =
  (process.argv[2] || 'all')
    .toLowerCase();

const data =
  JSON.parse(
    fs.readFileSync(
      'build/enriched-findings.json',
      'utf8'
    )
  );

function matches(item) {

  const ctx =
    item.operational_context || {};

  if (query === 'all')
    return true;

  if (query === 'sev1')
    return item.severity === 'Sev1';

  if (query === 'sev2')
    return item.severity === 'Sev2';

  if (
    query === 'reboot'
  ) {
    return (
      item.issue
        .toLowerCase()
        .includes('reboot')
    );
  }

  if (
    query === 'prod-control'
  ) {
    return (
      (ctx.application_owner || '')
        .toLowerCase()
        .includes('prod')
    );
  }

  if (
    query === 'approval-required'
  ) {
    return (
      ctx.reboot_approval_required === true
    );
  }

  return JSON.stringify(item)
    .toLowerCase()
    .includes(query);
}

const results =
  data.filter(matches);

const rows = [];

rows.push([
  'Host',
  'Severity',
  'Issue',
  'InfrastructureOwner',
  'ApplicationOwner',
  'Site',
  'MaintenanceWindow',
  'EscalationContact'
].join(','));

for (const item of results) {

  const ctx =
    item.operational_context || {};

  rows.push([
    item.host,
    item.severity,
    `"${item.issue}"`,
    `"${ctx.infrastructure_owner || ''}"`,
    `"${ctx.application_owner || ''}"`,
    `"${ctx.site || ''}"`,
    `"${ctx.maintenance_window || ''}"`,
    `"${ctx.escalation_contact || ''}"`
  ].join(','));
}

fs.mkdirSync(
  'exports',
  { recursive: true }
);

const out =
  `exports/query-${query}.csv`;

fs.writeFileSync(
  out,
  rows.join('\n')
);

console.log('');
console.log(
  `[SUCCESS] CSV export created:`
);

console.log(out);

console.log('');
