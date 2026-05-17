#!/usr/bin/env bash

set -euo pipefail

echo "[INFO] Running BayouOps demo workflow..."

./scripts/archive-snapshot.sh samples/before-cycle.csv
./scripts/archive-snapshot.sh samples/after-cycle.csv

node tools/generate-html-report.mjs samples/mock-report.csv reports

node tools/generate-delta-dashboard.mjs \
  samples/before-cycle.csv \
  samples/after-cycle.csv \
  reports

./scripts/build-release.sh

echo
echo "[SUCCESS] Demo workflow complete."
echo
echo "Generated:"
echo "- archived snapshots"
echo "- readiness dashboard"
echo "- executive delta dashboard"
echo "- release ZIP"
