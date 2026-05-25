# GitHub Showcase Layout

This document defines the recommended screenshot order for GitHub README, LinkedIn posts, recruiter portfolio review, and MSP/operator demos.

Use DEMO or sanitized data only.

## Presentation Principle

Lead with the executive view, then prove operational usefulness.

Recommended order:

```text
Executive summary
  -> Operational analyst detail
  -> Export/report artifact
  -> Readiness scoring
  -> Terminal/local workflow
```

This keeps the project understandable to managers while still showing practical depth for sysadmins and MSP operators.

## GitHub README Screenshot Order

Use 4-6 images in the README. Keep the rest in docs or `screenshots/`.

Recommended order:

1. `bayouops-executive-dashboard-critical-risk.png`
   - Place after "What BayouOps Is".
   - Shows the clearest operational problem and executive posture.

2. `bayouops-analyst-exposure-findings.png`
   - Place near operational narratives.
   - Shows that the project is not only a summary page.

3. `bayouops-export-owner-worklist.png`
   - Place near demo/export discussion.
   - Shows coordination output.

4. `bayouops-readiness-scoring-overview.png`
   - Place near readiness/scoring text.
   - Shows how posture is summarized.

5. `bayouops-terminal-control-menu.png`
   - Place near command examples or local-first operation.
   - Shows lightweight operator workflow.

6. `bayouops-executive-dashboard-healthy.png`
   - Optional closing image.
   - Shows the desired healthy state.

Avoid placing a terminal screenshot first. GitHub readers should understand the operational value before seeing command-line mechanics.

## LinkedIn Post Order

### Single-Image Post

Best single image:

```text
bayouops-executive-dashboard-critical-risk.png
```

Why:
It communicates the problem quickly: unsupported systems, expired SSL, stale infrastructure, patch drift, and approval-sensitive production risk.

Recommended crop:

```text
1200 x 627
```

Caption structure:

- Problem: teams need readiness context before maintenance or outage calls.
- Artifact: BayouOps uses DEMO data to show posture, findings, and ownership.
- Boundary: BayouOps does not patch, reboot, or remediate.

### Carousel Post

Recommended order:

1. Executive critical-risk dashboard
2. Operational exposure findings
3. Owner worklist export
4. Readiness scoring overview
5. Terminal/local workflow
6. Safety boundary slide or caption

Recommended dimensions:

```text
1080 x 1080
```

Do not imply production adoption, automated remediation, vulnerability scanning, or endpoint management.

## Recruiter Portfolio Order

Recruiters and technical reviewers need to understand the project quickly and see engineering judgment.

Recommended order:

1. Executive dashboard
   - Shows product purpose.

2. Architecture excerpt or README workflow section
   - Shows data flow and lightweight design.

3. Operational analyst view
   - Shows practical domain depth.

4. Export/report view
   - Shows useful output artifacts.

5. Terminal test or local workflow screenshot
   - Shows script-driven engineering and validation.

6. Release process or demo release artifact
   - Shows packaging and release discipline.

Portfolio caption guidance:

- Mention local-first architecture.
- Mention read-only safety boundary.
- Mention CSV/JSON/static dashboard workflow.
- Mention demo data is synthetic.
- Avoid unsupported scale or production claims.

## MSP and Operator Demo Order

MSP and operator audiences usually care about repeatable workflow and customer-ready artifacts.

Recommended order:

1. Executive summary dashboard
   - Start with the view a customer or manager would understand.

2. Approval-required systems
   - Show where operational coordination is needed.

3. Exposure findings table
   - Show severity, owner, and recommended action.

4. SSL status table
   - Show certificate renewal risk.

5. Unsupported OS or stale infrastructure table
   - Show long-tail operational cleanup.

6. Owner worklist export
   - Show handoff to teams.

7. Readiness scoring overview
   - Show prioritization and posture rollup.

8. Terminal/menu workflow
   - Show how the operator runs the process locally.

Operator demo talking points:

- BayouOps is visibility and coordination, not endpoint control.
- Reports can contain sensitive operational context.
- Default local bind is `127.0.0.1`.
- Demo data is synthetic and marked DEMO.

## Export and Report Showcase Flow

Use this flow when the goal is to show practical deliverables.

1. `bayouops-export-executive-summary.png`
   - Shows manager-ready summary fields.

2. `bayouops-export-owner-worklist.png`
   - Shows assignment-ready operational rows.

3. `bayouops-export-query-csv.png`
   - Shows ad hoc query output.

4. `bayouops-report-html-summary.png`
   - Shows static report output.

Recommended caption:

BayouOps turns operational findings into local reports and CSV worklists that can be reviewed, assigned, and archived through existing team processes.

## Operational Analyst Flow

Use this flow when the goal is to show day-to-day operator value.

1. NOC view
2. Approval-required query
3. Exposure findings
4. SSL status
5. Stale infrastructure
6. Unsupported systems
7. Asset lookup terminal output

Recommended caption:

The operator flow focuses on ownership, approval requirements, severity, and recommended next action.

## Terminal Screenshot Placement

Terminal screenshots should support the local-first story.

Best README placement:

- After command examples
- Near local-first operation
- Near operator quickstart links

Best demo placement:

- Near the end, after the audience understands what the outputs mean

Best portfolio placement:

- After at least one dashboard and one data/export view

Avoid:

- Leading with terminal screenshots
- Showing long command history
- Showing local private paths
- Showing noisy debug output

## Final README Image Skeleton

Suggested README structure:

```markdown
## What BayouOps Is

![Executive critical-risk dashboard](screenshots/bayouops-executive-dashboard-critical-risk.png)

## Core Workflow

![Control menu](screenshots/bayouops-terminal-control-menu.png)

## Operational Narratives

![Exposure findings](screenshots/bayouops-analyst-exposure-findings.png)

## Demo Environment

![Owner worklist export](screenshots/bayouops-export-owner-worklist.png)

## Readiness Scoring

![Readiness scoring overview](screenshots/bayouops-readiness-scoring-overview.png)
```

Use existing screenshot filenames until the screenshot cleanup pass renames or replaces assets.
