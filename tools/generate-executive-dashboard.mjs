import fs from 'fs';

const findings = JSON.parse(
  fs.readFileSync(
    'build/enriched-findings.json',
    'utf8'
  )
);

const readinessData = JSON.parse(
  fs.readFileSync(
    'build/readiness/operational-readiness.json',
    'utf8'
  )
);

const readiness =
  readinessData.readiness_score ?? 100;

const posture =
  readinessData.posture ?? 'Healthy';

const critical =
  findings.filter(f => f.severity === 'Sev1').length;

const high =
  findings.filter(f => f.severity === 'Sev2').length;

const unsupported =
  findings.filter(f =>
    (f.issue || '').toLowerCase().includes('unsupported')
  ).length;

let rows = '';

if (findings.length === 0) {

  rows = `
  <tr>
    <td colspan="4" style="
      padding:32px;
      text-align:center;
      color:#9fb3c8;
      font-size:15px;
    ">
      Operational posture healthy.<br>
      No active operational findings detected.
    </td>
  </tr>
  `;

} else {

  rows = findings.map(f => `
    <tr>
      <td>${f.host}</td>
      <td>${f.issue}</td>
      <td>${f.severity}</td>
      <td>40</td>
    </tr>
  `).join('');
}

const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>BayouOps Executive Operational View</title>

<style>

body{
background:#07111f;
color:#d7e1ea;
font-family:Arial,sans-serif;
padding:40px;
}

.card{
background:#10203a;
border-radius:18px;
padding:24px;
margin-bottom:24px;
border:1px solid #1f3556;
}

.metrics{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:20px;
margin-bottom:24px;
}

.metric{
background:#10203a;
padding:24px;
border-radius:18px;
border:1px solid #1f3556;
}

.metric h2{
font-size:56px;
margin:0;
}

table{
width:100%;
border-collapse:collapse;
}

th{
background:#1a2d4a;
padding:14px;
text-align:left;
}

td{
padding:14px;
border-top:1px solid #20385b;
}

</style>

</head>

<body>

<div class="card">
<h1>BayouOps Executive Operational View</h1>

<p>
Operational readiness intelligence focused on organizational exposure,
risk posture, unsupported systems, and remediation visibility.
</p>
</div>

<div class="metrics">

<div class="metric">
<h2>${readiness}%</h2>
<div>Operational Readiness</div>
<div style="color:#9fb3c8;margin-top:6px;">${posture}</div>
</div>

<div class="metric">
<h2>${critical}</h2>
<div>Critical Operational Risk</div>
</div>

<div class="metric">
<h2>${high}</h2>
<div>High Operational Risk</div>
</div>

<div class="metric">
<h2>${unsupported}</h2>
<div>Unsupported Platforms</div>
</div>

</div>

<div class="card">

<h2>Top Operational Risks</h2>

<table>

<thead>
<tr>
<th>Host</th>
<th>Issue</th>
<th>Priority</th>
<th>Score</th>
</tr>
</thead>

<tbody>
${rows}
</tbody>

</table>

</div>

</body>
</html>
`;

const out =
`reports/bayouops_executive_view_${new Date().toISOString().replace(/[:.]/g,'-')}.html`;

fs.writeFileSync(out, html);

console.log('');
console.log('[SUCCESS] Executive dashboard created:');
console.log(out);
console.log('');
