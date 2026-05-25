# BayouOps Demo Environment

This directory contains generated DEMO data for BayouOps presentations, screenshots, export examples, and workflow validation.

All files in this directory are synthetic. They are not production data.

## Contents

- `data/DEMO_servers.csv` - synthetic server inventory with owners, environments, OS versions, sites, and maintenance windows.
- `data/DEMO_patch-compliance.csv` - patch posture, missing patch counts, reboot state, and compliance status.
- `data/DEMO_ssl-status.csv` - certificate status for public and internal service endpoints.
- `data/DEMO_exposure-findings.csv` - operational exposure findings with severity, owner, and recommended action.
- `data/DEMO_readiness-scoring.csv` - BayouOps-style readiness scores and executive status labels.
- `data/DEMO_stale-systems.csv` - systems with stale check-ins, stale patch data, or stale ownership validation.
- `data/DEMO_unsupported-os.csv` - unsupported or near-end-of-support operating system examples.
- `scenarios/DEMO_healthy-environment.json` - executive scenario for a healthy environment.
- `scenarios/DEMO_medium-risk-environment.json` - executive scenario for moderate operational risk.
- `scenarios/DEMO_critical-risk-environment.json` - executive scenario for critical operational risk.
- `exports/DEMO_executive-summary.csv` - export-friendly executive scenario summary.
- `exports/DEMO_owner-worklist.csv` - owner-oriented operational worklist.
- `exports/DEMO_dashboard-metrics.json` - consistent dashboard metric set for demos.
- `dashboards/DEMO_executive-dashboard-scenarios.html` - static visual preview of the three executive scenarios.
- `screenshots-needed.md` - recommended screenshot checklist for demo collateral.

## Demo Story

The demo environment is designed to show three common executive-facing views:

1. A healthy environment with strong patch compliance, no urgent SSL issues, and few exposure findings.
2. A medium-risk environment with aging patch posture, owner follow-up, stale systems, and expiring certificates.
3. A critical-risk environment with unsupported OS exposure, failed patch posture, expired certificates, and approval-sensitive production systems.

## Safety Note

These assets are intentionally stored under `demo/` so they do not overwrite existing `samples/`, `data/`, `incoming/`, `exports/`, or generated runtime outputs.

Every generated record includes a `DataClassification` or equivalent `DEMO` marker.
