import fs from 'fs';

const health = JSON.parse(
  fs.readFileSync('build/linux/system-health.json', 'utf8')
);

const findings = [];

const diskPct = parseInt((health.disk_root_usage || '0').replace('%',''), 10);

if (diskPct >= 95) {
  findings.push({
    host: health.hostname,
    severity: 'Sev1',
    issue: `Root disk usage critical: ${health.disk_root_usage}`,
    recommendation: 'Free disk space immediately and review growth sources',
    owner: 'Dewayne',
    status: 'Open'
  });
} else if (diskPct >= 85) {
  findings.push({
    host: health.hostname,
    severity: 'Sev2',
    issue: `Root disk usage elevated: ${health.disk_root_usage}`,
    recommendation: 'Review disk usage and plan cleanup',
    owner: 'Dewayne',
    status: 'Open'
  });
}

if (health.firewall !== 'Active') {
  findings.push({
    host: health.hostname,
    severity: 'Sev2',
    issue: 'Firewall inactive',
    recommendation: 'Validate firewall policy and enable firewalld if required',
    owner: 'Dewayne',
    status: 'Open'
  });
}

if (health.selinux !== 'Enforcing') {
  findings.push({
    host: health.hostname,
    severity: 'Sev2',
    issue: `SELinux not enforcing: ${health.selinux}`,
    recommendation: 'Review SELinux mode and restore enforcing where appropriate',
    owner: 'Dewayne',
    status: 'Open'
  });
}

fs.writeFileSync(
  'data/exposure/current-exposure.json',
  JSON.stringify(findings, null, 2)
);

console.log('');
console.log('[SUCCESS] Linux health exposure findings generated.');
console.log('data/exposure/current-exposure.json');
console.log('');
