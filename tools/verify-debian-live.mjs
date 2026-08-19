#!/usr/bin/env node

import assert from 'node:assert/strict'
import { accessSync, constants, existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = path => readFileSync(resolve(workspace, path), 'utf8')
const lock = JSON.parse(read('distribution/debian/snapshot.json'))
const config = read('distribution/live/auto/config')
const packages = read('distribution/live/config/package-lists/taichios.list.chroot')
const bootTest = read('tools/test-live-boot.sh')
const installTest = read('tools/test-installed-system.sh')

assert.equal(lock.schemaVersion, 1)
assert.equal(lock.distribution, 'Debian GNU/Linux')
assert.equal(lock.architecture, 'amd64')
assert.deepEqual(lock.components, ['main'])
assert.match(lock.snapshot.timestamp, /^\d{8}T\d{6}Z$/)
assert.match(lock.snapshot.releaseSha256, /^[a-f0-9]{64}$/)
assert.match(lock.liveBuild.debSha256, /^[a-f0-9]{64}$/)
assert.ok(lock.snapshot.archiveUrl.endsWith(`/${lock.snapshot.timestamp}/`))
assert.ok(lock.liveBuild.debUrl.startsWith(lock.snapshot.archiveUrl))

for (const value of [lock.suite, lock.architecture, lock.snapshot.archiveUrl, lock.liveBuild.version]) {
  assert.ok(config.includes(value), `live-build config must contain pin: ${value}`)
}
assert.ok(config.includes('SOURCE_DATE_EPOCH=1787097600'), 'live-build must use the snapshot timestamp as its build epoch')
assert.match(read('distribution/live/config/rootfs/excludes'), /^var\/cache\/apt\/pkgcache\.bin$/m)
assert.match(read('distribution/live/config/rootfs/excludes'), /^var\/cache\/apt\/srcpkgcache\.bin$/m)
for (const option of ['--binary-images iso-hybrid', '--bootloaders "grub-pc grub-efi"', '--apt-secure true', '--firmware-chroot false', '--firmware-binary false']) {
  assert.ok(config.includes(option), `live-build config must contain: ${option}`)
}
for (const requiredPackage of ['linux-image-amd64', 'live-boot', 'systemd-sysv', 'parted', 'grub-pc-bin', 'grub-efi-amd64-bin', 'squashfs-tools']) {
  assert.match(packages, new RegExp(`^${requiredPackage}$`, 'm'))
}
assert.match(bootTest, /TAICHIOS_BOOT_READY/)
assert.match(bootTest, /OVMF_CODE/)
assert.equal(installTest.match(/-nic none/g)?.length, 3, 'every install acceptance boot must disable networking')
assert.match(read('distribution/live/config/includes.chroot/etc/grub.d/41_taichios_recovery'), /TaiChiOS Recovery/)
const installer = read('distribution/live/config/includes.chroot/usr/local/sbin/taichios-install')
assert.match(installer, /refusing destructive install without --yes/)
assert.match(installer, /grub-install --target=i386-pc/)
assert.match(installer, /grub-install --target=x86_64-efi/)
const firstBoot = read('distribution/live/config/includes.chroot/usr/local/libexec/taichios-first-boot')
assert.match(firstBoot, /\/home\/taichi\/.dsh/)
assert.match(firstBoot, /\/home\/creator\/.dsh/)
const harnessUnit = read('distribution/live/config/includes.chroot/etc/systemd/system/taichios-harness@.service')
assert.match(harnessUnit, /^Wants=taichios-mock-provider\.service$/m)
assert.doesNotMatch(harnessUnit, /^Requires=taichios-mock-provider\.service$/m)

for (const executable of ['distribution/live/auto/config', 'distribution/live/auto/build', 'distribution/live/auto/clean', 'distribution/live/auto/stage-runtime', 'tools/install-live-build.sh', 'tools/test-live-boot.sh', 'tools/test-installed-system.sh']) {
  accessSync(resolve(workspace, executable), constants.X_OK)
}

const artifact = resolve(workspace, 'artifacts/live/taichios-0.1-amd64.hybrid.iso')
const checksum = `${artifact}.sha256`
assert.equal(existsSync(artifact), existsSync(checksum), 'ISO and checksum must be present together')

process.stdout.write('TaiChiOS Debian Live definition: PASS\n')
