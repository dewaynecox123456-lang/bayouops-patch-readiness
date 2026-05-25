# Executive Summary

BayouOps is a lightweight operational readiness tool for infrastructure teams. It organizes server inventory, ownership, maintenance windows, patch posture, SSL status, exposure findings, stale system indicators, and unsupported OS examples into local dashboards and exportable worklists.

## What Problem It Addresses

Infrastructure teams often enter maintenance events or outage calls without a clean view of:

- Who owns each system
- Which systems need approval before action
- Which systems are behind on patching
- Which certificates are near expiration
- Which systems are unsupported
- Which records are stale or poorly validated

BayouOps is designed to make that coordination context visible before work starts.

## Who It Helps

Sysadmins:
Quickly identify system owner, maintenance window, reboot approval needs, and readiness posture.

MSP operators:
Prepare repeatable customer review artifacts, worklists, and operational summaries without introducing a heavy platform.

IT managers:
Review risk themes, ownership gaps, and readiness posture without reading raw CSV exports.

Recruiters and technical reviewers:
Understand that the project demonstrates operational tooling, data normalization, local reporting, scripting, and safety-conscious design.

## What It Produces

BayouOps produces local files:

- Static HTML dashboards
- CSV exports and owner worklists
- JSON intermediate state
- Readiness summaries
- Demo scenarios for presentation and validation

Generated reports may contain operationally sensitive data and should be handled accordingly.

## Operational Narratives

Patch drift:
Shows where systems have fallen behind patch targets and whether reboot or owner approval is needed.

SSL expiration risk:
Shows services with certificates that are expired or approaching expiration so owners can schedule renewal before service impact.

Unsupported systems:
Shows systems running unsupported operating systems where patching alone is not enough and migration or isolation may be required.

Stale infrastructure:
Shows systems with stale check-ins, stale patch scans, or stale owner validation so teams can reduce inventory uncertainty.

## Safety Boundary

BayouOps does not patch systems, reboot systems, modify services, change registry values, enforce policy, or remediate findings.

It supports human decision-making and coordination. Operators remain responsible for validating findings and taking approved action through their normal operational processes.

## Current Architecture

The project is intentionally small:

- Node.js utilities
- Bash scripts
- One PowerShell readiness scanner
- CSV and JSON data files
- Static HTML dashboards
- Local-only serving by default on `127.0.0.1`

There is no database, background agent, cloud service, or large application framework.

## Demo Materials

Synthetic demo assets live under `demo/` and are clearly marked as `DEMO`.

The demo package includes healthy, medium-risk, and critical-risk executive scenarios. It also includes sample operational data for patch compliance, SSL status, exposure findings, readiness scoring, stale systems, and unsupported OS examples.

Use `docs/DEMO_WALKTHROUGH.md` for the presentation flow and `docs/SCREENSHOT_GUIDE.md` for screenshot placement.
