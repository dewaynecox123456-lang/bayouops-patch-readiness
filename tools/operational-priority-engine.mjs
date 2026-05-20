import fs from 'fs';

const exposure =
  JSON.parse(
    fs.readFileSync(
      'build/context-enriched.json',
      'utf8'
    )
  );

function calculatePriority(item) {

  let score = 0;
  const reasons = [];

  if (item.severity === 'Sev1') {
    score += 50;
    reasons.push('Critical severity');
  }

  if (item.severity === 'Sev2') {
    score += 30;
    reasons.push('Elevated severity');
  }

  if (
    item.issue?.toLowerCase().includes('unsupported')
  ) {
    score += 25;
    reasons.push('Unsupported platform');
  }

  if (
    item.context?.after_hours === 'Unavailable'
  ) {
    score += 20;
    reasons.push('No after-hours support');
  }

  if (
    item.owner === 'Unassigned'
  ) {
    score += 20;
    reasons.push('Missing ownership');
  }

  if (
    item.context?.maintenance_window === 'Undefined'
  ) {
    score += 15;
    reasons.push('Undefined maintenance window');
  }

  if (
    item.status?.toLowerCase() === 'open'
  ) {
    score += 10;
    reasons.push('Issue still open');
  }

  let level = 'Low';

  if (score >= 80) level = 'Critical';
  else if (score >= 55) level = 'High';
  else if (score >= 35) level = 'Medium';

  return {
    score,
    level,
    reasons
  };
}

const enriched =
  exposure.map(item => {

    const priority =
      calculatePriority(item);

    return {
      ...item,
      operational_priority: priority
    };
  });

enriched.sort(
  (a, b) =>
    b.operational_priority.score -
    a.operational_priority.score
);

fs.writeFileSync(
  'build/operational-priority.json',
  JSON.stringify(
    enriched,
    null,
    2
  )
);

console.log('');
console.log(
  '[SUCCESS] Operational priority engine complete.'
);

console.log('');
console.log(
  'build/operational-priority.json'
);

console.log('');
