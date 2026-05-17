#!/usr/bin/env bash

set -euo pipefail

VERSION="$(cat VERSION)"
STAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
HOST="$(hostname)"
OS="$(uname -srm)"

cat <<META
{
  "version": "${VERSION}",
  "generated_utc": "${STAMP}",
  "host": "${HOST}",
  "platform": "${OS}"
}
META
