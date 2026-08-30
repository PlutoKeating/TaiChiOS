#!/bin/sh
set -eu

REPO_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
LOCK_PATH="$REPO_DIR/distribution/debian/snapshot.json"
EXPECTED_VERSION=$(node -e "const l=require(process.argv[1]); process.stdout.write(l.liveBuild.version)" "$LOCK_PATH")
DEB_URL=$(node -e "const l=require(process.argv[1]); process.stdout.write(l.liveBuild.debUrl)" "$LOCK_PATH")
DEB_SHA256=$(node -e "const l=require(process.argv[1]); process.stdout.write(l.liveBuild.debSha256)" "$LOCK_PATH")

if test "$(dpkg-query -W -f='${Version}' live-build 2>/dev/null || true)" = "$EXPECTED_VERSION"; then
  echo "live-build $EXPECTED_VERSION is already installed"
  exit 0
fi

DOWNLOAD_DIR=$(mktemp -d -t taichios-live-build.XXXXXX)
cleanup() {
  rm -rf -- "$DOWNLOAD_DIR"
}
trap cleanup EXIT HUP INT TERM

curl --fail --location --retry 5 --output "$DOWNLOAD_DIR/live-build.deb" "$DEB_URL"
printf '%s  %s\n' "$DEB_SHA256" "$DOWNLOAD_DIR/live-build.deb" | sha256sum --check --status
sudo dpkg --install "$DOWNLOAD_DIR/live-build.deb"

ACTUAL_VERSION=$(dpkg-query -W -f='${Version}' live-build)
test "$ACTUAL_VERSION" = "$EXPECTED_VERSION"
echo "installed live-build $ACTUAL_VERSION from the pinned Debian snapshot"
