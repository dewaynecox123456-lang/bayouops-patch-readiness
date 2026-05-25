# BayouOps

<p align="center">
  <img src="./screenshots/bayouops-logo.png"
       width="420"
       alt="BayouOps Logo">
</p>

<p align="center">
Operational Coordination Intelligence for Infrastructure Teams
</p>

---

# What Is BayouOps?

BayouOps is a lightweight operational coordination platform designed to help infrastructure teams understand the operational footprint of their systems before outages, maintenance events, and bridge calls become chaotic.

BayouOps focuses on:

- operational readiness
- operational ownership
- maintenance governance
- operational visibility
- escalation coordination
- operational memory
- field operational awareness

The platform is intentionally lightweight, local-first, and operationally practical.

---

# What BayouOps Is NOT

BayouOps is NOT:

- SCCM
- Intune
- BigFix
- an RMM
- a SIEM
- a vulnerability scanner
- endpoint control software
- intrusive monitoring software

BayouOps does NOT:
- deploy patches
- force reboots
- remediate endpoints
- manage endpoint policies
- replace enterprise management platforms

BayouOps exists to provide operational coordination intelligence.

---

# Core Workflow

1. Import operational context from CSV.
2. Search infrastructure assets.
3. View operational ownership and governance context.
4. Review maintenance windows and escalation paths.
5. Access operational procedures and runbook notes.
6. Export operational worklists for coordination.

---

# Operational Asset Lookup

BayouOps supports operational infrastructure lookup workflows.

Example:

```bash
node tools/query-assets.mjs SQL-PROD-01
