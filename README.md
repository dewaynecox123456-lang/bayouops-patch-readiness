# BayouOps Patch Readiness

BayouOps Patch Readiness is a lightweight, read-only operational visibility tool for Windows patch maintenance windows.

It is designed to help administrators quickly identify common readiness issues before, during, or after scheduled patch work.

## Core Philosophy

**Visibility, not control.**

This tool does not patch systems, reboot machines, modify services, or perform remediation.

It reports operational indicators so administrators can make informed decisions.

## Current MVP Checks

- Windows Update service status
- BITS service status
- pending reboot indicators
- OS name, version, and build
- uptime
- CSV report output

## Example Output

See:

```text
samples/mock-report.csv
