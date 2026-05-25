# Screenshot Guide

This guide recommends screenshot placement for GitHub, demos, and portfolio review. Use sanitized or DEMO data only.

## README Placement

Recommended order for the README:

1. Logo at the top.
2. Executive operational view after the first product description.
3. Approval-required query after the workflow section.
4. NOC operational view near operational user workflows.
5. CSV export screenshot near export/worklist text.
6. Control menu screenshot near command examples.
7. Readiness, exposure, and trend dashboards near dashboard or demo sections.

Do not place every screenshot above the project explanation. The first visible section should tell readers what BayouOps is and what it does.

## Existing Screenshot Assets

Recommended public screenshot flow:

- `screenshots/executive-operational-view.png`
- `screenshots/operational-query-approval-required.png`
- `screenshots/noc-operational-view.png`
- `screenshots/operational-query-csv-export.png`
- `screenshots/BayouOps_Control_Menu_v1.png`
- `screenshots/operational-readiness-dashboard-v2.png`
- `screenshots/BayouOps_Exposure_Dashboard_v1.png`
- `screenshots/BayouOps_Trend_Intelligence_Dashboard_v1.png`

## Suggested Captions

Executive operational view:
Shows the manager-facing summary of readiness posture, risk areas, and action focus.

Approval-required query:
Shows how operators identify systems where production approval or ownership coordination is required.

NOC operational view:
Shows triage context for support teams, including severity, ownership, and recommended action.

CSV export:
Shows how BayouOps turns findings into worklists that can be assigned outside the tool.

Control menu:
Shows the lightweight operator workflow and reinforces that the project is script-driven.

Readiness dashboard:
Shows system-level readiness scoring and operational status labels.

Exposure dashboard:
Shows exposure findings grouped by severity and owner.

Trend dashboard:
Shows how readiness posture can be reviewed over time.

## Demo Screenshot Set

The demo-specific screenshot checklist is in `demo/screenshots-needed.md`.

Recommended demo captures:

- Healthy executive scenario
- Medium-risk executive scenario
- Critical-risk executive scenario
- Owner worklist export
- Exposure findings table
- SSL status table
- Readiness score table

## Capture Standards

- Keep `DEMO` labels visible when using demo data.
- Avoid production hostnames, owners, phone numbers, escalation contacts, or internal URLs.
- Prefer 1440px-wide captures for executive dashboard screenshots.
- Prefer 1280px-wide captures for operational tables and export examples.
- Use consistent browser zoom, usually 100 percent.
- Keep the capture focused on the actual interface or data table.

## GitHub Presentation Notes

For GitHub review, screenshots should support the explanation rather than replace it. A recruiter, sysadmin, MSP operator, or IT manager should be able to understand the project from the headings and captions even before opening the images.
