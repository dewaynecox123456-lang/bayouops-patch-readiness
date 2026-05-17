#!/usr/bin/env node
import fs from "fs";

const input = process.argv[2] || "samples/servers.csv";

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",");
  return lines.map(line => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

const rows = parseCsv(fs.readFileSync(input, "utf8"));
const seen = new Map();
const findings = [];

for (const row of rows) {
  const name = row.ComputerName || "";

  if (!name) findings.push({ severity: "HIGH", issue: "Missing ComputerName", server: "(blank)" });
  if (!row.LOB) findings.push({ severity: "WARN", issue: "Missing LOB", server: name });
  if (!row.OwnerName) findings.push({ severity: "WARN", issue: "Missing OwnerName", server: name });
  if (!row.OwnerPhone) findings.push({ severity: "INFO", issue: "Missing OwnerPhone", server: name });
  if (!row.PatchWave) findings.push({ severity: "WARN", issue: "Missing PatchWave", server: name });
  if (!row.Criticality) findings.push({ severity: "WARN", issue: "Missing Criticality", server: name });

  const key = name.toLowerCase();
  if (key) {
    if (seen.has(key)) {
      findings.push({ severity: "HIGH", issue: "Duplicate ComputerName", server: name });
    } else {
      seen.set(key, true);
    }
  }
}

console.log("");
console.log("BayouOps Inventory Hygiene Check");
console.log("--------------------------------");
console.log(`Inventory Rows: ${rows.length}`);
console.log(`Findings: ${findings.length}`);
console.log("");

if (findings.length === 0) {
  console.log("OK: No inventory hygiene findings detected.");
} else {
  for (const f of findings) {
    console.log(`[${f.severity}] ${f.server}: ${f.issue}`);
  }
}
