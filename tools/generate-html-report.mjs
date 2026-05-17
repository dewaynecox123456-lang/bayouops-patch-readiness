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

function statusClass(row) {
  if (row.ScanStatus?.toLowerCase() === "failed") return "bad";
  if (row.WindowsUpdateSvc !== "Running") return "warn";
  if (row.BITSService !== "Running") return "warn";
  if (row.RebootPending === "True") return "warn";
  return "ok";
}

const csv = fs.readFileSync(input, "utf8");
const rows = parseCsv(csv);

const totals = {
  total: rows.length,
  rebootPending: rows.filter(r => r.RebootPending === "True").length,
  wuaIssues: rows.filter(r => r.WindowsUpdateSvc !== "Running").length,
  bitsIssues: rows.filter(r => r.BITSService !== "Running").length,
  failed: rows.filter(r => r.ScanStatus?.toLowerCase() === "failed").length,
};

const generated = new Date().toLocaleString();

const tableRows = rows.map(r => {
  const cls = statusClass(r);
  return `
    <tr class="${cls}">
      <td>${r.ComputerName}</td>
      <td>${r.LOB}</td>
      <td>${r.OSName}</td>
      <td>${r.WindowsUpdateSvc}</td>
      <td>${r.BITSService}</td>
      <td>${r.RebootPending}</td>
      <td>${r.ScanStatus}</td>
    </tr>`;
}).join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>BayouOps Patch Readiness Report</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background: #0f172a;
    color: #e5e7eb;
    margin: 0;
    padding: 32px;
  }
  .wrap {
    max-width: 1200px;
    margin: auto;
  }
  h1 {
    margin-bottom: 4px;
  }
  .sub {
    color: #94a3b8;
    margin-bottom: 24px;
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  .card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 16px;
  }
  .num {
    font-size: 28px;
    font-weight: bold;
  }
  .label {
    color: #94a3b8;
    font-size: 13px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    background: #020617;
    border-radius: 12px;
    overflow: hidden;
  }
  th, td {
    padding: 12px;
    border-bottom: 1px solid #1e293b;
    text-align: left;
    font-size: 14px;
  }
  th {
    background: #1e293b;
    color: #cbd5e1;
  }
  tr.ok td {
    color: #d1fae5;
  }
  tr.warn td {
    color: #fde68a;
  }
  tr.bad td {
    color: #fecaca;
  }
  .footer {
    margin-top: 24px;
    color: #64748b;
    font-size: 12px;
  }
</style>
</head>
<body>
<div class="wrap">
  <h1>BayouOps Patch Readiness Report</h1>
  <div class="sub">Visibility, not control. Generated: ${generated}</div>

  <div class="cards">
    <div class="card"><div class="num">${totals.total}</div><div class="label">Total Systems</div></div>
    <div class="card"><div class="num">${totals.rebootPending}</div><div class="label">Reboot Pending</div></div>
    <div class="card"><div class="num">${totals.wuaIssues}</div><div class="label">Windows Update Issues</div></div>
    <div class="card"><div class="num">${totals.bitsIssues}</div><div class="label">BITS Issues</div></div>
    <div class="card"><div class="num">${totals.failed}</div><div class="label">Scan Failures</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Computer</th>
        <th>LOB</th>
        <th>OS</th>
        <th>Windows Update</th>
        <th>BITS</th>
        <th>Reboot Pending</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <div class="footer">
    BayouOps Patch Readiness is a read-only operational visibility aid. Validate findings before production decisions.
  </div>
</div>
</body>
</html>`;

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outFile = path.join(outDir, `bayouops_patch_readiness_${stamp}.html`);

fs.writeFileSync(outFile, html);
console.log(`HTML report created: ${outFile}`);
