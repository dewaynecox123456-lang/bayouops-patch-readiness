#!/usr/bin/env bash

set -euo pipefail

OUTDIR="build/linux"
mkdir -p "$OUTDIR"

HOST="$(hostname)"
STAMP="$(date --iso-8601=seconds)"

OS="$(source /etc/os-release && echo "$PRETTY_NAME")"

KERNEL="$(uname -r)"

UPTIME="$(uptime -p)"

SELINUX="$(getenforce 2>/dev/null || echo Unknown)"

if systemctl is-active firewalld >/dev/null 2>&1; then
  FIREWALL="Active"
else
  FIREWALL="Inactive"
fi

FAILED_SERVICES="$(
  systemctl --failed --no-legend 2>/dev/null | wc -l
)"

if command -v rpm-ostree >/dev/null 2>&1; then

  OSTREE_STATUS="$(rpm-ostree status)"

  DEPLOYMENTS="$(
    echo "$OSTREE_STATUS" |
    grep '^●\|^ ' |
    wc -l
  )"

  if echo "$OSTREE_STATUS" | grep -q 'pending'; then
    PENDING_DEPLOYMENT="Yes"
  else
    PENDING_DEPLOYMENT="No"
  fi

else

  OSTREE_STATUS="Not Detected"

  DEPLOYMENTS="0"

  PENDING_DEPLOYMENT="Unknown"
fi

if [ -f /run/reboot-required ]; then
  REBOOT_REQUIRED="Yes"
else
  REBOOT_REQUIRED="No"
fi

ROOT_USAGE="$(
  df -h /var |
  awk 'NR==2 {print $5}'
)"

cat > "$OUTDIR/system-health.json" <<JSON
{
  "hostname": "$HOST",
  "timestamp": "$STAMP",
  "os": "$OS",
  "kernel": "$KERNEL",
  "uptime": "$UPTIME",
  "selinux": "$SELINUX",
  "firewall": "$FIREWALL",
  "failed_services": "$FAILED_SERVICES",
  "root_usage": "$ROOT_USAGE",
  "reboot_required": "$REBOOT_REQUIRED",
  "deployments": "$DEPLOYMENTS",
  "pending_deployment": "$PENDING_DEPLOYMENT"
}
JSON

echo
echo "[SUCCESS] Linux operational evidence collected."
echo
echo "$OUTDIR/system-health.json"
echo
