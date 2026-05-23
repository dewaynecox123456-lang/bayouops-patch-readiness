import fs from 'fs';

const query =
  (process.argv[2] || '')
    .toLowerCase();

if (!query) {

  console.log('');
  console.log('[ERROR] Missing search query.');
  console.log('');
  console.log('Usage:');
  console.log('node tools/query-assets.mjs <search>');
  console.log('');
  process.exit(1);
}

const assets =
  JSON.parse(
    fs.readFileSync(
      'data/ownership/ownership-registry.json',
      'utf8'
    )
  );

const results =
  assets.filter(asset =>

    JSON.stringify(asset)
      .toLowerCase()
      .includes(query)
  );

console.log('');
console.log(
  `BayouOps Asset Query: ${query}`
);

console.log(
  `Results: ${results.length}`
);

console.log('');

if (results.length === 1) {

  const x = results[0];

  console.log(
'========================================'
  );

  console.log(
`HOST: ${x.hostname}`
  );

  console.log(
'========================================'
  );

  console.log('');

  console.log(`Site: ${x.site}`);
  console.log(`Floor: ${x.floor}`);
  console.log(`Rack: ${x.rack_location}`);
  console.log(`Environment: ${x.environment}`);
  console.log(`Platform: ${x.platform}`);

  console.log('');

  console.log('Infrastructure Owner:');
  console.log(x.infrastructure_owner);

  console.log('');

  console.log('Application Owner:');
  console.log(x.application_owner);

  console.log('');

  console.log('Validation Team:');
  console.log(x.validation_team);

  console.log('');

  console.log('Maintenance Window:');
  console.log(x.maintenance_window);

  console.log('');

  console.log('Escalation Contact:');
  console.log(x.escalation_contact);

  console.log('');

  console.log('PCI Scope:');
  console.log(
    x.pci_scope
      ? 'Yes'
      : 'No'
  );

  console.log('');

  console.log('Operational Notes:');
  console.log(
    x.operational_notes || 'None'
  );

  console.log('');

  const noteFile =
    `data/notes/${x.hostname}.md`;

  if (fs.existsSync(noteFile)) {

    console.log(
'========================================'
    );

    console.log(
'ATTACHED OPERATIONAL PROCEDURES'
    );

    console.log(
'========================================'
    );

    console.log('');

    console.log(
      fs.readFileSync(
        noteFile,
        'utf8'
      )
    );

    console.log('');
  }

} else {

  console.table(

    results.map(x => ({

      Hostname:
        x.hostname,

      Site:
        x.site,

      Environment:
        x.environment,

      Platform:
        x.platform,

      InfraOwner:
        x.infrastructure_owner,

      AppOwner:
        x.application_owner
    }))
  );
}

console.log('');
