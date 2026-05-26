#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Resolve the project root dynamically so local operator clones do not depend on one workstation path.
cd "$PROJECT_ROOT"

while true; do
  clear
  echo "======================================="
  echo "          BAYOUOPS CONTROL MENU"
  echo "======================================="
  echo
  echo "[1] Run Full Operational Cycle"
  echo "[2] Generate Trend Data"
  echo "[3] Generate Trend Dashboard"
  echo "[4] Build Release Package"
  echo "[5] Run Exposure Check"
  echo
  echo "[7] Import Operational Context CSV"
  echo "[8] Asset Lookup"
  echo "[Q] Quit"
  echo
  read -rp "Select Option: " choice

  case "$choice" in
    1)
      node tools/run-operational-cycle.mjs
      read -rp "Press ENTER to continue..."
      ;;

    2)
      node tools/generate-trend-data.mjs
      read -rp "Press ENTER to continue..."
      ;;

    3)
      node tools/generate-trend-dashboard.mjs
      read -rp "Press ENTER to continue..."
      ;;

    4)
      ./scripts/build-release.sh
      read -rp "Press ENTER to continue..."
      ;;

    5)
      if [[ -f "tools/exposure-check.mjs" ]]; then
        node tools/exposure-check.mjs
      else
        echo
        echo "[WARN] Exposure check tool not found."
      fi
      read -rp "Press ENTER to continue..."
      ;;

    7)
      echo
      read -rp "CSV path: " CSV_PATH
      node tools/import-operational-context.mjs "$CSV_PATH"
      read -rp "Press ENTER to continue..."
      ;;

    8)
      echo
      read -rp "Search asset: " ASSET_QUERY
      node tools/query-assets.mjs "$ASSET_QUERY"
      read -rp "Press ENTER to continue..."
      ;;

    q|Q)
      exit 0
      ;;

    *)
      echo
      echo "[WARN] Invalid option."
      read -rp "Press ENTER to continue..."
      ;;
  esac
done
