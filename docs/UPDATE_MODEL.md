# BayouOps Update Model

## Overview

BayouOps currently uses a manual-download update model.

The platform is intentionally designed as:

- local-first
- operator-controlled
- low-dependency
- safety-oriented

BayouOps does NOT currently perform automatic in-place updates.

This is intentional.

---

# Current Update Strategy

Operators manually download new releases from:

- GitHub Releases
- BayouFinds distribution channels
- approved release ZIP packages

Release metadata may be published through:

- releases/latest.json
- CHANGELOG.md
- GitHub release notes

---

# Why Manual Updates

Manual updates reduce operational risk by avoiding:

- unexpected runtime changes
- forced maintenance interruptions
- partial update corruption
- uncontrolled environment drift
- silent background modifications

This model is better aligned with:

- regulated environments
- maintenance-window workflows
- operator review processes
- offline/local-first deployments

---

# Planned Update Capabilities

## Phase 1
- version manifest
- update notifications
- release notes links
- manual download prompts

## Phase 2
- checksum verification
- release validation
- rollback guidance
- release-channel awareness

## Phase 3
- optional assisted updates
- signed package verification
- controlled in-place upgrade tooling

Automatic remediation or forced updates are NOT planned.

---

# Safety Principles

BayouOps favors:

- operator visibility
- explainable changes
- predictable release behavior
- human-controlled maintenance

The platform should never silently modify operational environments.

---

# Release Channels

## EarlyAccess
Rapid iteration and feature validation.

## Stable
Operationally validated releases intended for broader usage.

---

# Related Files

- VERSION
- CHANGELOG.md
- releases/latest.json
- scripts/build-release.sh

