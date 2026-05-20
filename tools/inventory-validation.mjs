import fs from 'fs';

const inventory =
  JSON.parse(
    fs.readFileSync(
      'build/inventory/inventory-normalized.json',
      'utf8'
    )
  );

const findings = [];

const hosts = new Set();

for (const row of inventory) {

  const host =
    row.ComputerName?.trim();

  if (!host) {

    findings.push({
      severity: 'Sev1',
      issue: 'Missing hostname',
      recommendation:
        'Validate inventory export'
    });

  } else {

    if (hosts.has(host)) {

      findings.push({
        severity: 'Sev2',
        host,
        issue: 'Duplicate hostname',
        recommendation:
          'Review inventory duplication'
      });
    }

    hosts.add(host);
  }

  if (!row.Owner?.trim()) {

    findings.push({
      severity: 'Sev2',
      host,
      issue: 'Missing owner',
      recommendation:
        'Assign operational owner'
    });
  }

  if (!row.OS?.trim()) {

    findings.push({
      severity: 'Sev2',
      host,
      issue: 'Missing operating system',
      recommendation:
        'Validate inventory completeness'
    });
  }
}

const score =
  Math.max(
    0,
    100 - (findings.length * 10)
  );

fs.writeFileSync(
  'build/inventory/inventory-validation.json',
  JSON.stringify({
    score,
    findings
  }, null, 2)
);

console.log('');
console.log(
  '[SUCCESS] Inventory validation complete.'
);

console.log('');
console.log(
  `Inventory Hygiene Score: ${score}%`
);

console.log('');
