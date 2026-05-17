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
    return Object.fromEntries(
      headers.map((h,i)=>[h.trim(), values[i]?.trim() || ""])
    );
  });
}

const rows = parseCsv(fs.readFileSync(input,"utf8"));

function isLegacy(os="") {
  return os.includes("2012") || os.includes("2008");
}

const duplicateMap = {};

for (const row of rows) {
  duplicateMap[row.ComputerName] =
    (duplicateMap[row.ComputerName] || 0) + 1;
}

function calculateScore(row){

  let score = 100;
  const findings = [];

  if (row.RebootPending === "True") {
    score -= 15;
    findings.push("Pending reboot");
  }

  if (row.WUA !== "Running") {
    score -= 20;
    findings.push("WUA stopped");
  }

  if (row.BITS !== "Running") {
    score -= 10;
    findings.push("BITS stopped");
  }

  if (!row.Owner) {
    score -= 15;
    findings.push("Missing owner");
  }

  if (!row.LOB) {
    score -= 10;
    findings.push("Missing LOB");
  }

  if (isLegacy(row.OS)) {
    score -= 25;
    findings.push("Legacy OS");
  }

  if (parseInt(row.Uptime || "0") > 90) {
    score -= 10;
    findings.push("High uptime");
  }

  if (duplicateMap[row.ComputerName] > 1) {
    score -= 20;
    findings.push("Duplicate hostname");
  }

  if (score < 0) {
    score = 0;
  }

  return {
    score,
    findings
  };
}

function badge(score){

  if (score >= 90) {
    return {
      text:"Healthy",
      class:"healthy"
    };
  }

  if (score >= 70) {
    return {
      text:"Review",
      class:"review"
    };
  }

  if (score >= 50) {
    return {
      text:"Risk",
      class:"risk"
    };
  }

  return {
    text:"Critical",
    class:"critical"
  };
}

const enriched = rows.map(row => {

  const result = calculateScore(row);

  return {
    ...row,
    readinessScore: result.score,
    findings: result.findings,
    badge: badge(result.score)
  };
});

const overall =
  Math.round(
    enriched.reduce((a,b)=>a+b.readinessScore,0)
    / enriched.length
  );

const readinessRows = enriched.map(r => `
<tr>
<td>${r.ComputerName}</td>
<td>${r.LOB || '<span class="missing">Missing</span>'}</td>
<td>${r.OS}</td>
<td>${r.WUA}</td>
<td>${r.BITS}</td>
<td>${r.RebootPending}</td>

<td>
<div class="scorewrap">
<div class="scorebar">
<div class="fill ${r.badge.class}"
style="width:${r.readinessScore}%"></div>
</div>

<div class="scorelabel">
${r.readinessScore}%
</div>
</div>
</td>

<td>
<span class="badge ${r.badge.class}">
${r.badge.text}
</span>
</td>

<td>
${r.findings.join(", ")}
</td>

</tr>
`).join("");

const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">

<title>
BayouOps Readiness Scoring Dashboard
</title>

<style>

body{
  background:#06101d;
  color:#e8edf6;
  font-family:Arial,sans-serif;
  padding:36px;
}

.wrap{
  max-width:1500px;
  margin:auto;
}

.hero{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  margin-bottom:24px;
}

.sub{
  color:#91a3bb;
}

.cards{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:16px;
  margin-bottom:30px;
}

.card{
  background:#132238;
  border-radius:18px;
  padding:20px;
  border:1px solid #223852;
}

.num{
  font-size:40px;
  font-weight:bold;
}

.label{
  margin-top:6px;
  color:#93a4bc;
}

table{
  width:100%;
  border-collapse:collapse;
  overflow:hidden;
  border-radius:18px;
  background:#081321;
}

th{
  background:#1b2a40;
  text-align:left;
  padding:16px;
}

td{
  padding:16px;
  border-bottom:1px solid #162538;
}

.scorewrap{
  display:flex;
  align-items:center;
  gap:12px;
}

.scorebar{
  width:160px;
  height:12px;
  background:#1c2d45;
  border-radius:999px;
  overflow:hidden;
}

.fill{
  height:100%;
  border-radius:999px;
}

.fill.healthy{
  background:#10b981;
}

.fill.review{
  background:#3b82f6;
}

.fill.risk{
  background:#f59e0b;
}

.fill.critical{
  background:#ef4444;
}

.badge{
  padding:6px 12px;
  border-radius:999px;
  font-weight:bold;
  font-size:12px;
}

.badge.healthy{
  background:#0d3d31;
  color:#8ff0c6;
}

.badge.review{
  background:#11365c;
  color:#8ec5ff;
}

.badge.risk{
  background:#5a3b08;
  color:#ffd26a;
}

.badge.critical{
  background:#5a1515;
  color:#ff9f9f;
}

.missing{
  color:#ffd166;
  font-weight:bold;
}

.printbtn{
  background:#38bdf8;
  color:#07111f;
  border:0;
  border-radius:999px;
  padding:12px 18px;
  font-weight:bold;
  cursor:pointer;
}

.footer{
  margin-top:28px;
  color:#8ea1b8;
  font-size:12px;
}

</style>
</head>

<body>

<div class="wrap">

<div class="hero">

<div>
<h1>BayouOps Operational Readiness Scoring</h1>

<div class="sub">
Operational posture intelligence • Visibility, not control
</div>
</div>

<button class="printbtn"
onclick="window.print()">

Print / Save PDF

</button>

</div>

<div class="cards">

<div class="card">
<div class="num">${enriched.length}</div>
<div class="label">Systems</div>
</div>

<div class="card">
<div class="num">${overall}%</div>
<div class="label">Environment Readiness</div>
</div>

<div class="card">
<div class="num">
${enriched.filter(x=>x.badge.text==="Critical").length}
</div>
<div class="label">Critical Systems</div>
</div>

<div class="card">
<div class="num">
${enriched.filter(x=>x.badge.text==="Healthy").length}
</div>
<div class="label">Healthy Systems</div>
</div>

</div>

<h2>Operational Readiness Detail</h2>

<table>

<thead>
<tr>
<th>Computer</th>
<th>LOB</th>
<th>OS</th>
<th>WUA</th>
<th>BITS</th>
<th>Reboot</th>
<th>Readiness Score</th>
<th>Status</th>
<th>Findings</th>
</tr>
</thead>

<tbody>
${readinessRows}
</tbody>

</table>

<div class="footer">
© 2026 BayouOps • BayouFinds.com • Operational readiness intelligence
</div>

</div>

</body>
</html>
`;

const stamp = new Date().toISOString().replace(/[:.]/g,"-");

const outfile = path.join(
  outDir,
  `bayouops_readiness_scoring_${stamp}.html`
);

fs.writeFileSync(outfile, html);

console.log(`Created: ${outfile}`);
