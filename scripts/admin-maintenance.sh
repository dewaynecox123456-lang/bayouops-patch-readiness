#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
STAMP="$(date +%Y%m%d_%H%M%S)"

# Derive ROOT from this script location to keep maintenance behavior consistent across clones.
cd "$ROOT"

echo
echo "======================================="
echo "      BAYOUOPS SAFE CLEANUP"
echo "======================================="
echo

mkdir -p \
  archive/reports/"$STAMP" \
  archive/build/"$STAMP" \
  docs \
  exports \
  build/platform \
  build/linux \
  build/inventory \
  data/ownership \
  data/exposure \
  data/rules

echo "[INFO] Archiving generated reports..."
if compgen -G "reports/*.html" > /dev/null; then
  mv reports/*.html archive/reports/"$STAMP"/
fi

echo "[INFO] Archiving generated build outputs..."
if [ -d build ]; then
  cp -a build/. archive/build/"$STAMP"/ 2>/dev/null || true
fi

echo "[INFO] Recreating clean output folders..."
mkdir -p reports build/platform build/linux build/inventory exports

cat > docs/ARCHITECTURE.md <<'DOC'
# BayouOps Architecture

BayouOps is focused on Operational Readiness Intelligence.

Core flow:

Platform Detection
→ Evidence Adapters
→ Normalized Operational State
→ Operational Findings
→ Operational Context
→ Query / Export Layer
→ Role-Based Dashboards

BayouOps is not an RMM, SIEM, Intune, SCCM, or endpoint management replacement.

Primary value:
- operational ownership
- reboot coordination
- field visibility
- maintenance governance
- operational footprint intelligence
- small IT team readiness
DOC

cat > docs/NEXT_STEPS.md <<'DOC'
# BayouOps Next Steps

1. Clean report language around operational intelligence.
2. Make dashboards ownership-aware.
3. Add CSV export by owner/site/approval-required.
4. Add operational readiness score.
5. Add infrastructure detail view.
6. Keep scope focused: operational coordination, not endpoint management.
DOC

echo "[INFO] Checking git status..."
git status --short

echo
echo "[SUCCESS] Cleanup complete."
echo "Archived old reports under: archive/reports/$STAMP"
echo
