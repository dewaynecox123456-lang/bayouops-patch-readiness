# Screenshot Capture Workflow

This workflow describes how to capture a consistent BayouOps screenshot set for GitHub, demos, and social posts.

Use sanitized or DEMO data only.

## Screenshot Set

Capture four groups.

### 1. Executive Dashboard Screenshots

Purpose:
Show high-level readiness and risk posture.

Required captures:

- Healthy environment
- Medium-risk environment
- Critical-risk environment
- Executive operational view

Recommended filenames:

```text
bayouops-executive-dashboard-healthy.png
bayouops-executive-dashboard-medium-risk.png
bayouops-executive-dashboard-critical-risk.png
bayouops-executive-operational-view.png
```

Recommended dimensions:

```text
1440 x 900
```

### 2. Operational Analyst Screenshots

Purpose:
Show the practical operator workflow.

Required captures:

- NOC operational view
- Approval-required query
- Exposure findings table
- SSL status table
- Unsupported OS or stale infrastructure table

Recommended filenames:

```text
bayouops-analyst-noc-view.png
bayouops-analyst-approval-required.png
bayouops-analyst-exposure-findings.png
bayouops-analyst-ssl-status.png
bayouops-analyst-stale-infrastructure.png
```

Recommended dimensions:

```text
1280 x 900
```

### 3. Export and Report Screenshots

Purpose:
Show that BayouOps produces usable coordination artifacts.

Required captures:

- Owner worklist export
- Executive summary export
- Query CSV export
- HTML report view

Recommended filenames:

```text
bayouops-export-owner-worklist.png
bayouops-export-executive-summary.png
bayouops-export-query-csv.png
bayouops-report-html-summary.png
```

Recommended dimensions:

```text
1280 x 900
```

### 4. Readiness Scoring Screenshots

Purpose:
Show how individual system findings roll up into readiness posture.

Required captures:

- Readiness scoring overview
- Readiness table with Healthy, Review, Risk, and Critical rows
- Readiness detail showing findings or score drivers

Recommended filenames:

```text
bayouops-readiness-scoring-overview.png
bayouops-readiness-score-table.png
bayouops-readiness-score-drivers.png
```

Recommended dimensions:

```text
1440 x 900
```

## Capture Preparation

1. Confirm the working set uses DEMO or sanitized data.
2. Close unrelated browser tabs and terminal panes.
3. Set browser zoom to 100 percent.
4. Set the browser viewport to the target dimensions.
5. Use consistent light or dark mode based on the view category.
6. Make sure DEMO labels are visible when demo data is shown.
7. Remove or crop private workstation paths if they do not add context.

## Browser Capture Guidance

Use full-page capture only when the full page is short and readable.

Use viewport capture for:

- Executive dashboard cards
- Operational tables
- Export previews
- README/social images

Avoid captures where the important table columns are cut off.

If a table is too wide, capture the most important columns:

- Hostname
- Environment
- Severity or status
- Owner
- Approval required
- Recommended action

## Terminal Capture Guidance

Use a dark terminal for command examples.

Recommended terminal captures:

```bash
npm test
npm start
npm run serve
node tools/query-assets.mjs SQL-PROD-01
```

Keep terminal screenshots focused:

- Show the command
- Show the meaningful success output
- Hide unrelated shell history
- Avoid exposing full personal paths when possible

Recommended dimensions:

```text
1200 x 800
```

## GitHub README Placement

Use screenshots sparingly in the README.

Recommended placement:

1. Logo at the top.
2. Executive dashboard after the short product description.
3. Control menu or workflow screenshot after command examples.
4. Analyst/NOC view near operational narratives.
5. Export/worklist screenshot near demo or export explanation.
6. Readiness scoring screenshot near scoring explanation.

Avoid putting a large screenshot before the reader understands what the project is.

## LinkedIn and Social Workflow

Recommended single-image post:

- Use the executive dashboard or critical-risk scenario.
- Crop to `1200 x 627`.
- Keep DEMO label visible.
- Caption should explain the operational problem and safety boundary.

Recommended carousel:

1. Executive dashboard
2. Analyst findings view
3. Owner worklist export
4. Readiness scoring view
5. Safety boundary slide or caption

Recommended carousel dimensions:

```text
1080 x 1080
```

Do not present demo data as production deployment evidence.

## Final Review Checklist

Before adding screenshots to the repository:

- File is named with the agreed convention
- Image uses DEMO or sanitized data
- Dimensions match the intended use
- Text is readable without opening the image separately
- Visual theme is consistent with the screenshot category
- Terminal screenshots do not expose private paths, tokens, or customer data
- README placement supports the surrounding explanation
- Social captions do not imply automation or production claims BayouOps does not make
