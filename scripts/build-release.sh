#!/usr/bin/env bash

set -euo pipefail

PROJECT="BayouOps"
VERSION="v$(cat VERSION)"

STAMP="$(date +%Y%m%d_%H%M%S)"

ROOT="$(pwd)"

RELEASE_DIR="release/${PROJECT}_${VERSION}_${STAMP}"

echo "[INFO] Creating release structure..."

mkdir -p "${RELEASE_DIR}"

mkdir -p "${RELEASE_DIR}/docs"
mkdir -p "${RELEASE_DIR}/screenshots"
mkdir -p "${RELEASE_DIR}/samples"
mkdir -p "${RELEASE_DIR}/tools"
mkdir -p "${RELEASE_DIR}/reports"

echo "[INFO] Copying documentation..."

cp README.md "${RELEASE_DIR}/"
cp CHANGELOG.md "${RELEASE_DIR}/" 2>/dev/null || true

cp -r docs/* "${RELEASE_DIR}/docs/" 2>/dev/null || true

echo "[INFO] Copying screenshots..."

cp screenshots/*.png \
"${RELEASE_DIR}/screenshots/" 2>/dev/null || true

cp screenshots/*.pdf \
"${RELEASE_DIR}/screenshots/" 2>/dev/null || true

echo "[INFO] Copying samples..."

cp samples/*.csv \
"${RELEASE_DIR}/samples/" 2>/dev/null || true

echo "[INFO] Copying tools..."

cp tools/*.mjs \
"${RELEASE_DIR}/tools/" 2>/dev/null || true

echo "[INFO] Copying reports..."

cp reports/*.html \
"${RELEASE_DIR}/reports/" 2>/dev/null || true

echo "[INFO] Creating ZIP package..."

cd release

ZIP_NAME="${PROJECT}_${VERSION}_${STAMP}.zip"

zip -r "${ZIP_NAME}" \
"${PROJECT}_${VERSION}_${STAMP}" >/dev/null

cd "${ROOT}"

echo
echo "[SUCCESS] Release package created:"
echo
echo "release/${ZIP_NAME}"
echo
