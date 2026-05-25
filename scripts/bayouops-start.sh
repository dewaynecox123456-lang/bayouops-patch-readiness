#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="${BAYOUOPS_CONFIG:-$PROJECT_ROOT/config/bayouops.env}"

if [ -f "$CONFIG_FILE" ]; then
  # Operators can keep local bind settings outside source control for safer site-specific defaults.
  # shellcheck disable=SC1090
  source "$CONFIG_FILE"
fi

HOST="${BAYOUOPS_HOST:-127.0.0.1}"
PORT="${BAYOUOPS_PORT:-8088}"

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
  # Bind to loopback so generated operational reports are not exposed on the LAN by default.
  nohup python3 -m http.server "$PORT" --bind "$HOST" > /tmp/bayouops-http.log 2>&1 &
  echo "[SUCCESS] Web server started."
fi

echo
echo "[INFO] Latest dashboards:"
echo

EXEC="$(ls -t reports/bayouops_executive_view_*.html 2>/dev/null | head -n 1 || true)"
NOC="$(ls -t reports/bayouops_noc_triage_*.html 2>/dev/null | head -n 1 || true)"
EXPOSURE="$(ls -t reports/bayouops_exposure_dashboard_*.html 2>/dev/null | head -n 1 || true)"

echo "Executive: http://$HOST:$PORT/$EXEC"
echo "NOC:       http://$HOST:$PORT/$NOC"
echo "Exposure:  http://$HOST:$PORT/$EXPOSURE"

echo
echo "[SUCCESS] BayouOps startup complete."
echo
