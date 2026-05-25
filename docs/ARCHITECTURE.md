# BayouOps Architecture

BayouOps is a lightweight, local-first operational readiness intelligence tool. It is built as a collection of shell scripts, Node.js utilities, CSV/JSON data files, and static HTML reports.

BayouOps does not run a persistent application server, require an agent framework, or introduce a database. The working directory is the operational boundary.

## Purpose

BayouOps helps infrastructure teams understand operational readiness before maintenance events, outages, and escalation calls.

The project focuses on:

- Operational ownership
- Maintenance governance
- Reboot coordination
- Exposure and readiness visibility
- Field operational awareness
- Local report generation
- Exportable worklists

BayouOps is not an RMM, SIEM, vulnerability scanner, SCCM, Intune, or endpoint management replacement.

## High-Level Flow

```text
Inventory / Context CSV
  -> Inventory Import
  -> Platform and Health Evidence
  -> Exposure Correlation
  -> Validation and Recommendations
  -> Ownership / Context Enrichment
  -> Readiness Scoring
  -> Dashboards, Queries, and Exports
```

The main orchestration path is `tools/run-operational-cycle.mjs`.

## Runtime Model

BayouOps is designed to run locally from the repository root.

Primary entry points:

- `npm start` runs `scripts/bayouops-start.sh`.
- `npm run serve` runs `scripts/serve.sh`.
- `npm test` runs shell syntax checks and Node syntax checks.
- `npm run build-release` runs `scripts/build-release.sh`.
- `scripts/bayouops-menu.sh` provides a terminal menu for common operator workflows.

Local HTTP serving uses Python's built-in static file server and defaults to `127.0.0.1:8088`.

Host and port can be overridden with:

```bash
BAYOUOPS_HOST=127.0.0.1
BAYOUOPS_PORT=8088
```

Operators may also copy `config/bayouops.env.example` to `config/bayouops.env` for local runtime settings.

## Directory Responsibilities

```text
config/
  Example local runtime configuration.

data/
  Durable product data, rules, context, ownership records, notes, readiness data, and historical snapshots.

docs/
  Architecture, safety, roadmap, release, and operational documentation.

incoming/
  Operator-provided CSV inventory drops. Ignored by Git by default.

samples/
  Sanitized sample CSVs for demos and validation.

scripts/
  Operator-facing shell and PowerShell workflows.

tools/
  Node.js and shell utilities for import, evidence collection, scoring, enrichment, dashboards, and exports.

reports/
  Generated HTML dashboards. Ignored by Git by default.

build/
  Intermediate generated JSON and normalized operational state. Ignored by Git by default.

exports/
  Generated CSV worklists and query exports. Ignored by Git by default.

archive/
  Archived reports, generated build snapshots, and historical operational artifacts. Ignored by Git by default.
```

## Data Inputs

BayouOps currently accepts lightweight CSV inputs:

- Inventory CSVs under `incoming/`
- Operational context CSVs passed to `tools/import-operational-context.mjs`
- Sample CSVs under `samples/`
- Template CSVs under `templates/`

CSV handling is intentionally lightweight and dependency-free. The current validation rejects empty files, duplicate or blank headers, missing required columns, and rows with extra columns that cannot be safely mapped by the simple parser.

## Processing Components

Inventory and context:

- `tools/inventory-import.mjs` normalizes the latest incoming CSV into `build/inventory/inventory-normalized.json`.
- `tools/import-operational-context.mjs` imports ownership and operational context into `data/ownership/ownership-registry.json`.
- `tools/query-assets.mjs` searches operational ownership/context data.
- `tools/export-query-csv.mjs` exports query results.

Evidence collection:

- `tools/platform-detect.sh` identifies the local platform family.
- `tools/reboot-adapter.sh` records reboot state using platform-specific checks.
- `tools/linux-health-collector.sh` collects local Linux operational health evidence.
- `scripts/BayouOps-PatchReadiness.ps1` performs read-only Windows readiness checks.

Analysis and enrichment:

- `tools/exposure-correlation.mjs` applies exposure rules.
- `tools/inventory-validation.mjs` validates normalized inventory.
- `tools/recommendation-engine.mjs` produces recommendations.
- `tools/ownership-enrichment.mjs` enriches findings with ownership.
- `tools/readiness-scoring-engine.mjs` calculates readiness.
- `tools/context-enrichment.mjs` adds site/context data.
- `tools/operational-priority-engine.mjs` creates operational priority output.

Dashboards and reports:

- `tools/generate-exposure-dashboard.mjs`
- `tools/generate-trend-dashboard.mjs`
- `tools/generate-noc-dashboard.mjs`
- `tools/generate-executive-dashboard.mjs`
- `tools/generate-html-report.mjs`
- `tools/generate-delta-dashboard.mjs`

## Output Model

BayouOps writes generated outputs to local files:

- `build/` for intermediate normalized state
- `reports/` for static HTML dashboards
- `exports/` for CSV worklists
- `archive/` for snapshots and generated history
- `release/` for release packages when built

Generated operational outputs may include hostnames, owners, escalation contacts, readiness state, and maintenance information. They should be treated as operationally sensitive.

## Design Constraints

BayouOps intentionally keeps the architecture small:

- No database
- No background daemon
- No endpoint agent
- No cloud synchronization
- No automatic patching
- No automatic rebooting
- No remediation workflow
- No large application framework
- No required third-party Node dependencies

The project favors readable scripts and explicit file outputs over hidden services.
