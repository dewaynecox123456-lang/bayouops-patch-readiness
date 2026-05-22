import fs from 'fs';

const health =
  JSON.parse(
    fs.readFileSync(
      'build/linux/system-health.json',
      'utf8'
    )
  );

const platform =
  JSON.parse(
    fs.readFileSync(
      'build/platform/platform.json',
      'utf8'
    )
  );

const reboot =
  JSON.parse(
    fs.readFileSync(
      'build/platform/reboot-state.json',
      'utf8'
    )
  );

const findings = [];

function addFinding(
  severity,
  issue,
  recommendation,
  impact
) {

  findings.push({
    host: health.hostname,

    platform:
      platform.platform_family,

    severity,

    issue,

    recommendation: {
      urgency:
        severity === 'Sev1'
          ? 'Immediate'
          : severity === 'Sev2'
          ? 'Planned'
          : 'Monitor',

      effort:
        severity === 'Sev1'
          ? 'Medium'
          : 'Low',

      escalation:
        severity === 'Sev1'
          ? 'Operations Manager'
          : 'Linux Operations',

      action: recommendation
    },

    operational_impact: impact,

    owner: 'Dewayne',

    status: 'Open'
  });
}

const failed =
  parseInt(
    health.failed_services || '0',
    10
  );

if (failed >= 1) {

  addFinding(
    'Sev2',
    `Failed services detected (${failed})`,
    'Review failed systemd services',
    'Potential degraded system functionality'
  );
}

if (
  health.firewall !== 'Active'
) {

  addFinding(
    'Sev2',
    'Firewall inactive',
    'Validate and enable firewalld',
    'Reduced network protection posture'
  );
}

if (
  health.selinux !== 'Enforcing'
) {

  addFinding(
    'Sev2',
    `SELinux not enforcing (${health.selinux})`,
    'Review SELinux policy configuration',
    'Reduced operating system hardening'
  );
}

const rootUsage =
  parseInt(
    (health.root_usage || '0')
      .replace('%',''),
    10
  );

if (rootUsage >= 85) {

  addFinding(
    'Sev2',
    `High /var utilization (${health.root_usage})`,
    'Review Flatpak, container, and journal growth',
    'Operational storage pressure increasing'
  );
}

if (
  reboot.reboot_pending === 'Yes'
) {

  addFinding(
    'Sev2',
    'System reboot pending',
    `Review reboot requirement (${reboot.detection_method})`,
    'Patch and runtime state divergence'
  );
}

if (
  health.uptime &&
  health.uptime.includes('weeks')
) {

  addFinding(
    'Sev3',
    `Extended uptime detected (${health.uptime})`,
    'Review maintenance and reboot cadence',
    'Potential stale runtime state'
  );
}

fs.writeFileSync(
  'data/exposure/current-exposure.json',
  JSON.stringify(
    findings,
    null,
    2
  )
);

console.log('');
console.log(
  '[SUCCESS] Linux findings generated.'
);

console.log('');
console.log(
  'data/exposure/current-exposure.json'
);

console.log('');
