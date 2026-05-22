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

  if (
    query === 'unassigned'
  ) {
    return (
      (ctx.infrastructure_owner || '')
        .toLowerCase() ===
      'unassigned'
    );
  }

  return JSON.stringify(item)
    .toLowerCase()
    .includes(query);
}

const results =
  data.filter(matches);

console.log('');
console.log(
  `BayouOps Query: ${query}`
);

console.log(
  `Results: ${results.length}`
);

console.log('');

console.table(

  results.map(x => ({

    Host:
      x.host,

    Severity:
      x.severity,

    Issue:
      x.issue,

    InfraOwner:
      x.operational_context
        ?.infrastructure_owner,

    AppOwner:
      x.operational_context
        ?.application_owner,

    Site:
      x.operational_context
        ?.site,

    Maintenance:
      x.operational_context
        ?.maintenance_window,

    Escalation:
      x.operational_context
        ?.escalation_contact
  }))
);

console.log('');
