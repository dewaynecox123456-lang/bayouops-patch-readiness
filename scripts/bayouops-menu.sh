#!/usr/bin/env bash

set -euo pipefail

clear

while true; do

  echo
  echo "======================================="
  echo "        BAYOUOPS CONTROL MENU"
  echo "======================================="
  echo
  echo "[1] Run Demo Workflow"
  echo "[2] Generate Trend Data"
  echo "[3] Generate Trend Dashboard"
  echo "[4] Build Release Package"
  echo "[5] Exposure Check (placeholder)"
  echo
  echo "[Q] Quit"
  echo

  read -rp "Select Option: " choice

  case "$choice" in

    1)
      echo
      echo "[INFO] Running demo workflow..."
      ./scripts/run-demo.sh
      ;;

    2)
      echo
      echo "[INFO] Generating trend data..."
      node tools/generate-trend-data.mjs
      ;;

    3)
      echo
      echo "[INFO] Generating trend dashboard..."
      node tools/generate-trend-dashboard.mjs
      ;;

    4)
      echo
      echo "[INFO] Building release package..."
      ./scripts/run-demo.sh
      ;;

    5)
      echo
      echo "[INFO] Running exposure visibility..."
      node tools/exposure-check.mjs
      ;;

    q|Q)
      echo
      echo "[INFO] Exiting BayouOps."
      echo
      exit 0
      ;;

    *)
      echo
      echo "[WARN] Invalid option."
      ;;

  esac

  echo
  read -rp "Press ENTER to continue..."

  clear

done
