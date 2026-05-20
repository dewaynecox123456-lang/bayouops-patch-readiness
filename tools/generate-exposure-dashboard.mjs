import fs from 'fs';

const sourceFile = fs.existsSync('build/operational-priority.json')
  ? 'build/operational-priority.json'
  : 'data/exposure/current-exposure.json';

const exposure = JSON.parse(
  fs.readFileSync(sourceFile, 'utf8')
);

const sevRank = { Sev1: 1, Sev2: 2, Sev3: 3 };
exposure.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);

const counts = {
  Sev1: exposure.filter(x => x.severity === 'Sev1').length,
  Sev2: exposure.filter(x => x.severity === 'Sev2').length,
  Sev3: exposure.filter(x => x.severity === 'Sev3').length
};

const rows = exposure.map(x => {
  const rec = x.recommendation || {};

  return `
<tr>
  <td>${x.host}</td>
  <td><span class="badge ${x.severity.toLowerCase()}">${x.severity}</span></td>
  <td>${x.issue}</td>
  <td>${rec.urgency || 'Review'}</td>
  <td>${rec.effort || 'Unknown'}</td>
  <td>${rec.escalation || 'Unassigned'}</td>
  <td>${rec.action || x.recommendation || 'Review finding'}</td>
  <td>${x.owner}</td>
  <td>${x.status}</td>
</tr>
`;
}).join('');

const stamp = new Date().toISOString().replace(/[:.]/g, '-');

const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>BayouOps Exposure Dashboard</title>
<style>
body{background:#07111f;color:#e6edf6;font-family:Arial,sans-serif;padding:40px;}
.wrap{max-width:1500px;margin:auto;}
.card{background:#122036;border:1px solid #243852;border-radius:18px;padding:24px;margin-bottom:24px;}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.metric{font-size:42px;font-weight:bold;}
.sub{color:#93a5bf;}
table{width:100%;border-collapse:collapse;background:#0e1b2d;border-radius:16px;overflow:hidden;font-size:14px;}
th{background:#1b2a40;padding:13px;text-align:left;}
td{padding:13px;border-bottom:1px solid #1d3048;vertical-align:top;}
.badge{padding:6px 12px;border-radius:999px;font-weight:bold;font-size:12px;}
.sev1{background:#5a1515;color:#ff9f9f;}
.sev2{background:#5a3b08;color:#ffd26a;}
.sev3{background:#0d3d31;color:#8ff0c6;}
.footer{margin-top:30px;color:#8ea2bc;font-size:12px;text-align:center;}
</style>
</head>
<body>
<div class="wrap">

<div class="card">
<h1>BayouOps Exposure Dashboard</h1>
<div class="sub">Read-only operational exposure visibility • Visibility, not control</div>
</div>

<div class="grid">
<div class="card"><div class="metric">${counts.Sev1}</div><div class="sub">Sev1 Critical Exposure</div></div>
<div class="card"><div class="metric">${counts.Sev2}</div><div class="sub">Sev2 Elevated Risk</div></div>
<div class="card"><div class="metric">${counts.Sev3}</div><div class="sub">Sev3 Healthy / Informational</div></div>
</div>

<div class="card">
<h2>Exposure Queue</h2>
<div class="sub">Worst findings first • Includes urgency, effort, escalation, and action guidance</div>
<br>
<table>
<thead>
<tr>
<th>Host</th>
<th>Severity</th>
<th>Issue</th>
<th>Operational Priority</th>
<th>Priority Score</th>
<th>Urgency</th>
<th>Effort</th>
<th>Escalation</th>
<th>Operational Action</th>
<th>Site</th>
<th>Rack</th>
<th>Local Contact</th>
<th>After Hours</th>
<th>Maintenance Window</th>
<th>Owner</th>
<th>Status</th>
</tr>
</thead>
<tbody>
${rows}
</tbody>
</table>
</div>

<div class="footer">© 2026 BayouOps • BayouFinds.com • Read-only operational visibility</div>

</div>
</body>
</html>
`;

const outfile = `reports/bayouops_exposure_dashboard_${stamp}.html`;
fs.writeFileSync(outfile, html);

console.log('');
console.log('[SUCCESS] Exposure dashboard created:');
console.log(outfile);
console.log('');
