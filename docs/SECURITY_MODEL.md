# BayouOps Security Model

BayouOps follows a local-first, read-only operational visibility model. Its default behavior is designed to reduce accidental infrastructure impact and avoid unnecessary network exposure.

## Trust Boundary

The local working directory is the primary trust boundary.

BayouOps reads local CSV, JSON, Markdown, and script files. It writes generated output to local folders such as `build/`, `reports/`, `exports/`, and `archive/`.

Operators are responsible for controlling access to the workstation, repository checkout, generated reports, and imported operational data.

## Safety Principles

BayouOps is designed for decision support, not control.

The project does not:

- Deploy patches
- Force reboots
- Modify services
- Change registry values
- Enforce endpoint policy
- Remediate findings
- Perform SQL failover
- Replace endpoint management platforms

Findings and dashboards should be reviewed by qualified administrators before operational action is taken.

## Local Network Exposure

Static report serving defaults to `127.0.0.1`.

This keeps dashboards available to the local operator without exposing generated operational reports to the LAN by default. Generated reports may contain sensitive operational data, including hostnames, ownership details, readiness state, maintenance windows, escalation contacts, and environment labels.

Host and port may be overridden through:

```bash
BAYOUOPS_HOST=127.0.0.1
BAYOUOPS_PORT=8088
```

or by creating a local `config/bayouops.env` file from `config/bayouops.env.example`.

Use a broader bind address only when there is an intentional operational reason and the surrounding network controls are understood.

## Data Sensitivity

BayouOps data can include:

- Hostnames
- Operating system and build information
- Patch or readiness posture
- Pending reboot state
- Uptime indicators
- Owner names and teams
- Escalation contacts
- Maintenance windows
- PCI scope flags
- Operational notes and runbook content

These files should be handled as operationally sensitive:

- `incoming/`
- `build/`
- `reports/`
- `exports/`
- `archive/`
- `data/ownership/`
- `data/notes/`
- `data/exposure/`

Sanitized examples should live under `samples/` and `templates/`.

## Git Hygiene

Generated and operator-specific files are ignored by default where practical:

- `build/`
- `reports/`
- `incoming/`
- `exports/`
- `archive/`
- `config/bayouops.env`
- `node_modules/`

Do not commit real customer inventory, generated operational reports, private runtime overrides, or unsanitized escalation data.

See `docs/GITIGNORE-RECOMMENDATIONS.md` for current ignore guidance.

## Input Handling

BayouOps uses lightweight CSV parsing without third-party dependencies.

Current low-risk validation rejects:

- Empty CSV files
- Blank or duplicate headers
- Missing required columns for supported import paths
- Rows with more columns than the header row
- Operational context rows without a hostname

This validation reduces accidental malformed imports, but it is not a full CSV security boundary. Inputs should still come from trusted operators or sanitized sources.

## Script Execution Model

BayouOps scripts are local operator tools. They should be run from a trusted checkout.

Important behaviors:

- `tools/run-operational-cycle.mjs` orchestrates local tools with static commands.
- `scripts/bayouops-start.sh` runs the operational cycle and starts a local static server.
- `scripts/serve.sh` serves the working directory locally by default.
- `scripts/BayouOps-PatchReadiness.ps1` performs read-only Windows checks using CIM, service queries, and remote registry reads.
- Linux collectors read local platform, reboot, service, firewall, disk, and OS state.

Do not run these scripts from an untrusted or modified checkout.

## Release Safety

Release packaging should include only intentional documentation, sanitized samples, curated screenshots, tools, and safe example reports.

Before publishing or sharing a release package, review it for:

- Real hostnames
- Real owner names or contact details
- Customer-specific maintenance windows
- Operational notes copied from production runbooks
- Generated reports containing live posture
- Local config files

## Known Limitations

BayouOps is not a hardened multi-user web application.

Current limitations include:

- Static report serving from the local checkout
- Lightweight CSV parsing
- No authentication layer for the local static server
- No role-based access control
- No encryption-at-rest management
- No secrets manager integration
- No centralized audit log

These are acceptable for the current local-first tooling model, but they should be revisited if BayouOps becomes a shared service or network-hosted application.
