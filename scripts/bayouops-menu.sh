#!/usr/bin/env bash

set -euo pipefail

cd /var/home/dewaynecox/BayouFinds/projects/bayouops-patch-readiness

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
  echo "[5] Exposure Check (placeholder)"
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
      echo
      echo "[INFO] Build release package placeholder..."
      read -rp "Press ENTER to continue..."
      ;;

    5)
      echo
      echo "[INFO] Exposure placeholder..."
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
