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

function isLegacy(os="") {
  return os.includes("2012") || os.includes("2008");
}

const alerts = [];
const nameMap = {};

function addAlert(sev,msg){
  alerts.push({severity:sev,message:msg});
}

for (const row of rows) {
  const name = row.ComputerName;

  if (!nameMap[name]) {
    nameMap[name] = 0;
  }

  nameMap[name]++;
}

for (const [name,count] of Object.entries(nameMap)) {
  if (count > 1) {
    addAlert("HIGH",`Duplicate ComputerName detected: ${name}`);
  }
}

for (const row of rows) {

  if (!row.ComputerName) {
    addAlert("HIGH","Missing ComputerName");
  }

  if (!row.OwnerName) {
    addAlert("WARN",`${row.ComputerName}: Missing owner`);
  }

  if (!row.LOB) {
    addAlert("WARN",`${row.ComputerName}: Missing LOB`);
  }

  if (row.WindowsUpdateSvc !== "Running") {
    addAlert("WARN",`${row.ComputerName}: Windows Update service not running`);
  }

  if (row.BITSService !== "Running") {
    addAlert("WARN",`${row.ComputerName}: BITS service not running`);
  }

  if (row.RebootPending === "True") {
    addAlert("WARN",`${row.ComputerName}: Pending reboot before maintenance`);
  }

  if (isLegacy(row.OSName)) {
    addAlert("INFO",`${row.ComputerName}: Legacy operating system`);
  }

  if (parseInt(row.UptimeDays || "0") > 90) {
    addAlert("INFO",`${row.ComputerName}: High uptime (${row.UptimeDays} days)`);
  }

  if (row.ClusterPair) {

    const peer = rows.find(r => r.ComputerName === row.ClusterPair);

    if (
      peer &&
      peer.PatchWave &&
      row.PatchWave &&
      peer.PatchWave === row.PatchWave
    ) {
      addAlert(
        "HIGH",
        `Cluster pair conflict: ${row.ComputerName}/${peer.ComputerName} both assigned to ${row.PatchWave}`
      );
    }
  }
}

const counts = {
  systems: rows.length,
  high: alerts.filter(a=>a.severity==="HIGH").length,
  warn: alerts.filter(a=>a.severity==="WARN").length,
  info: alerts.filter(a=>a.severity==="INFO").length
};

const alertHtml = alerts.map(a => `
<div class="alert ${a.severity.toLowerCase()}">
<div class="sev">${a.severity}</div>
<div>${a.message}</div>
</div>
`).join("");

const tableRows = rows.map(r => `
<tr>
<td>${r.ComputerName}</td>
<td>${r.LOB || '<span class="warn">Missing</span>'}</td>
<td>${r.OSName}</td>
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
<title>BayouOps Severity Dashboard</title>

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
  margin-bottom:24px;
}

.sub{
  color:#8fa3bf;
}

.cards{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:14px;
  margin-bottom:25px;
}

.card{
  background:#122036;
  border-radius:16px;
  padding:18px;
  border:1px solid #22354a;
}

.num{
  font-size:32px;
  font-weight:bold;
}

.label{
  color:#8fa3bf;
  margin-top:5px;
}

.alert{
  display:flex;
  gap:14px;
  align-items:center;
  padding:14px;
  border-radius:12px;
  margin-bottom:12px;
}

.high{
  background:#4a190f;
  border:1px solid #7c2d12;
  color:#ffd7c7;
}

.warnalert{
  background:#4a320f;
  border:1px solid #946300;
  color:#ffe8b3;
}

.info{
  background:#10263f;
  border:1px solid #1f4d78;
  color:#cfe7ff;
}

.sev{
  font-weight:bold;
  min-width:60px;
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

.printbtn{
  background:#38bdf8;
  color:#07111f;
  border:0;
  border-radius:999px;
  padding:10px 15px;
  font-weight:bold;
  cursor:pointer;
}

.footer{
  margin-top:24px;
  color:#8fa3bf;
  font-size:12px;
}
</style>
</head>

<body>

<div class="wrap">

<div class="hero">
<div>
<h1>BayouOps Severity Dashboard</h1>
<div class="sub">
Operational readiness intelligence • Visibility, not control
</div>
</div>

<button class="printbtn" onclick="window.print()">
Print / Save PDF
</button>
</div>

<div class="cards">
<div class="card"><div class="num">${counts.systems}</div><div class="label">Systems</div></div>
<div class="card"><div class="num">${counts.high}</div><div class="label">HIGH Alerts</div></div>
<div class="card"><div class="num">${counts.warn}</div><div class="label">WARN Alerts</div></div>
<div class="card"><div class="num">${counts.info}</div><div class="label">INFO Alerts</div></div>
</div>

<h2>Operational Alerts</h2>

${alertHtml}

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
© 2026 BayouOps • BayouFinds.com • Operational readiness visibility
</div>

</div>

</body>
</html>
`;

const stamp = new Date().toISOString().replace(/[:.]/g,"-");
const outfile = path.join(outDir, `bayouops_severity_dashboard_${stamp}.html`);

fs.writeFileSync(outfile, html);

console.log(`Created: ${outfile}`);
