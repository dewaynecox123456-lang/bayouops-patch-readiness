#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT"

PROJECT="BayouOps_DEMO"
VERSION="v$(cat VERSION)"
STAMP="$(date +%Y%m%d_%H%M%S)"

RELEASE_ROOT="release"
RELEASE_NAME="${PROJECT}_${VERSION}_${STAMP}"
RELEASE_DIR="${RELEASE_ROOT}/${RELEASE_NAME}"
ZIP_NAME="${RELEASE_NAME}.zip"

echo "[INFO] Creating demo release structure..."

mkdir -p \
  "${RELEASE_DIR}/docs" \
  "${RELEASE_DIR}/scripts" \
  "${RELEASE_DIR}/tools" \
  "${RELEASE_DIR}/samples" \
  "${RELEASE_DIR}/screenshots" \
  "${RELEASE_DIR}/demo"

echo "[INFO] Copying project metadata..."

cp README.md "${RELEASE_DIR}/"
cp VERSION "${RELEASE_DIR}/"
cp package.json "${RELEASE_DIR}/" 2>/dev/null || true
cp CHANGELOG.md "${RELEASE_DIR}/" 2>/dev/null || true

echo "[INFO] Copying documentation..."

cp -r docs/. "${RELEASE_DIR}/docs/" 2>/dev/null || true

echo "[INFO] Copying operator scripts and tools..."

cp scripts/*.sh "${RELEASE_DIR}/scripts/" 2>/dev/null || true
cp scripts/*.ps1 "${RELEASE_DIR}/scripts/" 2>/dev/null || true
cp tools/*.mjs "${RELEASE_DIR}/tools/" 2>/dev/null || true
cp tools/*.sh "${RELEASE_DIR}/tools/" 2>/dev/null || true

echo "[INFO] Copying sanitized samples..."

cp samples/*.csv "${RELEASE_DIR}/samples/" 2>/dev/null || true

echo "[INFO] Copying curated screenshots..."

cp screenshots/*.png "${RELEASE_DIR}/screenshots/" 2>/dev/null || true
cp screenshots/*.pdf "${RELEASE_DIR}/screenshots/" 2>/dev/null || true
cp screenshots/README.md "${RELEASE_DIR}/screenshots/" 2>/dev/null || true

echo "[INFO] Copying DEMO assets..."

cp -r demo/. "${RELEASE_DIR}/demo/"

echo "[INFO] Creating ZIP package..."

(
  cd "$RELEASE_ROOT"
  zip -r "$ZIP_NAME" "$RELEASE_NAME" >/dev/null
)

echo
echo "[SUCCESS] Demo release package created:"
echo
echo "${RELEASE_ROOT}/${ZIP_NAME}"
echo
echo "[INFO] Review package contents before sharing:"
echo "zipinfo ${RELEASE_ROOT}/${ZIP_NAME}"
echo
