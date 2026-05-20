import fs from 'fs';

const data =
  JSON.parse(
    fs.readFileSync(
      'build/operational-priority.json',
      'utf8'
    )
  );

const total = data.length;

const critical =
  data.filter(
    x => x.operational_priority?.level === 'Critical'
  ).length;

const high =
  data.filter(
    x => x.operational_priority?.level === 'High'
  ).length;

const unsupported =
  data.filter(
    x =>
      x.issue?.toLowerCase()
        .includes('unsupported')
  ).length;

const readiness =
  Math.max(
    0,
    100 - (critical * 12 + high * 5)
  );

const topRisks =
  data
    .slice(0, 5)
    .map(x => `
<tr>
  <td>${x.host}</td>
  <td>${x.issue}</td>
  <td>${x.operational_priority?.level}</td>
  <td>${x.operational_priority?.score}</td>
</tr>
`).join('');

const stamp =
  new Date()
    .toISOString()
    .replace(/[:.]/g, '-');

const html = `
<!doctype html>
<html>

<head>
<meta charset="utf-8">
<title>BayouOps Executive View</title>

<style>

body{
  background:#08111f;
  color:#edf3fb;
  font-family:Arial,sans-serif;
  padding:40px;
}

.wrap{
  max-width:1400px;
  margin:auto;
}

.grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:20px;
  margin-bottom:24px;
}

.card{
  background:#122036;
  border:1px solid #243852;
  border-radius:18px;
  padding:24px;
}

.metric{
  font-size:42px;
  font-weight:bold;
}

.label{
  color:#94a7c0;
  margin-top:10px;
}

h1,h2{
  margin-top:0;
}

table{
  width:100%;
  border-collapse:collapse;
  margin-top:20px;
}

th{
  background:#1b2b42;
  padding:14px;
  text-align:left;
}

td{
  padding:14px;
  border-bottom:1px solid #1f3048;
}

.footer{
  margin-top:30px;
  text-align:center;
  color:#8ea2bc;
  font-size:12px;
}

.summary{
  color:#c5d3e3;
  line-height:1.7;
}

</style>
</head>

<body>

<div class="wrap">

<div class="card">
<h1>BayouOps Executive Operational View</h1>

<div class="summary">
Operational readiness intelligence focused on organizational exposure,
risk posture, unsupported systems, and remediation visibility.
</div>
</div>

<div class="grid">

<div class="card">
<div class="metric">${readiness}%</div>
<div class="label">Operational Readiness</div>
</div>

<div class="card">
<div class="metric">${critical}</div>
<div class="label">Critical Operational Risk</div>
</div>

<div class="card">
<div class="metric">${high}</div>
<div class="label">High Operational Risk</div>
</div>

<div class="card">
<div class="metric">${unsupported}</div>
<div class="label">Unsupported Platforms</div>
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
${topRisks}
</tbody>

</table>

</div>

<div class="footer">
© 2026 BayouOps • BayouFinds.com • Executive Operational Intelligence
</div>

</div>

</body>
</html>
`;

const outfile =
  `reports/bayouops_executive_view_${stamp}.html`;

fs.writeFileSync(
  outfile,
  html
);

console.log('');
console.log(
  '[SUCCESS] Executive dashboard created:'
);

console.log(outfile);

console.log('');
