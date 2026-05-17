# Checks

## Windows Update Service

Purpose:
Detect systems where Windows Update infrastructure may be unavailable during maintenance windows.

Operational Impact:
Patch validation or deployment workflows may fail depending on environment configuration.

---

## BITS Service

Purpose:
Detect systems where Background Intelligent Transfer Service may impact patch delivery.

Operational Impact:
Patch downloads or servicing workflows may fail.

---

## Pending Reboot

Purpose:
Detect systems requiring reboot before or after maintenance operations.

Operational Impact:
Pending reboot states may interfere with servicing stack operations or maintenance validation.
