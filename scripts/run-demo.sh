#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

HOST="${BAYOUOPS_DEMO_HOST:-127.0.0.1}"
PORT="${BAYOUOPS_DEMO_PORT:-8088}"
DEMO_SITE="${PROJECT_ROOT}/demo/site"
LOG_FILE="${TMPDIR:-/tmp}/bayouops-demo-http.log"

cd "$PROJECT_ROOT"

echo
echo "======================================="
echo "      BAYOUOPS LOCAL DEMO LAUNCHER"
echo "======================================="
echo

if [ ! -d "$DEMO_SITE" ]; then
  echo "[ERROR] Missing demo site directory:"
  echo "$DEMO_SITE"
  echo
  echo "Expected:"
  echo "demo/site/index.html"
  exit 1
fi

if [ ! -f "$DEMO_SITE/index.html" ]; then
  echo "[ERROR] Missing demo site entrypoint:"
  echo "$DEMO_SITE/index.html"
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "[ERROR] python3 is required to launch the static demo server."
  exit 1
fi

echo "[INFO] Project root:"
echo "$PROJECT_ROOT"
echo
echo "[INFO] Demo site:"
echo "$DEMO_SITE"
echo
echo "[INFO] Bind address:"
echo "$HOST"
echo
echo "[INFO] Port:"
echo "$PORT"
echo

if [ "$HOST" = "127.0.0.1" ]; then
  echo "[INFO] LAN exposure: disabled by default"
else
  echo "[WARN] LAN exposure may be enabled because BAYOUOPS_DEMO_HOST is not 127.0.0.1"
fi

echo
echo "[INFO] Starting static demo server..."

if command -v ss >/dev/null 2>&1 && ss -tuln | grep -q ":$PORT "; then
  echo "[INFO] Port $PORT is already in use. Reusing existing listener."
else
  nohup python3 -m http.server "$PORT" --bind "$HOST" > "$LOG_FILE" 2>&1 &
  echo "[SUCCESS] Static demo server started."
  echo "[INFO] Log file: $LOG_FILE"
fi

echo
echo "Demo URLs:"
echo "  Showcase:  http://$HOST:$PORT/demo/site/"
echo "  Data:      http://$HOST:$PORT/demo/data/"
echo "  Exports:   http://$HOST:$PORT/demo/exports/"
echo "  Scenarios: http://$HOST:$PORT/demo/scenarios/"
echo
echo "Operator notes:"
echo "  - This serves static files only."
echo "  - No backend, Docker, or framework is required."
echo "  - Default bind is 127.0.0.1 to avoid exposing demo files to the LAN."
echo "  - Override port with: BAYOUOPS_DEMO_PORT=8090 ./scripts/run-demo.sh"
echo
