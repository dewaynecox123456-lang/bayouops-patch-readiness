# Demo Walkthrough

This walkthrough uses synthetic assets under `demo/`. Do not mix production reports or customer data into the demo flow.

## Audience

The walkthrough is designed for:

- Sysadmins who need to see operational usefulness.
- MSP operators who need repeatable customer review material.
- IT managers who need a concise risk and readiness story.
- Recruiters or technical reviewers who need to understand the project quickly.

## Setup

Review the demo files:

```bash
ls demo/data
ls demo/scenarios
ls demo/exports
```

Open the static scenario preview:

```bash
npm run serve
```

Then browse to the local demo dashboard file under:

```text
demo/dashboards/DEMO_executive-dashboard-scenarios.html
```

The static server defaults to `127.0.0.1`.

## Demo Path

1. Start with the executive scenarios.
   - Healthy environment: readiness is strong and work can proceed normally.
   - Medium-risk environment: maintenance can continue, but owner follow-up is needed.
   - Critical-risk environment: immediate coordination is needed for Sev1 issues.

2. Move to the owner worklist.
   - Use `demo/exports/DEMO_owner-worklist.csv`.
   - Show how findings become assignable work.
   - Emphasize owner, due date, approval requirement, and recommended action.

3. Review operational evidence.
   - Use `demo/data/DEMO_patch-compliance.csv`.
   - Use `demo/data/DEMO_ssl-status.csv`.
   - Use `demo/data/DEMO_exposure-findings.csv`.
   - Use `demo/data/DEMO_stale-systems.csv`.
   - Use `demo/data/DEMO_unsupported-os.csv`.

4. Close with safety boundaries.
   - BayouOps does not patch, reboot, remediate, or enforce policy.
   - It produces coordination intelligence and local reports.

## Narrative: Patch Drift

Patch drift is the gap between expected patch posture and current system state.

In the demo data:

- `DEMO-SQL-PROD-01` has a pending reboot and requires production approval.
- `DEMO-FILE-LEGACY-01` has multiple missing critical and security patches.
- `DEMO-DEV-BUILD-01` shows lower-risk development patch drift.

Operational point:
BayouOps helps separate routine patch drift from approval-sensitive production work. The output should help teams decide who owns the next action and which maintenance window applies.

## Narrative: SSL Expiration Risk

SSL expiration risk is operational risk caused by certificates that are expired or approaching expiration.

In the demo data:

- `DEMO-CERT-EXP-01` has an expired partner gateway certificate.
- `DEMO-API-EDGE-02` has a certificate expiring soon.
- `DEMO-INTRANET-01` combines SSL expiration pressure with unsupported OS risk.

Operational point:
BayouOps frames SSL risk as coordination work: identify owner, service impact, approval needs, and renewal window.

## Narrative: Unsupported Systems

Unsupported systems are assets running operating systems that no longer have normal vendor support.

In the demo data:

- `DEMO-ARCHIVE-01` runs Windows Server 2008 R2.
- `DEMO-INTRANET-01` runs Windows Server 2012.
- `DEMO-FILE-LEGACY-01` runs Windows Server 2012 R2.

Operational point:
Unsupported systems are rarely fixed by a single patch action. They usually require migration planning, isolation, owner approval, or explicit risk acceptance.

## Narrative: Stale Infrastructure

Stale infrastructure is infrastructure whose operational state is old or poorly validated.

In the demo data:

- `DEMO-ARCHIVE-01` has stale check-in and patch scan data.
- `DEMO-FILE-LEGACY-01` has stale patch and owner validation data.
- `DEMO-DEV-BUILD-01` has stale owner validation even though it is lower criticality.

Operational point:
Stale systems create uncertainty. BayouOps makes that uncertainty visible so operators can refresh ownership, validate system status, or remove dead inventory.

## What To Avoid Saying

Avoid claims that BayouOps automatically fixes infrastructure.

Do not claim:

- Automatic patch deployment
- Automatic reboot orchestration
- Vulnerability scanning coverage
- SIEM replacement
- Endpoint management replacement
- Enterprise access control

Accurate positioning:
BayouOps provides local, read-only coordination intelligence from operational data.
