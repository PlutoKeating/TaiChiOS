#!/bin/sh
set -eu

REPO_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
IMAGE_PATH=${TAICHIOS_IMAGE:-"$REPO_DIR/artifacts/live/taichios-0.1-amd64.hybrid.iso"}
BOOT_MODE=${1:-all}
BOOT_TIMEOUT=${TAICHIOS_BOOT_TIMEOUT:-180}

test -f "$IMAGE_PATH" || {
  echo "missing image: $IMAGE_PATH" >&2
  exit 1
}

run_qemu() {
  MODE_NAME=$1
  shift
  LOG_PATH=$TEST_TMP/$MODE_NAME.log
  ELAPSED=0

  echo "Testing $MODE_NAME boot..."
  qemu-system-x86_64 \
    -machine accel=tcg \
    -m 1536 \
    -smp 2 \
    -no-reboot \
    -display none \
    -serial stdio \
    -cdrom "$IMAGE_PATH" \
    "$@" > "$LOG_PATH" 2>&1 &
  ACTIVE_QEMU_PID=$!

  while kill -0 "$ACTIVE_QEMU_PID" 2>/dev/null; do
    if grep -Fq TAICHIOS_BOOT_READY "$LOG_PATH"; then
      kill "$ACTIVE_QEMU_PID" 2>/dev/null || true
      sleep 1
      kill -KILL "$ACTIVE_QEMU_PID" 2>/dev/null || true
      wait "$ACTIVE_QEMU_PID" 2>/dev/null || true
      ACTIVE_QEMU_PID=
      echo "$MODE_NAME boot passed"
      return 0
    fi

    if test "$ELAPSED" -ge "$BOOT_TIMEOUT"; then
      kill "$ACTIVE_QEMU_PID" 2>/dev/null || true
      sleep 1
      kill -KILL "$ACTIVE_QEMU_PID" 2>/dev/null || true
      wait "$ACTIVE_QEMU_PID" 2>/dev/null || true
      ACTIVE_QEMU_PID=
      cat "$LOG_PATH" >&2
      echo "$MODE_NAME boot did not publish TAICHIOS_BOOT_READY within ${BOOT_TIMEOUT}s" >&2
      return 1
    fi

    sleep 1
    ELAPSED=$((ELAPSED + 1))
  done

  wait "$ACTIVE_QEMU_PID" 2>/dev/null || QEMU_STATUS=$?
  ACTIVE_QEMU_PID=
  cat "$LOG_PATH" >&2
  echo "$MODE_NAME qemu exited before the boot marker (status ${QEMU_STATUS:-0})" >&2
  return 1
}

TEST_TMP=$(mktemp -d -t taichios-qemu.XXXXXX)
ACTIVE_QEMU_PID=
cleanup() {
  if test -n "$ACTIVE_QEMU_PID"; then
    kill -KILL "$ACTIVE_QEMU_PID" 2>/dev/null || true
    wait "$ACTIVE_QEMU_PID" 2>/dev/null || true
  fi
  rm -rf -- "$TEST_TMP"
}
trap cleanup EXIT HUP INT TERM

case "$BOOT_MODE" in
  bios)
    run_qemu bios
    ;;
  uefi)
    OVMF_CODE=${TAICHIOS_OVMF_CODE:-/usr/share/OVMF/OVMF_CODE_4M.fd}
    OVMF_VARS=${TAICHIOS_OVMF_VARS:-/usr/share/OVMF/OVMF_VARS_4M.fd}
    test -f "$OVMF_CODE"
    test -f "$OVMF_VARS"
    cp "$OVMF_VARS" "$TEST_TMP/OVMF_VARS.fd"
    run_qemu uefi \
      -drive "if=pflash,format=raw,readonly=on,file=$OVMF_CODE" \
      -drive "if=pflash,format=raw,file=$TEST_TMP/OVMF_VARS.fd"
    ;;
  all)
    "$0" bios
    "$0" uefi
    ;;
  *)
    echo "usage: $0 [bios|uefi|all]" >&2
    exit 2
    ;;
esac
