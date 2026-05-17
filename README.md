# BayouOps Patch Readiness

BayouOps Patch Readiness is a lightweight operational visibility tool for Windows maintenance windows.

It helps identify common patch-readiness issues before or after a change window.

## Current Checks

- Windows Update service status
- BITS service status
- pending reboot indicators
- OS name/version/build
- uptime
- CSV report output

## Philosophy

This tool is read-only.

It does not patch, reboot, modify services, or remediate systems automatically.

It provides operational visibility so administrators can make informed decisions.

## Status

Early MVP.
