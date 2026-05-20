#!/usr/bin/env node
import fs from "fs";
import path from "path";

const beforeFile = process.argv[2];
const afterFile = process.argv[3];
const outDir = process.argv[4] || "reports";

fs.mkdirSync(outDir,{recursive:true});

function parseCsv(text){
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",");

  return lines.map(line=>{
    const values = line.split(",");
    return Object.fromEntries(
      headers.map((h,i)=>[h.trim(), values[i]?.trim() || ""])
    );
  });
}

function isLegacy(os=""){
  return os.includes("2012");
}

function score(row){

  let s = 100;

  if(row.RebootPending==="True") s -= 15;
  if(row.WUA!=="Running") s -= 20;
  if(row.BITS!=="Running") s -= 10;
  if(!row.Owner) s -= 15;
  if(!row.LOB) s -= 10;
  if(isLegacy(row.OS)) s -= 25;
  if(parseInt(row.Uptime||"0") > 90) s -= 10;

  return Math.max(s,0);
}

const beforeRows =
  parseCsv(fs.readFileSync(beforeFile,"utf8"));

const afterRows =
  parseCsv(fs.readFileSync(afterFile,"utf8"));

function summarize(rows){

  return {
    readiness:
      Math.round(
        rows.reduce((a,b)=>a+score(b),0)/rows.length
      ),

    critical:
      rows.filter(r=>score(r)<50).length,

    missingOwners:
      rows.filter(r=>!r.Owner).length,

    pendingReboots:
      rows.filter(r=>r.RebootPending==="True").length
  };
}

const before = summarize(beforeRows);
const after = summarize(afterRows);

function delta(beforeVal,afterVal,invert=false){

  const diff = afterVal-beforeVal;

  const positive =
    invert ? diff < 0 : diff > 0;

  return {
    diff,
    class: positive ? "good":"bad",
    symbol: positive ? "▲":"▼"
  };
}

const readinessDelta =
  delta(before.readiness,after.readiness);

const criticalDelta =
  delta(before.critical,after.critical,true);

const ownerDelta =
  delta(before.missingOwners,after.missingOwners,true);

const rebootDelta =
  delta(before.pendingReboots,after.pendingReboots,true);

const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">

<title>
BayouOps Executive Delta Dashboard
</title>

<style>

body{
  background:#06101d;
  color:#e8edf6;
  font-family:Arial,sans-serif;
  padding:40px;
}

.wrap{
  max-width:1400px;
  margin:auto;
}

.hero{
  margin-bottom:30px;
}

.sub{
  color:#90a4bf;
}

.grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:20px;
}

.card{
  background:#122036;
  border-radius:18px;
  padding:24px;
  border:1px solid #223852;
}

.metric{
  font-size:40px;
  font-weight:bold;
}

.label{
  margin-top:8px;
  color:#93a5bf;
}

.compare{
  margin-top:20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.delta{
  font-size:28px;
  font-weight:bold;
}

.good{
  color:#10b981;
}

.bad{
  color:#ef4444;
}

.footer{
  margin-top:30px;
  color:#90a4bf;
  font-size:12px;
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

.topbar{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  margin-bottom:24px;
}

</style>
</head>

<body>

<div class="wrap">

<div class="topbar">

<div class="hero">
<h1>BayouOps Executive Delta Dashboard</h1>

<div class="sub">
Operational improvement intelligence • Visibility, not control
</div>
</div>

<button class="printbtn"
onclick="window.print()">

Print / Save PDF

</button>

</div>

<div class="grid">

<div class="card">

<div class="metric">
${after.readiness}%
</div>

<div class="label">
Environment Readiness
</div>

<div class="compare">
<div>
Before: ${before.readiness}%<br>
After: ${after.readiness}%
</div>

<div class="delta ${readinessDelta.class}">
${readinessDelta.symbol}
${Math.abs(readinessDelta.diff)}
</div>
</div>

</div>

<div class="card">

<div class="metric">
${after.critical}
</div>

<div class="label">
Critical Systems
</div>

<div class="compare">
<div>
Before: ${before.critical}<br>
After: ${after.critical}
</div>

<div class="delta ${criticalDelta.class}">
${criticalDelta.symbol}
${Math.abs(criticalDelta.diff)}
</div>
</div>

</div>

<div class="card">

<div class="metric">
${after.missingOwners}
</div>

<div class="label">
Missing Owners
</div>

<div class="compare">
<div>
Before: ${before.missingOwners}<br>
After: ${after.missingOwners}
</div>

<div class="delta ${ownerDelta.class}">
${ownerDelta.symbol}
${Math.abs(ownerDelta.diff)}
</div>
</div>

</div>

<div class="card">

<div class="metric">
${after.pendingReboots}
</div>

<div class="label">
Pending Reboots
</div>

<div class="compare">
<div>
Before: ${before.pendingReboots}<br>
After: ${after.pendingReboots}
</div>

<div class="delta ${rebootDelta.class}">
${rebootDelta.symbol}
${Math.abs(rebootDelta.diff)}
</div>
</div>

</div>

</div>

<div class="footer">
© 2026 BayouOps • BayouFinds.com • Operational improvement visibility
</div>

</div>

</body>
</html>
`;

const stamp =
  new Date().toISOString().replace(/[:.]/g,"-");

const outfile =
  path.join(
    outDir,
    `bayouops_executive_delta_${stamp}.html`
  );

fs.writeFileSync(outfile,html);

console.log(`Created: ${outfile}`);
