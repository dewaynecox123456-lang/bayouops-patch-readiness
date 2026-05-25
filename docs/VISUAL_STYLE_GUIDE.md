# Visual Style Guide

This guide defines visual consistency rules for BayouOps screenshots, demo assets, GitHub presentation, and social sharing.

Use sanitized or DEMO data only.

## Visual Goals

BayouOps should look operational, readable, and practical.

The visual style should communicate:

- Local-first operational tooling
- Readiness and risk clarity
- Ownership-aware coordination
- Executive summaries without exaggeration
- Analyst views that are easy to scan

Avoid making BayouOps look like an endpoint control platform, SIEM replacement, or automated remediation system.

## Screenshot Categories

### Executive Dashboard Screenshots

Purpose:
Show readiness posture, risk themes, and management-facing summaries.

Recommended captures:

- Healthy environment scenario
- Medium-risk environment scenario
- Critical-risk environment scenario
- Executive operational view
- Trend summary view

Primary audience:
IT managers, MSP account leads, recruiters, and technical reviewers.

Visual priority:
Clear status, summary metrics, and recommended action.

### Operational Analyst Screenshots

Purpose:
Show how operators inspect findings, owners, approvals, and affected systems.

Recommended captures:

- NOC operational view
- Approval-required asset query
- Exposure findings table
- SSL status table
- Stale infrastructure table
- Unsupported OS table

Primary audience:
Sysadmins, NOC analysts, MSP operators, and infrastructure leads.

Visual priority:
Readable tables, severity labels, owner context, and next action fields.

### Export and Report Screenshots

Purpose:
Show that BayouOps can produce portable outputs for coordination outside the tool.

Recommended captures:

- CSV owner worklist
- Executive summary export
- Query CSV export
- Release/report folder overview if needed

Primary audience:
MSP operators, IT managers, and operational coordinators.

Visual priority:
Columns should show owner, hostname, severity, due date, approval requirement, and recommended action.

### Readiness Scoring Screenshots

Purpose:
Show system-level readiness and environment-level posture.

Recommended captures:

- Readiness dashboard
- Readiness score table
- Healthy, Review, Risk, and Critical examples in one view
- System detail with findings contributing to score

Primary audience:
Sysadmins, managers, and reviewers who need to understand how findings become a posture summary.

Visual priority:
Scores must be legible and status colors should be consistent.

## Naming Conventions

Use lowercase, hyphen-separated names for public repository screenshots.

Recommended pattern:

```text
bayouops-<category>-<view>-<state>.png
```

Examples:

```text
bayouops-executive-dashboard-healthy.png
bayouops-executive-dashboard-medium-risk.png
bayouops-executive-dashboard-critical-risk.png
bayouops-analyst-exposure-findings.png
bayouops-analyst-approval-required.png
bayouops-export-owner-worklist.png
bayouops-readiness-scoring-overview.png
```

For demo-only images, prefix with `demo-`:

```text
demo-bayouops-executive-dashboard-critical-risk.png
```

Keep existing legacy screenshot names unless there is a specific cleanup pass.

## Recommended Dimensions

GitHub README hero or first dashboard:

```text
1440 x 900
```

Executive dashboard cards:

```text
1440 x 900
```

Operational tables:

```text
1280 x 900
```

Terminal/menu screenshots:

```text
1200 x 800
```

LinkedIn/social single-image posts:

```text
1200 x 627
```

LinkedIn carousel slides:

```text
1080 x 1080
```

Avoid tiny captures. Text should be readable when viewed in the GitHub README without opening the image in a new tab.

## Dark and Light Consistency

Use light backgrounds for executive summaries, exports, and manager-facing visuals.

Use dark backgrounds only where already established by the dashboard or terminal view.

Do not mix dark and light versions of the same view in one screenshot set unless the difference is intentional and explained.

Recommended pairing:

- Executive dashboards: light
- CSV/export examples: light
- Operational analyst dashboards: current app theme
- Terminal/control menu: dark terminal
- Readiness scoring dashboard: current dashboard theme

Status colors should remain consistent:

- Healthy: green
- Review: blue or amber, depending on the existing dashboard
- Risk: amber
- Critical: red

Do not use decorative gradients or unrelated stock imagery for operational screenshots.

## Terminal Styling

Terminal screenshots should be consistent:

- Dark terminal background
- Monospace font
- 12-14px font size
- No personal shell prompt details if avoidable
- Command visible when it helps explain the workflow
- Output trimmed to the meaningful section
- Project path hidden or shortened when it is not relevant

Recommended terminal width:

```text
100-120 columns
```

Recommended terminal examples:

- `npm test`
- `npm start`
- `node tools/query-assets.mjs SQL-PROD-01`
- `scripts/bayouops-menu.sh`

Avoid showing secrets, real hostnames, real user directories, API keys, tokens, or private customer names.

## GitHub README Image Placement

Recommended README image order:

1. Logo at the top.
2. First executive dashboard screenshot after "What BayouOps Is".
3. Workflow or control menu screenshot near command examples.
4. Analyst screenshot near operational narratives.
5. Export screenshot near demo/worklist description.
6. Readiness scoring screenshot near readiness/scoring explanation.

Use one strong screenshot first. Place the rest where they support the text.

Suggested Markdown pattern:

```markdown
![BayouOps executive readiness dashboard](screenshots/executive-operational-view.png)
```

Keep alt text factual and specific.

## LinkedIn and Social Showcase

Recommended social sequence:

1. Executive dashboard: shows what the tool helps summarize.
2. Operational analyst view: shows practical depth for sysadmins and MSP operators.
3. Export/worklist view: shows coordination output.
4. Safety slide or caption: explains that BayouOps is visibility and coordination, not automation.

Recommended caption framing:

- Problem: teams need readiness context before maintenance or outage calls.
- Approach: local-first scripts and static reports turn operational data into summaries and worklists.
- Boundary: BayouOps does not patch, reboot, or remediate systems.
- Artifact: show DEMO data, not production data.

Do not claim production adoption, enterprise scale, automatic remediation, vulnerability scanner coverage, or endpoint management capability unless those claims become true and are documented.

## Review Checklist

Before publishing screenshots:

- DEMO or sanitized data only
- No real hostnames or owner contacts
- No private paths or tokens
- Consistent naming
- Text readable at GitHub size
- Captures match the current README story
- Safety boundary remains clear
