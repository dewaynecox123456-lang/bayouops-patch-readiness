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

function isLegacyOS(os = "") {
  return os.includes("2012") || os.includes("2008");
}

function uptimeRisk(days) {
  const d = Number(days || 0);
  if (d >= 180) return "high";
  if (d >= 90) return "warn";
  return "ok";
}

const totals = {
  total: rows.length,
  legacy: rows.filter(r => isLegacyOS(r.OSName)).length,
  reboot: rows.filter(r => r.RebootPending === "True").length,
  missingLOB: rows.filter(r => !r.LOB).length,
  missingOwner: rows.filter(r => !r.OwnerName).length,
  highUptime: rows.filter(r => Number(r.UptimeDays || 0) >= 90).length,
};

const tableRows = rows.map(r => {
  const legacy = isLegacyOS(r.OSName);
  const uptimeClass = uptimeRisk(r.UptimeDays);

  return `
  <tr>
    <td>${r.ComputerName}</td>
    <td>${r.LOB || '<span class="warntext">Missing</span>'}</td>
    <td>
      ${r.OSName}
      ${legacy ? '<span class="pill bad">Legacy</span>' : ''}
    </td>
    <td>${r.WindowsUpdateSvc}</td>
    <td>${r.BITSService}</td>
    <td>${r.RebootPending}</td>
    <td>
      <span class="pill ${uptimeClass}">
        ${r.UptimeDays} Days
      </span>
    </td>
    <td>${r.OwnerName || '<span class="warntext">Missing</span>'}</td>
    <td>${r.PatchWave || '<span class="warntext">Missing</span>'}</td>
  </tr>
  `;
}).join("");

const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>BayouOps Operational Readiness</title>
<style>
body{
  background:#07111f;
  color:#e6edf7;
  font-family:Arial,sans-serif;
  padding:30px;
}
.wrap{
  max-width:1400px;
  margin:auto;
}
h1{
  margin-bottom:5px;
}
.sub{
  color:#8fa3bf;
  margin-bottom:25px;
}
.cards{
  display:grid;
  grid-template-columns:repeat(6,1fr);
  gap:14px;
  margin-bottom:25px;
}
.card{
  background:#122036;
  border:1px solid #26364d;
  border-radius:18px;
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
table{
  width:100%;
  border-collapse:collapse;
  background:#081321;
  border-radius:18px;
  overflow:hidden;
}
th{
  background:#1a2a40;
  padding:14px;
  text-align:left;
}
td{
  padding:14px;
  border-bottom:1px solid #16263b;
}
.pill{
  padding:5px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:bold;
}
.ok{
  background:#083b2b;
  color:#9cf5c5;
}
.warn{
  background:#4f3d00;
  color:#ffe58f;
}
.high{
  background:#4b1220;
  color:#ffb4c0;
}
.bad{
  background:#4b1220;
  color:#ffb4c0;
}
.warntext{
  color:#ffd166;
  font-weight:bold;
}
.footer{
  margin-top:20px;
  color:#7f92ad;
  font-size:12px;
}
</style>
</head>
<body>
<div class="wrap">

<h1>BayouOps Operational Readiness</h1>
<div class="sub">
Visibility, not control • Read-only operational visibility
</div>

<div class="cards">
  <div class="card">
    <div class="num">${totals.total}</div>
    <div class="label">Systems</div>
  </div>

  <div class="card">
    <div class="num">${totals.legacy}</div>
    <div class="label">Legacy OS</div>
  </div>

  <div class="card">
    <div class="num">${totals.reboot}</div>
    <div class="label">Reboot Pending</div>
  </div>

  <div class="card">
    <div class="num">${totals.highUptime}</div>
    <div class="label">High Uptime</div>
  </div>

  <div class="card">
    <div class="num">${totals.missingLOB}</div>
    <div class="label">Missing LOB</div>
  </div>

  <div class="card">
    <div class="num">${totals.missingOwner}</div>
    <div class="label">Missing Owner</div>
  </div>
</div>

<table>
<thead>
<tr>
<th>Computer</th>
<th>LOB</th>
<th>OS</th>
<th>WUA</th>
<th>BITS</th>
<th>Reboot</th>
<th>Uptime</th>
<th>Owner</th>
<th>Patch Wave</th>
</tr>
</thead>
<tbody>
${tableRows}
</tbody>
</table>

<div class="footer">
© 2026 BayouOps • BayouFinds.com • Do no harm • Read-only operational visibility
</div>

</div>
</body>
</html>
`;

const stamp = new Date().toISOString().replace(/[:.]/g,"-");
const outfile = path.join(outDir, `bayouops_operational_readiness_${stamp}.html`);

fs.writeFileSync(outfile, html);

console.log(`Created: ${outfile}`);
