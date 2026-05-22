#!/usr/bin/env bash

set -euo pipefail

ROOT="/var/home/dewaynecox/BayouFinds/projects/bayouops-patch-readiness"
PIC="$HOME/Pictures"

cd "$ROOT"

mkdir -p screenshots

echo "[INFO] Organizing BayouOps screenshots..."

cp -n "$PIC/Pasted image (4).png" \
  screenshots/operational-query-approval-required.png 2>/dev/null || true

cp -n "$PIC/Pasted image (5).png" \
  screenshots/operational-query-csv-export.png 2>/dev/null || true

cp -n "$PIC/Pasted image (2).png" \
  screenshots/executive-operational-view.png 2>/dev/null || true

cp -n "$PIC/Pasted image (3).png" \
  screenshots/noc-operational-view.png 2>/dev/null || true

cat > screenshots/README.md <<'EOF2'
# BayouOps Screenshots

Current screenshot set:

- `operational-query-approval-required.png`
- `operational-query-csv-export.png`
- `executive-operational-view.png`
- `noc-operational-view.png`

These images support the BayouOps operational coordination and readiness intelligence story.
EOF2

echo
echo "[SUCCESS] Screenshots organized."
echo
ls -la screenshots
