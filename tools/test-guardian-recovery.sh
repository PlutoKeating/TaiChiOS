#!/bin/sh
set -eu

REPO_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
GUARDIAN="$REPO_DIR/distribution/live/config/includes.chroot/usr/local/libexec/taichios-guardian"
GUARDIANCTL="$REPO_DIR/distribution/live/config/includes.chroot/usr/local/sbin/taichios-guardianctl"
RECOVERY="$REPO_DIR/distribution/live/config/includes.chroot/usr/local/sbin/taichios-recovery"
TEST_ROOT=$(mktemp -d -t taichios-guardian.XXXXXX)
SYSTEMCTL_LOG="$TEST_ROOT/systemctl.log"
RECOVERY_LOG="$TEST_ROOT/recovery.log"

cleanup() {
  rm -rf -- "$TEST_ROOT"
}
trap cleanup EXIT HUP INT TERM

mkdir -p "$TEST_ROOT/etc/taichios/guardian" "$TEST_ROOT/run/taichios/harness" \
  "$TEST_ROOT/usr/local/libexec" "$TEST_ROOT/home/taichi/.dsh/profiles/broken"
printf '%s\n' taichi crashed missing > "$TEST_ROOT/etc/taichios/guardian/accounts"
printf '%s\n' \
  'taichi:x:1000:1000::/home/taichi:/usr/local/bin/taichios-shell' \
  'crashed:x:1001:1001::/home/crashed:/usr/local/bin/taichios-shell' > "$TEST_ROOT/etc/passwd"
printf '%s\n' stale > "$TEST_ROOT/run/taichios/harness/taichi.heartbeat"
printf '%s\n' ready > "$TEST_ROOT/run/taichios/harness/crashed.ready"
printf '%s\n' ready > "$TEST_ROOT/run/taichios/harness/missing.ready"
touch -d '2 minutes ago' "$TEST_ROOT/run/taichios/harness/taichi.heartbeat"

FAKE_SYSTEMCTL="$TEST_ROOT/fake-systemctl"
cat > "$FAKE_SYSTEMCTL" <<EOF
#!/bin/sh
printf '%s\n' "\$*" >> "$SYSTEMCTL_LOG"
case "\$*" in
  'is-failed --quiet getty@tty1.service') exit 1 ;;
  'is-active --quiet getty@tty1.service') exit 1 ;;
  'is-failed --quiet taichios-harness@taichi.service'|'is-failed --quiet taichios-harness@crashed.service'|'is-failed --quiet taichios-harness@missing.service') exit 1 ;;
  'is-active --quiet taichios-harness@taichi.service'|'is-active --quiet taichios-harness@missing.service') exit 0 ;;
  'is-active --quiet taichios-harness@crashed.service') exit 1 ;;
esac
exit 0
EOF
chmod +x "$FAKE_SYSTEMCTL"

FAKE_RECOVERY="$TEST_ROOT/fake-recovery"
cat > "$FAKE_RECOVERY" <<EOF
#!/bin/sh
printf '%s\n' "\$*" >> "$RECOVERY_LOG"
EOF
chmod +x "$FAKE_RECOVERY"

"$GUARDIANCTL" --root "$TEST_ROOT" restart-harness taichi
"$GUARDIANCTL" --root "$TEST_ROOT" safe-profile taichi broken
"$GUARDIANCTL" --root "$TEST_ROOT" enter-recovery
"$GUARDIAN" --once --root "$TEST_ROOT" --systemctl "$FAKE_SYSTEMCTL" --recovery-command "$FAKE_RECOVERY"

grep -q '^restart taichios-harness@taichi.service$' "$SYSTEMCTL_LOG"
grep -q '^restart taichios-harness@crashed.service$' "$SYSTEMCTL_LOG"
grep -q '^restart taichios-harness@missing.service$' "$SYSTEMCTL_LOG"
grep -q '^restart getty@tty1.service$' "$SYSTEMCTL_LOG"
grep -q '^isolate taichios-recovery.target$' "$SYSTEMCTL_LOG"
grep -q '^disable-profile --root .* taichi broken$' "$RECOVERY_LOG"
grep -q 'kind=harness-heartbeat-stale account=taichi' "$TEST_ROOT/var/lib/taichios/guardian/incidents"
grep -q 'kind=harness-inactive account=crashed' "$TEST_ROOT/var/lib/taichios/guardian/incidents"
grep -q 'kind=harness-heartbeat-missing account=missing' "$TEST_ROOT/var/lib/taichios/guardian/incidents"
grep -q 'kind=interface-inactive unit=getty@tty1.service' "$TEST_ROOT/var/lib/taichios/guardian/incidents"

"$RECOVERY" disable-profile --root "$TEST_ROOT" taichi broken
test -d "$TEST_ROOT/home/taichi/.dsh/profiles/broken.disabled"
test -f "$TEST_ROOT/var/lib/taichios/guardian/safe-profiles/taichi"
"$RECOVERY" leave-safe-profile --root "$TEST_ROOT" taichi
test ! -e "$TEST_ROOT/var/lib/taichios/guardian/safe-profiles/taichi"

printf '%s\n' trusted > "$TEST_ROOT/usr/local/libexec/trusted-recovery-tool"
(
  cd "$TEST_ROOT"
  sha256sum usr/local/libexec/trusted-recovery-tool > usr/share.taichios-recovery.sha256
)
mkdir -p "$TEST_ROOT/usr/share/taichios/recovery"
mv "$TEST_ROOT/usr/share.taichios-recovery.sha256" "$TEST_ROOT/usr/share/taichios/recovery/trusted-files.sha256"
"$RECOVERY" verify --root "$TEST_ROOT"
printf '%s\n' tampered > "$TEST_ROOT/usr/local/libexec/trusted-recovery-tool"
if "$RECOVERY" verify --root "$TEST_ROOT" >/dev/null 2>&1; then
  echo 'Recovery verification accepted a modified trusted file' >&2
  exit 1
fi

echo 'TaiChiOS Guardian and Recovery controls: PASS'
