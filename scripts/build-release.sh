#!/usr/bin/env bash

set -euo pipefail

PROJECT="BayouOps"
VERSION="v$(cat VERSION)"
STAMP="$(date +%Y%m%d_%H%M%S)"
ROOT="$(pwd)"
RELEASE_BASE="release"
RELEASE_NAME="${PROJECT}_${VERSION}_${STAMP}"
RELEASE_DIR="${RELEASE_BASE}/${RELEASE_NAME}"

echo "[INFO] Creating release structure..."

rm -rf "${RELEASE_DIR}"
mkdir -p "${RELEASE_DIR}"

mkdir -p "${RELEASE_DIR}/docs"
mkdir -p "${RELEASE_DIR}/screenshots"
mkdir -p "${RELEASE_DIR}/samples"
mkdir -p "${RELEASE_DIR}/scripts"
mkdir -p "${RELEASE_DIR}/tools"
mkdir -p "${RELEASE_DIR}/templates"
mkdir -p "${RELEASE_DIR}/config"

echo "[INFO] Copying core project files..."

cp README.md "${RELEASE_DIR}/"
cp VERSION "${RELEASE_DIR}/"
cp package.json "${RELEASE_DIR}/"
cp CHANGELOG.md "${RELEASE_DIR}/" 2>/dev/null || true

echo "[INFO] Copying documentation..."

cp -r docs/. "${RELEASE_DIR}/docs/" 2>/dev/null || true

echo "[INFO] Copying screenshots recursively..."

cp -r screenshots/. "${RELEASE_DIR}/screenshots/" 2>/dev/null || true
rm -rf "${RELEASE_DIR}/screenshots/archive"

echo "[INFO] Copying samples and templates..."

cp -r samples/. "${RELEASE_DIR}/samples/" 2>/dev/null || true
cp -r templates/. "${RELEASE_DIR}/templates/" 2>/dev/null || true
cp config/bayouops.env.example "${RELEASE_DIR}/config/" 2>/dev/null || true

echo "[INFO] Copying runtime scripts and tools..."

cp -r scripts/. "${RELEASE_DIR}/scripts/" 2>/dev/null || true
cp -r tools/. "${RELEASE_DIR}/tools/" 2>/dev/null || true

echo "[INFO] Excluding generated/local artifacts from standard release..."
echo "       Excluded: build/, reports/, exports/, archive/, incoming/, release/, config/bayouops.env"

echo "[INFO] Creating ZIP package..."

mkdir -p "${RELEASE_BASE}"

cd "${RELEASE_BASE}"

ZIP_NAME="${RELEASE_NAME}.zip"

rm -f "${ZIP_NAME}"
zip -r "${ZIP_NAME}" "${RELEASE_NAME}" >/dev/null

cd "${ROOT}"

echo
echo "[SUCCESS] Release package created:"
echo
echo "${RELEASE_BASE}/${ZIP_NAME}"
echo
