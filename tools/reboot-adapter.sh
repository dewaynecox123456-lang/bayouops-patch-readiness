#!/usr/bin/env bash

set -euo pipefail

PLATFORM_FILE="build/platform/platform.json"
OUTDIR="build/platform"
OUTFILE="$OUTDIR/reboot-state.json"

mkdir -p "$OUTDIR"

if [ ! -f "$PLATFORM_FILE" ]; then
  ./tools/platform-detect.sh
fi

PLATFORM_FAMILY="$(python3 - <<'PY'
import json
with open("build/platform/platform.json") as f:
    print(json.load(f).get("platform_family", "unknown"))
PY
)"

PLATFORM_VARIANT="$(python3 - <<'PY'
import json
with open("build/platform/platform.json") as f:
    print(json.load(f).get("platform_variant", "standard"))
PY
)"

REBOOT_PENDING="No"
METHOD="unknown"

case "$PLATFORM_FAMILY" in

  fedora-atomic)
    METHOD="rpm-ostree pending deployment"

    if rpm-ostree status 2>/dev/null | grep -qi "pending"; then
      REBOOT_PENDING="Yes"
    fi
    ;;

  fedora-rhel)
    METHOD="needs-restarting"

    if command -v needs-restarting >/dev/null 2>&1; then
      if needs-restarting -r >/dev/null 2>&1; then
        REBOOT_PENDING="No"
      else
        REBOOT_PENDING="Yes"
      fi
    else
      METHOD="needs-restarting unavailable"
      REBOOT_PENDING="Unknown"
    fi
    ;;

  debian-ubuntu)
    METHOD="/run/reboot-required"

    if [ -f /run/reboot-required ]; then
      REBOOT_PENDING="Yes"
    fi
    ;;

  windows)
    METHOD="windows registry/wmi placeholder"
    REBOOT_PENDING="Unknown"
    ;;

  *)
    METHOD="generic linux fallback"
    REBOOT_PENDING="Unknown"
    ;;
esac

cat > "$OUTFILE" <<JSON
{
  "platform_family": "$PLATFORM_FAMILY",
  "platform_variant": "$PLATFORM_VARIANT",
  "reboot_pending": "$REBOOT_PENDING",
  "detection_method": "$METHOD"
}
JSON

echo
echo "[SUCCESS] Reboot intelligence adapter complete."
echo
echo "$OUTFILE"
echo
