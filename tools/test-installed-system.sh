#!/bin/sh
set -eu

REPO_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
IMAGE_PATH=${TAICHIOS_IMAGE:-"$REPO_DIR/artifacts/live/taichios-0.1-amd64.hybrid.iso"}
BOOT_MODE=${1:-bios}
TEST_TIMEOUT=${TAICHIOS_INSTALL_TIMEOUT:-360}
TEST_TMP=$(mktemp -d -t taichios-install.XXXXXX)
DISK_PATH="$TEST_TMP/taichios.raw"
MONITOR_PATH="$TEST_TMP/monitor.sock"
LOG_PATH="$TEST_TMP/serial.log"
ACTIVE_QEMU_PID=

cleanup() {
  if test -n "$ACTIVE_QEMU_PID"; then
    kill -KILL "$ACTIVE_QEMU_PID" 2>/dev/null || true
    wait "$ACTIVE_QEMU_PID" 2>/dev/null || true
  fi
  rm -rf -- "$TEST_TMP"
}
trap cleanup EXIT HUP INT TERM

test -f "$IMAGE_PATH"
case "$BOOT_MODE" in bios|uefi) ;; *) echo "usage: $0 [bios|uefi]" >&2; exit 2;; esac
truncate -s 8G "$DISK_PATH"

FIRMWARE_ARGS=
if test "$BOOT_MODE" = uefi; then
  OVMF_CODE=${TAICHIOS_OVMF_CODE:-/usr/share/OVMF/OVMF_CODE_4M.fd}
  OVMF_VARS=${TAICHIOS_OVMF_VARS:-/usr/share/OVMF/OVMF_VARS_4M.fd}
  cp "$OVMF_VARS" "$TEST_TMP/OVMF_VARS.fd"
  FIRMWARE_ARGS="-drive if=pflash,format=raw,readonly=on,file=$OVMF_CODE -drive if=pflash,format=raw,file=$TEST_TMP/OVMF_VARS.fd"
fi

stop_qemu() {
  kill "$ACTIVE_QEMU_PID" 2>/dev/null || true
  sleep 1
  kill -KILL "$ACTIVE_QEMU_PID" 2>/dev/null || true
  wait "$ACTIVE_QEMU_PID" 2>/dev/null || true
  ACTIVE_QEMU_PID=
}

wait_for_marker() {
  MARKER=$1
  ELAPSED=0
  while kill -0 "$ACTIVE_QEMU_PID" 2>/dev/null; do
    if grep -Fq "$MARKER" "$LOG_PATH"; then return 0; fi
    if test "$ELAPSED" -ge "$TEST_TIMEOUT"; then
      cat "$LOG_PATH" >&2
      echo "missing $MARKER after ${TEST_TIMEOUT}s" >&2
      return 1
    fi
    sleep 1
    ELAPSED=$((ELAPSED + 1))
  done
  grep -Fq "$MARKER" "$LOG_PATH"
}

echo "Installing under $BOOT_MODE firmware..."
# shellcheck disable=SC2086
qemu-system-x86_64 -machine accel=tcg -m 2048 -smp 2 -no-reboot -display none -nic none \
  -serial file:"$LOG_PATH" -monitor unix:"$MONITOR_PATH",server=on,wait=off \
  -drive file="$DISK_PATH",format=raw,if=virtio -cdrom "$IMAGE_PATH" -boot order=d \
  $FIRMWARE_ARGS &
ACTIVE_QEMU_PID=$!
while ! test -S "$MONITOR_PATH"; do sleep 1; done
sleep 3
printf 'sendkey i\nsendkey ret\n' | nc -N -U "$MONITOR_PATH" > /dev/null
wait_for_marker TAICHIOS_INSTALL_COMPLETE
stop_qemu

: > "$LOG_PATH"
echo "Booting the installed $BOOT_MODE system without the live medium or network..."
# shellcheck disable=SC2086
qemu-system-x86_64 -machine accel=tcg -m 2048 -smp 2 -no-reboot -display none -nic none \
  -serial file:"$LOG_PATH" -monitor none -drive file="$DISK_PATH",format=raw,if=virtio \
  -boot order=c $FIRMWARE_ARGS &
ACTIVE_QEMU_PID=$!
wait_for_marker TAICHIOS_INSTALLED_LOGIN_READY
stop_qemu

: > "$LOG_PATH"
rm -f "$MONITOR_PATH"
echo "Booting the independent $BOOT_MODE recovery target..."
# shellcheck disable=SC2086
qemu-system-x86_64 -machine accel=tcg -m 2048 -smp 2 -no-reboot -display none -nic none \
  -serial file:"$LOG_PATH" -monitor unix:"$MONITOR_PATH",server=on,wait=off \
  -drive file="$DISK_PATH",format=raw,if=virtio -boot order=c $FIRMWARE_ARGS &
ACTIVE_QEMU_PID=$!
while ! test -S "$MONITOR_PATH"; do sleep 1; done
sleep 3
printf 'sendkey r\nsendkey ret\n' | nc -N -U "$MONITOR_PATH" > /dev/null
wait_for_marker TAICHIOS_RECOVERY_READY
stop_qemu
echo "$BOOT_MODE install and disk boot passed"
