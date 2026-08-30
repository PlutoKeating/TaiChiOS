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
mkdir -p "$TEST_ROOT/opt/taichios"
printf '%s:x:1000:1000::/home/%s:/bin/sh\n' "$(id -un)" "$(id -un)" > "$TEST_ROOT/etc/passwd"
printf '%s\n' before > "$TEST_ROOT/etc/taichios/example.conf"
printf '%s\n' after > "$TEST_ROOT/sources/example.conf"
printf '%s\n' deployment-v1 > "$TEST_ROOT/opt/taichios/deployment"
printf '%s\n' deployment-v2 > "$TEST_ROOT/sources/deployment"

DRY_RUN_OUTPUT=$(
  "$CHANGE_COMMAND" apply --root "$TEST_ROOT" --id dry-run \
    --source "$TEST_ROOT/sources/example.conf" --target /etc/taichios/example.conf \
    --dry-run --non-interactive
)
printf '%s\n' "$DRY_RUN_OUTPUT" | grep -q '^state=dry-run$'
grep -qx before "$TEST_ROOT/etc/taichios/example.conf"
test ! -e "$TEST_ROOT/var/lib/taichios/changes/dry-run"
grep -q 'action=apply .*mode=guarded outcome=allowed state=dry-run' "$TEST_ROOT/var/lib/taichios/changes/audit.log"

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

"$CHANGE_COMMAND" apply --root "$TEST_ROOT" --id system-update --kind system-update \
  --source "$TEST_ROOT/sources/deployment" --target /opt/taichios/deployment \
  --yes --non-interactive
grep -qx deployment-v2 "$TEST_ROOT/opt/taichios/deployment"
grep -qx system-update "$TEST_ROOT/var/lib/taichios/changes/system-update/kind"
"$CHANGE_COMMAND" rollback --root "$TEST_ROOT" --last
grep -qx deployment-v1 "$TEST_ROOT/opt/taichios/deployment"

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
grep -q "^executor=unix:$(id -un)$" "$TEST_ROOT/var/lib/taichios/changes/broken-rollback/audit"
grep -q 'action=rollback .*outcome=failed state=rollback-failed' "$TEST_ROOT/var/lib/taichios/changes/audit.log"

if "$CHANGE_COMMAND" apply --root "$TEST_ROOT" --id impersonation \
  --source "$TEST_ROOT/sources/example.conf" --target /etc/taichios/example.conf \
  --yes --as agent:other >/dev/null 2>&1; then
  echo 'an unprivileged caller selected another acting principal' >&2
  exit 1
fi

if "$CHANGE_COMMAND" apply --root "$TEST_ROOT" --id fake-plugin --kind plugin \
  --source "$TEST_ROOT/sources/example.conf" --target /etc/taichios/example.conf \
  --yes >/dev/null 2>&1; then
  echo 'an uninstalled plugin adapter was reported as available' >&2
  exit 1
fi

if "$CHANGE_COMMAND" apply --root "$TEST_ROOT" --id misplaced-update --kind system-update \
  --source "$TEST_ROOT/sources/example.conf" --target /etc/taichios/example.conf \
  --yes >/dev/null 2>&1; then
  echo 'a system update was accepted outside its deployment pointer' >&2
  exit 1
fi

if "$CHANGE_COMMAND" apply --root "$TEST_ROOT" --id root-impersonation \
  --source "$TEST_ROOT/sources/example.conf" --target /etc/taichios/example.conf \
  --yes --as unix:not-present >/dev/null 2>&1; then
  echo 'root selected an acting principal absent from the managed identity source' >&2
  exit 1
fi

UNREGISTERED_ROOT="$TEST_ROOT/unregistered-root"
mkdir -p "$UNREGISTERED_ROOT/etc/taichios" "$UNREGISTERED_ROOT/etc"
: > "$UNREGISTERED_ROOT/etc/passwd"
if "$CHANGE_COMMAND" apply --root "$UNREGISTERED_ROOT" --id absent-current-user \
  --source "$TEST_ROOT/sources/example.conf" --target /etc/taichios/example.conf \
  --yes --as "unix:$(id -un)" >/dev/null 2>&1; then
  echo 'an acting principal absent from the managed identity source was accepted' >&2
  exit 1
fi

echo 'TaiChiOS managed-file Change Set: PASS'
