# BayouOps Operational Footprint Workflow

## Purpose

BayouOps is designed to help small IT teams understand the operational footprint of their systems before outages, maintenance events, or bridge calls become chaotic.

The goal is not to replace monitoring, RMM, SIEM, SCCM, or Intune.

The goal is operational coordination intelligence.

## Core Workflow

1. Import operational context from CSV.
2. Search for an asset by hostname, site, owner, platform, or environment.
3. View the operational footprint.
4. Review ownership, maintenance, escalation, validation, and notes.
5. Export operational worklists when teams need to split work.

## Operational Context Fields

Each asset may include:

- Hostname
- Site
- Floor
- Rack
- Environment
- Platform
- Infrastructure Owner
- Application Owner
- Validation Team
- Maintenance Window
- Escalation Contact
- PCI Scope
- Operational Notes

## Asset Lookup

Example:

```bash
node tools/query-assets.mjs SQL-PROD-01
