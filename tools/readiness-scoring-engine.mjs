import fs from 'fs';

const findings = JSON.parse(
  fs.readFileSync(
    'build/enriched-findings.json',
    'utf8'
  )
);

let score = 100;

const penalties = {
  sev1: 20,
  sev2: 10,
  missing_owner: 12,
  missing_maintenance: 8,
  missing_escalation: 8,
  approval_required: 5,
  missing_validation: 8
};

const summary = {
  total_findings: findings.length,
  sev1: 0,
  sev2: 0,
  missing_owners: 0,
  missing_maintenance_windows: 0,
  missing_escalation_contacts: 0,
  approval_required: 0,
  missing_validation_teams: 0,
  readiness_score: 100,
  posture: 'Healthy'
};

for (const f of findings) {
  const ctx = f.operational_context || {};

  if (f.severity === 'Sev1') {
    summary.sev1++;
    score -= penalties.sev1;
  }

  if (f.severity === 'Sev2') {
    summary.sev2++;
    score -= penalties.sev2;
  }

  if (
    !ctx.infrastructure_owner ||
    ctx.infrastructure_owner === 'Unassigned'
  ) {
    summary.missing_owners++;
    score -= penalties.missing_owner;
  }

  if (
    !ctx.maintenance_window ||
    ctx.maintenance_window === 'Unknown'
  ) {
    summary.missing_maintenance_windows++;
    score -= penalties.missing_maintenance;
  }

  if (
    !ctx.escalation_contact ||
    ctx.escalation_contact === 'Unknown'
  ) {
    summary.missing_escalation_contacts++;
    score -= penalties.missing_escalation;
  }

  if (ctx.reboot_approval_required === true) {
    summary.approval_required++;
    score -= penalties.approval_required;
  }

  if (
    !ctx.validation_team ||
    ctx.validation_team === 'Unknown'
  ) {
    summary.missing_validation_teams++;
    score -= penalties.missing_validation;
  }
}

score = Math.max(0, score);

summary.readiness_score = score;

if (score >= 90) {
  summary.posture = 'Healthy';
} else if (score >= 70) {
  summary.posture = 'Needs Review';
} else if (score >= 50) {
  summary.posture = 'At Risk';
} else {
  summary.posture = 'Critical';
}

fs.mkdirSync(
  'build/readiness',
  { recursive: true }
);

fs.writeFileSync(
  'build/readiness/operational-readiness.json',
  JSON.stringify(summary, null, 2)
);

console.log('');
console.log('[SUCCESS] Operational readiness scoring complete.');
console.log('build/readiness/operational-readiness.json');
console.log('');
