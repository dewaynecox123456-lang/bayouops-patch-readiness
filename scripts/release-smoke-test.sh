#!/usr/bin/env bash

set -euo pipefail

echo "[INFO] Running BayouOps release smoke test..."

REQUIRED_FILES=(
  "README.md"
  "CHANGELOG.md"
  "VERSION"
  "package.json"
  "docs/PRODUCT_DIRECTION.md"
  "docs/UPDATE_MODEL.md"
  "docs/ROADMAP.md"
  "scripts/build-release.sh"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "[ERROR] Missing required file: $file"
    exit 1
  fi
done

echo "[INFO] Verifying demo showcase screenshots..."

REQUIRED_SCREENSHOTS=(
  "screenshots/demo-showcase/01-executive-overview.png"
  "screenshots/demo-showcase/02-critical-risk-view.png"
  "screenshots/demo-showcase/03-patch-compliance.png"
  "screenshots/demo-showcase/04-ssl-risk.png"
  "screenshots/demo-showcase/05-stale-and-unsupported.png"
)

for shot in "${REQUIRED_SCREENSHOTS[@]}"; do
  if [[ ! -f "$shot" ]]; then
    echo "[ERROR] Missing screenshot: $shot"
    exit 1
  fi
done

echo "[INFO] Building temporary release package..."

./scripts/build-release.sh >/tmp/bayouops-release-test.log

LATEST_ZIP="$(ls -t release/*.zip | head -n 1)"

if [[ ! -f "$LATEST_ZIP" ]]; then
  echo "[ERROR] Release ZIP not created."
  exit 1
fi

echo "[INFO] Validating release ZIP contents..."

if unzip -l "$LATEST_ZIP" | grep -E '(^|/)(reports|build|incoming|exports|archive)/' >/dev/null; then
  echo "[ERROR] Forbidden generated artifacts detected in release ZIP."
  exit 1
fi

echo "[INFO] Smoke test passed."
