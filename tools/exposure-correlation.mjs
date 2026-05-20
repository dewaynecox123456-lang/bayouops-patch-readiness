import fs from 'fs';

const inventory =
  JSON.parse(
    fs.readFileSync(
      'build/inventory/inventory-normalized.json',
      'utf8'
    )
  );

const rules =
  JSON.parse(
    fs.readFileSync(
      'data/rules/exposure-rules.json',
      'utf8'
    )
  );

const findings = [];

for (const system of inventory) {

  for (const rule of rules) {

    const haystack =
      JSON.stringify(system);

    if (
      haystack.includes(rule.match)
    ) {

      findings.push({

        host:
          system.ComputerName,

        severity:
          rule.severity,

        issue:
          rule.issue,

        recommendation:
          rule.recommendation,

        owner:
          system.Owner || 'Unassigned',

        status:
          'Open'
      });
    }
  }
}

findings.sort((a,b) => {

  const rank = {
    Sev1: 1,
    Sev2: 2,
    Sev3: 3
  };

  return rank[a.severity]
       - rank[b.severity];
});

fs.writeFileSync(
  'data/exposure/current-exposure.json',
  JSON.stringify(findings, null, 2)
);

console.log('');
console.log('[SUCCESS] Exposure correlation complete.');
console.log('');
console.log(
  'Updated: data/exposure/current-exposure.json'
);
console.log('');
