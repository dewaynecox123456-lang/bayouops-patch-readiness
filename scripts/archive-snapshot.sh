#!/usr/bin/env bash

set -euo pipefail

if [ $# -lt 1 ]; then
  echo
  echo "Usage:"
  echo
  echo "./scripts/archive-snapshot.sh <csv-file>"
  echo
  exit 1
fi

INPUT_FILE="$1"

if [ ! -f "$INPUT_FILE" ]; then
  echo
  echo "[ERROR] File not found:"
  echo "$INPUT_FILE"
  echo
  exit 1
fi

STAMP="$(date +%Y%m%d_%H%M%S)"

mkdir -p data/history

BASE_NAME="$(basename "$INPUT_FILE")"

OUTPUT_FILE="data/history/${STAMP}_${BASE_NAME}"

cp "$INPUT_FILE" "$OUTPUT_FILE"

echo
echo "[SUCCESS] Snapshot archived:"
echo
echo "$OUTPUT_FILE"
echo
