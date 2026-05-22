import fs from 'fs';

const findings =
  JSON.parse(
    fs.readFileSync(
      'build/enriched-findings.json',
      'utf8'
    )
  );

const summary = {

  total_findings:
    findings.length,

  sev1:
    findings.filter(
      x => x.severity === 'Sev1'
    ).length,

  sev2:
    findings.filter(
      x => x.severity === 'Sev2'
    ).length,

  approval_required:
    findings.filter(
      x =>
        x.operational_context
          ?.reboot_approval_required === true
    ).length,

  missing_owners:
    findings.filter(
      x =>
        (
          x.operational_context
            ?.infrastructure_owner || ''
        ).toLowerCase() ===
        'unassigned'
    ).length,

  prod_control_systems:
    findings.filter(
      x =>
        (
          x.operational_context
            ?.application_owner || ''
        ).toLowerCase()
         .includes('prod')
    ).length
};

fs.mkdirSync(
  'build/dashboard',
  { recursive: true }
);

fs.writeFileSync(
  'build/dashboard/dashboard-summary.json',
  JSON.stringify(
    summary,
    null,
    2
  )
);

console.log('');
console.log(
  '[SUCCESS] Dashboard operational summary built.'
);

console.log('');
console.log(
  'build/dashboard/dashboard-summary.json'
);

console.log('');
