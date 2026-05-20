import fs from 'fs';

const data =
  JSON.parse(
    fs.readFileSync(
      'build/operational-priority.json',
      'utf8'
    )
  );

const rows = data.map(x => {

  const rec =
    x.recommendation || {};

  return `
<tr>
  <td>${x.host}</td>
  <td><span class="badge ${x.severity.toLowerCase()}">${x.severity}</span></td>
  <td>${x.operational_priority?.level || 'Unknown'}</td>
  <td>${x.operational_priority?.score || 0}</td>
  <td>${rec.action || 'Review'}</td>
  <td>${rec.escalation || 'Unknown'}</td>
  <td>${x.owner}</td>
  <td>${x.status}</td>
</tr>
`;
}).join('');

const stamp =
  new Date()
    .toISOString()
    .replace(/[:.]/g, '-');

const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>BayouOps NOC Triage View</title>

<style>

body{
  background:#08111f;
  color:#e8eef7;
  font-family:Arial,sans-serif;
  padding:40px;
}

.wrap{
  max-width:1400px;
  margin:auto;
}

.card{
  background:#122036;
  border:1px solid #22354f;
  border-radius:18px;
  padding:24px;
  margin-bottom:24px;
}

table{
  width:100%;
  border-collapse:collapse;
  font-size:14px;
}

th{
  background:#1b2b42;
  padding:14px;
  text-align:left;
}

td{
  padding:14px;
  border-bottom:1px solid #1e3148;
}

.badge{
  padding:6px 12px;
  border-radius:999px;
  font-size:12px;
  font-weight:bold;
}

.sev1{
  background:#5d1515;
  color:#ffaaaa;
}

.sev2{
  background:#5b3d08;
  color:#ffd76a;
}

.sev3{
  background:#0f4334;
  color:#9bf3cf;
}

.sub{
  color:#90a5bf;
}



.score{
  padding:6px 12px;
  border-radius:10px;
  font-weight:bold;
  display:inline-block;
}

.score-critical{
  background:#5a1212;
  color:#ffb0b0;
}

.score-high{
  background:#5c3908;
  color:#ffd56a;
}

.score-medium{
  background:#574b0a;
  color:#fff0a0;
}

.score-low{
  background:#0d4335;
  color:#a2f2d1;
}

.footer{
  margin-top:30px;
  text-align:center;
  color:#8ca0b7;
  font-size:12px;
}

</style>
</head>

<body>

<div class="wrap">

<div class="card">
<h1>BayouOps NOC Triage View</h1>

<div class="sub">
Rapid operational triage • Action-focused incident visibility
</div>
</div>

<div class="card">

<table>

<thead>
<tr>
<th>Host</th>
<th>Severity</th>
<th>Operational Priority</th>
<th>Priority Score</th>
<th>Why Critical</th>
<th>Operational Action</th>
<th>Escalation</th>
<th>Owner</th>
<th>Status</th>
</tr>
</thead>

<tbody>
${rows}
</tbody>

</table>

</div>

<div class="footer">
© 2026 BayouOps • BayouFinds.com
</div>

</div>

</body>
</html>
`;

const outfile =
  `reports/bayouops_noc_triage_${stamp}.html`;

fs.writeFileSync(
  outfile,
  html
);

console.log('');
console.log(
  '[SUCCESS] NOC dashboard created:'
);

console.log(outfile);

console.log('');
