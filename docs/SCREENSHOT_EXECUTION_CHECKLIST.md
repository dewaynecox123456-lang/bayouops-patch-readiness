# Screenshot Execution Checklist

Use this checklist when capturing the BayouOps screenshot set from the DEMO datasets and visual guidance.

Documentation source files:

- `docs/VISUAL_STYLE_GUIDE.md`
- `docs/SCREENSHOT_CAPTURE_WORKFLOW.md`
- `docs/SCREENSHOT_GUIDE.md`
- `demo/README.md`
- `demo/screenshots-needed.md`

## Pre-Capture Setup

- [ ] Confirm all visible data is DEMO or sanitized.
- [ ] Confirm `DEMO` labels are visible where demo data appears.
- [ ] Close unrelated browser tabs and terminal panes.
- [ ] Set browser zoom to 100 percent.
- [ ] Use consistent viewport dimensions for each category.
- [ ] Remove or crop private workstation paths when they add no value.
- [ ] Confirm screenshots do not show tokens, secrets, real customer names, or real internal URLs.
- [ ] Confirm visual theme matches the screenshot category.

## Highest-Value Dashboard Views

Capture these first:

1. Executive critical-risk scenario
   - Highest storytelling value.
   - Shows unsupported OS, expired SSL, stale systems, and production approval pressure.

2. Executive healthy scenario
   - Shows the desired operating state.
   - Provides contrast with medium and critical risk.

3. Operational analyst exposure findings
   - Shows practical severity, owner, and recommended action context.

4. Owner worklist export
   - Shows how findings become assignable work.

5. Readiness scoring overview
   - Shows how individual system posture rolls up into a readiness score.

6. Terminal control menu or asset query
   - Shows the lightweight local operator workflow.

## Executive-First Presentation Flow

Capture sequence:

- [ ] `bayouops-executive-dashboard-critical-risk.png`
- [ ] `bayouops-executive-dashboard-medium-risk.png`
- [ ] `bayouops-executive-dashboard-healthy.png`
- [ ] `bayouops-executive-operational-view.png`
- [ ] `bayouops-readiness-scoring-overview.png`

What to show:

- Readiness score
- Critical findings
- Unsupported systems
- Expired or expiring SSL
- Recommended executive action

Recommended dimensions:

```text
1440 x 900
```

## Operational Analyst Flow

Capture sequence:

- [ ] `bayouops-analyst-noc-view.png`
- [ ] `bayouops-analyst-approval-required.png`
- [ ] `bayouops-analyst-exposure-findings.png`
- [ ] `bayouops-analyst-ssl-status.png`
- [ ] `bayouops-analyst-stale-infrastructure.png`
- [ ] `bayouops-analyst-unsupported-systems.png`

What to show:

- Hostname
- Environment
- Severity or readiness status
- Owner
- Approval requirement
- Recommended action

Recommended dimensions:

```text
1280 x 900
```

## Export and Report Showcase Flow

Capture sequence:

- [ ] `bayouops-export-owner-worklist.png`
- [ ] `bayouops-export-executive-summary.png`
- [ ] `bayouops-export-query-csv.png`
- [ ] `bayouops-report-html-summary.png`

What to show:

- Worklist ownership
- Due date or action timing
- Approval required field
- Recommended action
- Summary fields useful outside BayouOps

Recommended dimensions:

```text
1280 x 900
```

## Readiness Scoring Flow

Capture sequence:

- [ ] `bayouops-readiness-scoring-overview.png`
- [ ] `bayouops-readiness-score-table.png`
- [ ] `bayouops-readiness-score-drivers.png`

What to show:

- Healthy, Review, Risk, and Critical examples
- Score values
- Score drivers or findings
- Environment-level posture

Recommended dimensions:

```text
1440 x 900
```

## Terminal Screenshot Guidance

Capture terminal screenshots only when they explain the lightweight operator workflow.

Recommended terminal captures:

- [ ] `bayouops-terminal-npm-test.png`
- [ ] `bayouops-terminal-startup.png`
- [ ] `bayouops-terminal-control-menu.png`
- [ ] `bayouops-terminal-asset-query.png`

Recommended commands:

```bash
npm test
npm start
./scripts/bayouops-menu.sh
node tools/query-assets.mjs SQL-PROD-01
```

Terminal style:

- Dark background
- Monospace font
- 12-14px font size
- 100-120 columns
- Command visible
- Output trimmed to meaningful lines
- No secrets, private customer data, or unnecessary full local paths

Recommended dimensions:

```text
1200 x 800
```

## Final Review

- [ ] File names use lowercase hyphenated style.
- [ ] Screenshot dimensions match target use.
- [ ] Text remains readable in GitHub preview size.
- [ ] DEMO labels are visible where applicable.
- [ ] No unsupported product claims are implied by the image.
- [ ] README placement has a clear reason.
- [ ] LinkedIn/social crops still show the main point.
- [ ] MSP/operator demo sequence can be followed without extra explanation.
