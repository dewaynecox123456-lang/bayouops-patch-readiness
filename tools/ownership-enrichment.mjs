import fs from 'fs';

const findings =
  JSON.parse(
    fs.readFileSync(
      'data/exposure/current-exposure.json',
      'utf8'
    )
  );

const ownership =
  JSON.parse(
    fs.readFileSync(
      'data/ownership/ownership-registry.json',
      'utf8'
    )
  );

const enriched =
  findings.map(finding => {

    const context =
      ownership.find(
        x =>
          x.hostname.toLowerCase() ===
          finding.host.toLowerCase()
      );

    return {

      ...finding,

      operational_context:
        context || {

          infrastructure_owner:
            'Unassigned',

          application_owner:
            'Unknown',

          site:
            'Unknown',

          rack_location:
            'Unknown',

          criticality:
            'Unknown',

          maintenance_window:
            'Unknown',

          escalation_contact:
            'Unknown',

          field_contact:
            'Unknown',

          reboot_approval_required:
            false,

          validation_team:
            'Unknown',

          operational_notes:
            'No operational footprint registered'
        }
    };
  });

fs.mkdirSync(
  'build',
  { recursive: true }
);

fs.writeFileSync(
  'build/enriched-findings.json',
  JSON.stringify(
    enriched,
    null,
    2
  )
);

console.log('');
console.log(
  '[SUCCESS] Operational ownership enrichment complete.'
);

console.log('');
console.log(
  'build/enriched-findings.json'
);

console.log('');
