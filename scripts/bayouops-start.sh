#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="/var/home/dewaynecox/BayouFinds/projects/bayouops-patch-readiness"
PORT="8088"

cd "$PROJECT_ROOT"

echo
echo "======================================="
echo "        BAYOUOPS STARTUP"
echo "======================================="
echo

echo "[INFO] Project root:"
echo "$PROJECT_ROOT"
echo

echo "[INFO] Running operational cycle..."
node tools/run-operational-cycle.mjs

echo
echo "[INFO] Starting local web server on port $PORT if not already running..."

if ss -tuln | grep -q ":$PORT "; then
  echo "[INFO] Web server already running on port $PORT."
else
  nohup python3 -m http.server "$PORT" > /tmp/bayouops-http.log 2>&1 &
  echo "[SUCCESS] Web server started."
fi

echo
echo "[INFO] Latest dashboards:"
echo

EXEC="$(ls -t reports/bayouops_executive_view_*.html 2>/dev/null | head -n 1 || true)"
NOC="$(ls -t reports/bayouops_noc_triage_*.html 2>/dev/null | head -n 1 || true)"
EXPOSURE="$(ls -t reports/bayouops_exposure_dashboard_*.html 2>/dev/null | head -n 1 || true)"

echo "Executive: http://0.0.0.0:$PORT/$EXEC"
echo "NOC:       http://0.0.0.0:$PORT/$NOC"
echo "Exposure:  http://0.0.0.0:$PORT/$EXPOSURE"

echo
echo "[SUCCESS] BayouOps startup complete."
echo
