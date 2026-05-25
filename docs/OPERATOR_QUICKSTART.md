# Operator Quickstart

This quickstart is for operators running BayouOps locally on Fedora or another Linux workstation.

BayouOps is a local-first visibility and coordination tool. It does not patch, reboot, remediate, or enforce endpoint policy.

## Prerequisites

Recommended tools:

- Bash
- Git
- Node.js
- Python 3
- `zip`
- PowerShell only if running the Windows readiness scanner

Fedora package check:

```bash
command -v bash
command -v git
command -v node
command -v python3
command -v zip
```

Install missing tools with the normal system package workflow for your workstation.

## First Run

From the repository root:

```bash
npm test
```

Start the local workflow:

```bash
npm start
```

Serve static dashboards and demo files:

```bash
npm run serve
```

The local static server defaults to:

```text
http://127.0.0.1:8088
```

## Local Host and Port

Default bind:

```text
127.0.0.1:8088
```

Override for the current shell:

```bash
BAYOUOPS_HOST=127.0.0.1 BAYOUOPS_PORT=8088 npm run serve
```

Persistent local override:

```bash
cp config/bayouops.env.example config/bayouops.env
```

Keep `config/bayouops.env` local. Do not commit operator-specific bind settings.

## Common Operator Commands

Run syntax checks:

```bash
npm test
```

Open the terminal menu:

```bash
./scripts/bayouops-menu.sh
```

Query an asset:

```bash
node tools/query-assets.mjs SQL-PROD-01
```

Run the demo workflow:

```bash
./scripts/run-demo.sh
```

Build a standard release:

```bash
./scripts/build-release.sh
```

Build a demo release:

```bash
./scripts/build-demo-release.sh
```

## Demo Materials

Synthetic demo assets are under:

```text
demo/
```

Useful starting points:

- `demo/README.md`
- `demo/dashboards/DEMO_executive-dashboard-scenarios.html`
- `demo/exports/DEMO_executive-summary.csv`
- `demo/exports/DEMO_owner-worklist.csv`
- `docs/DEMO_WALKTHROUGH.md`

All demo data should remain clearly marked as DEMO.

## Release Validation

Before sharing a ZIP:

```bash
git status --short --branch
npm test
./scripts/build-demo-release.sh
zipinfo release/BayouOps_DEMO_*.zip | less
```

Confirm the ZIP does not contain:

- Real inventory from `incoming/`
- Private `config/bayouops.env`
- Customer reports
- Secrets or tokens
- Unsanitized screenshots

## Operator Safety Notes

BayouOps generated output may contain operationally sensitive data:

- Hostnames
- Owners
- Escalation contacts
- Maintenance windows
- Patch posture
- Unsupported OS details
- Readiness findings

Treat `build/`, `reports/`, `exports/`, `archive/`, and release ZIPs as operational artifacts.

Use broader network binds only when intentionally sharing dashboards and only when the network controls are understood.
