#!/usr/bin/env bash

set -euo pipefail

OUTDIR="build/platform"
mkdir -p "$OUTDIR"

OS_ID="unknown"
OS_NAME="unknown"
OS_VERSION="unknown"
PLATFORM_FAMILY="unknown"
PLATFORM_VARIANT="standard"

if [ -f /etc/os-release ]; then
  # shellcheck disable=SC1091
  source /etc/os-release

  OS_ID="${ID:-unknown}"
  OS_NAME="${PRETTY_NAME:-unknown}"
  OS_VERSION="${VERSION_ID:-unknown}"
fi

if command -v rpm-ostree >/dev/null 2>&1; then
  PLATFORM_FAMILY="fedora-atomic"
  PLATFORM_VARIANT="silverblue"
elif command -v dnf >/dev/null 2>&1; then
  PLATFORM_FAMILY="fedora-rhel"
elif command -v apt >/dev/null 2>&1; then
  PLATFORM_FAMILY="debian-ubuntu"
elif command -v powershell.exe >/dev/null 2>&1; then
  PLATFORM_FAMILY="windows"
else
  PLATFORM_FAMILY="generic-linux"
fi

cat > "$OUTDIR/platform.json" <<JSON
{
  "os_id": "$OS_ID",
  "os_name": "$OS_NAME",
  "os_version": "$OS_VERSION",
  "platform_family": "$PLATFORM_FAMILY",
  "platform_variant": "$PLATFORM_VARIANT"
}
JSON

echo
echo "[SUCCESS] Platform detection complete."
echo
echo "$OUTDIR/platform.json"
echo
