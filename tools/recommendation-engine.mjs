import fs from 'fs';

const exposure =
  JSON.parse(
    fs.readFileSync(
      'data/exposure/current-exposure.json',
      'utf8'
    )
  );

function recommendation(severity, issue) {

  if (severity === 'Sev1') {

    return {
      urgency: 'Immediate',
      effort: 'High',
      escalation: 'Operations Manager',
      action:
        'Immediate remediation required'
    };
  }

  if (severity === 'Sev2') {

    return {
      urgency: 'Scheduled',
      effort: 'Medium',
      escalation: 'Infrastructure Team',
      action:
        'Schedule maintenance remediation'
    };
  }

  return {
    urgency: 'Monitor',
    effort: 'Low',
    escalation: 'None',
    action:
      'Monitor operational condition'
  };
}

const enriched =
  exposure.map(item => ({
    ...item,
    recommendation:
      recommendation(
        item.severity,
        item.issue
      )
  }));

fs.writeFileSync(
  'build/recommendations.json',
  JSON.stringify(
    enriched,
    null,
    2
  )
);

console.log('');
console.log(
  '[SUCCESS] Recommendation engine complete.'
);

console.log('');
console.log(
  'build/recommendations.json'
);

console.log('');
