#!/bin/sh
set -eu

REPO_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
CHANGE_COMMAND="$REPO_DIR/distribution/live/config/includes.chroot/usr/local/sbin/taichios-change"
TEST_ROOT=$(mktemp -d -t taichios-change.XXXXXX)

cleanup() {
  rm -rf -- "$TEST_ROOT"
}
trap cleanup EXIT HUP INT TERM

mkdir -p "$TEST_ROOT/etc/taichios" "$TEST_ROOT/sources"
printf '%s\n' before > "$TEST_ROOT/etc/taichios/example.conf"
printf '%s\n' after > "$TEST_ROOT/sources/example.conf"

DRY_RUN_OUTPUT=$(
  "$CHANGE_COMMAND" apply --root "$TEST_ROOT" --id dry-run \
    --source "$TEST_ROOT/sources/example.conf" --target /etc/taichios/example.conf \
    --dry-run --non-interactive
)
printf '%s\n' "$DRY_RUN_OUTPUT" | grep -q '^state=dry-run$'
grep -qx before "$TEST_ROOT/etc/taichios/example.conf"
test ! -e "$TEST_ROOT/var/lib/taichios/changes/dry-run"

if "$CHANGE_COMMAND" apply --root "$TEST_ROOT" --id unconfirmed \
  --source "$TEST_ROOT/sources/example.conf" --target /etc/taichios/example.conf \
  --non-interactive >/dev/null 2>&1; then
  echo 'non-interactive apply succeeded without --yes or --yolo' >&2
  exit 1
fi

"$CHANGE_COMMAND" apply --root "$TEST_ROOT" --id replace-file \
  --source "$TEST_ROOT/sources/example.conf" --target /etc/taichios/example.conf \
  --yes --non-interactive
grep -qx after "$TEST_ROOT/etc/taichios/example.conf"
test "$("$CHANGE_COMMAND" status --root "$TEST_ROOT" replace-file)" = committed
for state in proposed resolved authorized staged activated verified committed; do
  grep -q "state=$state" "$TEST_ROOT/var/lib/taichios/changes/replace-file/history"
done

"$CHANGE_COMMAND" rollback --root "$TEST_ROOT" replace-file
grep -qx before "$TEST_ROOT/etc/taichios/example.conf"
test "$("$CHANGE_COMMAND" status --root "$TEST_ROOT" replace-file)" = rolled-back

"$CHANGE_COMMAND" apply --root "$TEST_ROOT" --id broken-rollback \
  --source "$TEST_ROOT/sources/example.conf" --target /etc/taichios/example.conf \
  --yolo --non-interactive
rm -f -- "$TEST_ROOT/var/lib/taichios/changes/broken-rollback/before"
if "$CHANGE_COMMAND" rollback --root "$TEST_ROOT" broken-rollback >/dev/null 2>&1; then
  echo 'rollback succeeded without its required Rollback Point' >&2
  exit 1
fi
test "$("$CHANGE_COMMAND" status --root "$TEST_ROOT" broken-rollback)" = rollback-failed
grep -q '^mode=yolo$' "$TEST_ROOT/var/lib/taichios/changes/broken-rollback/audit"

if "$CHANGE_COMMAND" apply --root "$TEST_ROOT" --id impersonation \
  --source "$TEST_ROOT/sources/example.conf" --target /etc/taichios/example.conf \
  --yes --as agent:other >/dev/null 2>&1; then
  echo 'an unprivileged caller selected another acting principal' >&2
  exit 1
fi

echo 'TaiChiOS managed-file Change Set: PASS'
