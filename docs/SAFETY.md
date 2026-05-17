# Safety Principles

BayouOps Patch Readiness follows a do-no-harm operational model.

## Core Rules

- Read-only by default
- No automatic patching
- No automatic rebooting
- No service modification
- No SQL failover automation
- No registry changes
- No remediation without explicit operator action

## Product Position

This tool provides operational visibility and decision support.

It does not control infrastructure.

## Warning Philosophy

BayouOps may flag risks such as:

- pending reboot
- stopped Windows Update service
- stopped BITS service
- missing metadata
- patch wave conflicts
- unsupported operating systems

Findings should be reviewed by qualified administrators before action is taken.

## Responsibility Boundary

Operators remain responsible for validating results and making production decisions.
