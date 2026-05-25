# SQL-PROD-01 Operational Notes

## Operational Warnings
- Coordinate with Prod Control before reboot.
- Validate SQL services after maintenance.
- PCI-scoped production workload.
- Reboot sequence must be approved before maintenance begins.

## Maintenance Notes
Preferred maintenance window:
Sunday 1AM-3AM CST

## Validation Procedure
1. Confirm SQL services running.
2. Validate scheduling application connectivity.
3. Confirm backup jobs operational.
4. Confirm overnight batch jobs healthy.

## Escalation Guidance

Primary Escalation:
Michael Reynolds
Operations Manager
(555) 410-2291

Secondary Escalation:
DBA On-Call Team
(555) 410-3388

Contact escalation team if:
- SQL services fail after reboot
- Validation checks fail
- Scheduling platform unavailable
- Backup jobs remain offline

## Rollback Guidance
If validation fails:
- stop maintenance progression
- restore SQL service state
- notify Prod Control immediately
- open operational bridge call
