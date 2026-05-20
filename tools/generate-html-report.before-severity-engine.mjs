#!/usr/bin/env node
import fs from "fs";
import path from "path";

const input = process.argv[2] || "samples/mock-report.csv";
const outDir = process.argv[3] || "reports";

fs.mkdirSync(outDir, { recursive: true });

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",");
  return lines.map(line => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

const rows = parseCsv(fs.readFileSync(input, "utf8"));

const warnings = [];
const nameMap = {};

function isLegacy(os="") {
  return os.includes("2012") || os.includes("2008");
}

for (const row of rows) {
  const name = row.ComputerName;

  if (!nameMap[name]) {
    nameMap[name] = 0;
  }

  nameMap[name]++;
}

const duplicates = Object.entries(nameMap)
  .filter(([_, count]) => count > 1)
  .map(([name]) => name);

for (const dup of duplicates) {
  warnings.push(`Duplicate ComputerName detected: ${dup}`);
}

for (const row of rows) {

  if (!row.OwnerName) {
    warnings.push(`${row.ComputerName}: Missing owner`);
  }

  if (!row.LOB) {
    warnings.push(`${row.ComputerName}: Missing LOB`);
  }

  if (isLegacy(row.OSName)) {
    warnings.push(`${row.ComputerName}: Legacy operating system`);
  }

  if (row.RebootPending === "True") {
    warnings.push(`${row.ComputerName}: Pending reboot before maintenance`);
  }

  if (row.ClusterPair) {
    const peer = rows.find(r => r.ComputerName === row.ClusterPair);

    if (
      peer &&
      peer.PatchWave &&
      row.PatchWave &&
      peer.PatchWave === row.PatchWave
    ) {
      warnings.push(
        `Cluster pair conflict: ${row.ComputerName}/${peer.ComputerName} both assigned to ${row.PatchWave}`
      );
    }
  }
}

const cards = {
  systems: rows.length,
  duplicates: duplicates.length,
  missingOwners: rows.filter(r => !r.OwnerName).length,
  missingLOB: rows.filter(r => !r.LOB).length,
  legacyOS: rows.filter(r => isLegacy(r.OSName)).length,
  rebootPending: rows.filter(r => r.RebootPending === "True").length
};

const warningHtml = warnings.map(w => `
<div class="warnbox">${w}</div>
`).join("");

const tableRows = rows.map(r => `
<tr>
<td>${r.ComputerName}</td>
<td>${r.LOB || '<span class="warn">Missing</span>'}</td>
<td>
${r.OSName}
${isLegacy(r.OSName) ? '<span class="pill bad">Legacy</span>' : ''}
</td>
<td>${r.WindowsUpdateSvc}</td>
<td>${r.BITSService}</td>
<td>${r.RebootPending}</td>
<td>${r.OwnerName || '<span class="warn">Missing</span>'}</td>
<td>${r.PatchWave || '<span class="warn">Missing</span>'}</td>
</tr>
`).join("");

const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>BayouOps Validation Dashboard</title>
<style>
body{
  background:#07111f;
  color:#e7eef9;
  font-family:Arial,sans-serif;
  padding:30px;
}
.wrap{
  max-width:1400px;
  margin:auto;
}
.hero{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  margin-bottom:25px;
}
.sub{
  color:#8fa3bf;
}
.cards{
  display:grid;
  grid-template-columns:repeat(6,1fr);
  gap:14px;
  margin-bottom:25px;
}
.card{
  background:#122036;
  border:1px solid #24364d;
  border-radius:16px;
  padding:18px;
}
.num{
  font-size:32px;
  font-weight:bold;
}
.label{
  color:#8fa3bf;
  margin-top:5px;
}
.warnbox{
  background:#4a190f;
  border:1px solid #7c2d12;
  color:#ffd7c7;
  padding:14px;
  border-radius:12px;
  margin-bottom:12px;
}
table{
  width:100%;
  border-collapse:collapse;
  background:#081321;
  border-radius:18px;
  overflow:hidden;
}
th{
  background:#1b2a40;
  padding:14px;
  text-align:left;
}
td{
  padding:14px;
  border-bottom:1px solid #17273c;
}
.warn{
  color:#ffd166;
  font-weight:bold;
}
.pill{
  padding:4px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:bold;
}
.bad{
  background:#4b1220;
  color:#ffb4c0;
}
.footer{
  margin-top:24px;
  color:#8fa3bf;
  font-size:12px;
}
.printbtn{
  background:#38bdf8;
  color:#07111f;
  border:0;
  border-radius:999px;
  padding:10px 15px;
  font-weight:bold;
  cursor:pointer;
}
</style>
</head>
<body>

<div class="wrap">

<div class="hero">
<div>
<h1>BayouOps Validation Dashboard</h1>
<div class="sub">
Operational readiness validation • Visibility, not control
</div>
</div>

<button class="printbtn" onclick="window.print()">
Print / Save PDF
</button>
</div>

<div class="cards">
<div class="card"><div class="num">${cards.systems}</div><div class="label">Systems</div></div>
<div class="card"><div class="num">${cards.duplicates}</div><div class="label">Duplicates</div></div>
<div class="card"><div class="num">${cards.missingOwners}</div><div class="label">Missing Owners</div></div>
<div class="card"><div class="num">${cards.missingLOB}</div><div class="label">Missing LOB</div></div>
<div class="card"><div class="num">${cards.legacyOS}</div><div class="label">Legacy OS</div></div>
<div class="card"><div class="num">${cards.rebootPending}</div><div class="label">Reboot Pending</div></div>
</div>

<h2>Operational Warnings</h2>
${warningHtml}

<h2>Inventory Detail</h2>

<table>
<thead>
<tr>
<th>Computer</th>
<th>LOB</th>
<th>OS</th>
<th>WUA</th>
<th>BITS</th>
<th>Reboot</th>
<th>Owner</th>
<th>Patch Wave</th>
</tr>
</thead>
<tbody>
${tableRows}
</tbody>
</table>

<div class="footer">
© 2026 BayouOps • BayouFinds.com • Read-only operational visibility
</div>

</div>

</body>
</html>
`;

const stamp = new Date().toISOString().replace(/[:.]/g,"-");
const outfile = path.join(outDir, `bayouops_validation_dashboard_${stamp}.html`);

fs.writeFileSync(outfile, html);

console.log(`Created: ${outfile}`);
