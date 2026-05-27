# Demo Walkthrough

This walkthrough uses synthetic assets under `demo/`. Keep the demo path separate from production reports or customer data.

## Audience

The walkthrough is designed for:

- Sysadmins who need to see operational usefulness.
- MSP operators who need repeatable customer review material.
- IT managers who need a concise risk and readiness story.
- Recruiters or technical reviewers who need to understand the project quickly.

## Setup

Start by confirming the demo assets are present:

```bash
ls demo/data
ls demo/scenarios
ls demo/exports
```

Serve the repository locally:

```bash
npm run serve
```

Then open the executive scenario dashboard:

```text
demo/dashboards/DEMO_executive-dashboard-scenarios.html
```

The static server defaults to `127.0.0.1`, keeping the demo local to the operator workstation unless explicitly changed.

## Demo Path

Use this sequence for a focused 5-10 minute walkthrough.

1. Open with the executive scenarios.

   Start at `demo/dashboards/DEMO_executive-dashboard-scenarios.html`. Frame the dashboard as a readiness briefing: healthy, medium-risk, and critical-risk examples show how the same environment can be summarized for review before a maintenance window or stakeholder update.

   Point out the progression:

   - Healthy environment: work can proceed normally.
   - Medium-risk environment: maintenance can continue, but owner follow-up is needed.
   - Critical-risk environment: Sev1 issues require immediate coordination.

2. Move from summary to ownership.

   Open `demo/exports/DEMO_owner-worklist.csv`. Show how dashboard findings become assignable work outside the tool. Focus on owner, due date, approval requirement, and recommended action.

   Transition point:
   BayouOps is not trying to take action on systems. It helps operators identify who needs to review, approve, validate, or schedule the next step.

3. Review the supporting evidence.

   Use the CSV evidence files to show that the summary is backed by operational data:

   - `demo/data/DEMO_patch-compliance.csv`
   - `demo/data/DEMO_ssl-status.csv`
   - `demo/data/DEMO_exposure-findings.csv`
   - `demo/data/DEMO_stale-systems.csv`
   - `demo/data/DEMO_unsupported-os.csv`

   Do not walk every row. Pick one or two examples that connect back to the executive scenario and owner worklist.

4. Close with the operating boundary.

   BayouOps produces local reports, worklists, and coordination intelligence. It does not patch, reboot, remediate, enforce policy, or replace the systems that perform those actions.

## Narrative: Patch Drift

Patch drift is the gap between expected patch posture and current system state. In a live walkthrough, use this section to show how BayouOps separates routine patch follow-up from approval-sensitive production work.

Useful demo examples:

- `DEMO-SQL-PROD-01` has a pending reboot and requires production approval.
- `DEMO-FILE-LEGACY-01` has multiple missing critical and security patches.
- `DEMO-DEV-BUILD-01` shows lower-risk development patch drift.

Presentation point:
The value is not automatic patching. The value is a clear owner-aware view of which systems need review, which systems need approval, and which maintenance window applies.

## Narrative: SSL Expiration Risk

SSL expiration risk is operational risk caused by certificates that are expired or approaching expiration. Present it as coordination work between service owners, infrastructure owners, and change windows.

Useful demo examples:

- `DEMO-CERT-EXP-01` has an expired partner gateway certificate.
- `DEMO-API-EDGE-02` has a certificate expiring soon.
- `DEMO-INTRANET-01` combines SSL expiration pressure with unsupported OS risk.

Presentation point:
The dashboard should lead to practical questions: who owns the service, what is the impact, when can renewal happen, and who needs to validate the result?

## Narrative: Unsupported Systems

Unsupported systems are assets running operating systems that no longer have normal vendor support. Use this section to show that BayouOps treats unsupported platforms as planning and risk-decision items, not simple patch tasks.

Useful demo examples:

- `DEMO-ARCHIVE-01` runs Windows Server 2008 R2.
- `DEMO-INTRANET-01` runs Windows Server 2012.
- `DEMO-FILE-LEGACY-01` runs Windows Server 2012 R2.

Presentation point:
Unsupported systems usually require migration planning, isolation, owner approval, or explicit risk acceptance. BayouOps makes those candidates visible for review.

## Narrative: Stale Infrastructure

Stale infrastructure is infrastructure whose operational state is old or poorly validated. Present this as operational uncertainty: the team cannot make confident decisions when check-ins, patch scans, or owner validation are stale.

Useful demo examples:

- `DEMO-ARCHIVE-01` has stale check-in and patch scan data.
- `DEMO-FILE-LEGACY-01` has stale patch and owner validation data.
- `DEMO-DEV-BUILD-01` has stale owner validation even though it is lower criticality.

Presentation point:
BayouOps helps operators identify where the inventory itself needs review before the team relies on it for maintenance planning.

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
