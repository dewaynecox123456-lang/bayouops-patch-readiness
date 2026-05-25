#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="${BAYOUOPS_CONFIG:-$PROJECT_ROOT/config/bayouops.env}"

if [ -f "$CONFIG_FILE" ]; then
  # Keep host/port overrides explicit; the default loopback bind avoids accidental report exposure.
  # shellcheck disable=SC1090
  source "$CONFIG_FILE"
fi

HOST="${BAYOUOPS_HOST:-127.0.0.1}"
PORT="${BAYOUOPS_PORT:-8088}"

cd "$PROJECT_ROOT"

python3 -m http.server "$PORT" --bind "$HOST"
