# Release Process

BayouOps uses a lightweight, local release workflow. No CI/CD platform is required.

The release process is designed for Fedora/Linux-first operator workstations and should also work on most standard Linux environments with Bash, Node.js, Python 3, Git, and `zip`.

## Release Goals

A BayouOps release package should be easy to inspect, copy, unzip, and run locally.

The release should include:

- Project documentation
- Operator quickstart material
- Scripts and tools
- Sanitized samples
- Curated screenshots
- DEMO datasets and scenario exports when building a demo release
- Existing generated HTML reports only when intentionally included

The release should not include:

- Real customer inventory
- Unsanitized reports
- Private runtime configuration
- Local operator paths
- `node_modules/`
- Secrets, tokens, or credentials

## Release Types

### Standard Release

Use the existing script:

```bash
./scripts/build-release.sh
```

This creates a timestamped ZIP under `release/` containing core documentation, screenshots, samples, tools, and reports if present.

### Demo Release

Use:

```bash
./scripts/build-demo-release.sh
```

This creates a ZIP under `release/` that includes the normal project presentation material plus the synthetic `demo/` dataset, demo exports, scenario JSON, and static demo dashboard.

Demo releases are for presentations, GitHub review, portfolio review, screenshots, and stakeholder walkthroughs. They should remain clearly marked as DEMO.

## Release ZIP Structure

Recommended standard release shape:

```text
BayouOps_<version>_<timestamp>/
  README.md
  CHANGELOG.md
  VERSION
  package.json
  docs/
  scripts/
  tools/
  samples/
  screenshots/
  reports/
```

Recommended demo release shape:

```text
BayouOps_DEMO_<version>_<timestamp>/
  README.md
  CHANGELOG.md
  VERSION
  package.json
  docs/
  scripts/
  tools/
  samples/
  screenshots/
  demo/
    README.md
    screenshots-needed.md
    data/
    exports/
    scenarios/
    dashboards/
```

## Screenshot Packaging

Package curated screenshots from `screenshots/`.

Recommended public screenshot set:

- `executive-operational-view.png`
- `operational-query-approval-required.png`
- `noc-operational-view.png`
- `operational-query-csv-export.png`
- `BayouOps_Control_Menu_v1.png`
- `operational-readiness-dashboard-v2.png`
- `BayouOps_Exposure_Dashboard_v1.png`
- `BayouOps_Trend_Intelligence_Dashboard_v1.png`

Do not package private screenshots that contain real hostnames, owner names, internal URLs, customer names, or workstation paths.

Demo screenshot planning files should be included from:

```text
demo/screenshots-needed.md
docs/SCREENSHOT_GUIDE.md
docs/SCREENSHOT_CAPTURE_WORKFLOW.md
docs/VISUAL_STYLE_GUIDE.md
```

## Demo Dataset Inclusion

Demo releases should include only synthetic demo data from `demo/`.

Expected demo data:

- `demo/data/DEMO_servers.csv`
- `demo/data/DEMO_patch-compliance.csv`
- `demo/data/DEMO_ssl-status.csv`
- `demo/data/DEMO_exposure-findings.csv`
- `demo/data/DEMO_readiness-scoring.csv`
- `demo/data/DEMO_stale-systems.csv`
- `demo/data/DEMO_unsupported-os.csv`
- `demo/scenarios/*.json`
- `demo/dashboards/*.html`

Every demo record should remain clearly marked as DEMO.

## Export Examples

Demo export examples live under:

```text
demo/exports/
```

Expected examples:

- `DEMO_executive-summary.csv`
- `DEMO_owner-worklist.csv`
- `DEMO_dashboard-metrics.json`

These examples show the type of coordination artifacts BayouOps can produce without implying production deployment or automated remediation.

## Fedora/Linux-First Workflow

Recommended release workstation checks:

```bash
git status --short --branch
npm test
command -v zip
command -v node
command -v python3
```

Build a demo release:

```bash
./scripts/build-demo-release.sh
```

Inspect the ZIP:

```bash
zipinfo release/BayouOps_DEMO_*.zip | less
```

Unzip to a temporary folder and spot-check:

```bash
mkdir -p /tmp/bayouops-release-check
unzip -q release/BayouOps_DEMO_*.zip -d /tmp/bayouops-release-check
find /tmp/bayouops-release-check -maxdepth 3 -type f | sort | less
```

## Rollback Tagging Strategy

Use lightweight Git tags for local release checkpoints.

Before cutting a release:

```bash
git status --short
git tag release-prep-YYYYMMDD-HHMM
```

After validating a release ZIP:

```bash
git tag release-v0.1.0-demo-YYYYMMDD
```

If a release needs to be rolled back, return to the previous known-good tag:

```bash
git switch main
git switch -c rollback/release-v0.1.0-demo-YYYYMMDD release-v0.1.0-demo-YYYYMMDD
```

Do not delete old release tags casually. Prefer creating a new corrective tag after the issue is understood.

## Manual Release Checklist

Before packaging:

- `git status --short --branch` reviewed
- `npm test` passes
- README renders locally or on GitHub
- Demo data is synthetic and marked DEMO
- Screenshots are sanitized
- No private `config/bayouops.env`
- No real `incoming/` inventory
- No generated customer reports

After packaging:

- ZIP created under `release/`
- ZIP structure inspected
- Demo files present when building a demo release
- Screenshots present
- Export examples present
- Release tag created after validation

## Architecture Boundary

The release process should stay script-based and local. Do not require a hosted CI/CD system, background service, database, or dashboard rewrite for packaging.
