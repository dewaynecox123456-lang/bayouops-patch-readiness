# .gitignore Review Recommendations

BayouOps should keep generated operational data out of version control by default.

Recommended ignore coverage:

- `build/` for normalized inventory, health evidence, and generated intermediate JSON.
- `reports/` for HTML dashboards that may contain hostnames, owners, and operational posture.
- `exports/` for query worklists and coordination CSVs.
- `archive/` for historical snapshots and generated release staging.
- `incoming/` for customer or operator-provided inventory drops.
- `config/bayouops.env` for local bind settings and operator-specific runtime overrides.
- `node_modules/` if dependencies are added later.

Tracked examples should remain sanitized and intentionally named, such as files under `samples/`, `templates/`, and curated screenshots under `screenshots/`.
