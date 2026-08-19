#!/usr/bin/env node

import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const artifactDirectory = resolve(workspace, process.env.TAICHIOS_ARTIFACT_DIR ?? 'artifacts/live')
const tag = process.argv[process.argv.indexOf('--tag') + 1]
const commit = process.argv[process.argv.indexOf('--commit') + 1]
const expectedFiles = [
  'taichios-0.1-amd64.hybrid.iso',
  'taichios-0.1-source.iso',
  'source.contents',
  'binary.packages',
  'chroot.packages.install',
  'chroot.packages.live',
  'build-environment.txt',
]

assert.match(tag ?? '', /^v0\.1\.0-mvp\.[1-9][0-9]*$/, 'release tag must identify the 0.1 MVP prerelease line')
assert.match(commit ?? '', /^[a-f0-9]{40}$/, 'release commit must be a full Git SHA')

const sha256 = path => createHash('sha256').update(readFileSync(path)).digest('hex')
const describeFile = name => {
  const path = resolve(artifactDirectory, name)
  const stats = statSync(path)
  assert.ok(stats.isFile() && stats.size > 0, `${name} must be a non-empty file`)
  return { name, bytes: stats.size, sha256: sha256(path) }
}
const filesBelow = root => readdirSync(root, { recursive: true, withFileTypes: true })
  .filter(entry => entry.isFile())
  .map(entry => resolve(entry.parentPath, entry.name))
  .sort((left, right) => left.localeCompare(right))
const describeTree = name => {
  const root = resolve(workspace, name)
  const files = filesBelow(root)
  const hash = createHash('sha256')
  for (const path of files) {
    hash.update(relative(root, path))
    hash.update('\0')
    hash.update(readFileSync(path))
    hash.update('\0')
  }
  return { files: files.length, sha256: hash.digest('hex') }
}
const describeSources = names => {
  const hash = createHash('sha256')
  for (const name of [...names].sort()) {
    hash.update(name)
    hash.update('\0')
    hash.update(readFileSync(resolve(workspace, name)))
    hash.update('\0')
  }
  return { files: names.length, sha256: hash.digest('hex'), sources: names }
}

const debian = JSON.parse(readFileSync(resolve(workspace, 'distribution/debian/snapshot.json'), 'utf8'))
const runtime = JSON.parse(readFileSync(resolve(workspace, 'distribution/debian/runtime.lock.json'), 'utf8'))
const artifacts = Object.fromEntries(expectedFiles.map(name => [basename(name), describeFile(name)]))
const metadata = {
  schemaVersion: 1,
  release: { tag, line: runtime.releaseLine, commit, architecture: runtime.architecture },
  debian: {
    suite: debian.suite,
    release: debian.release,
    snapshot: debian.snapshot,
    liveBuild: debian.liveBuild,
  },
  compatibility: {
    node: runtime.node.version,
    cordis: runtime.components.cordis,
    harness: runtime.components.harness,
    shell: runtime.components.shell,
    systemPlugins: {
      shell: describeSources(['distribution/live/config/includes.chroot/usr/local/bin/taichios-shell']),
      harnessSupervisor: describeSources([
        'distribution/live/config/includes.chroot/usr/local/libexec/taichios-harness-supervisor',
        'distribution/live/config/includes.chroot/etc/systemd/system/taichios-harness@.service',
      ]),
      mockProvider: describeSources([
        'distribution/live/config/includes.chroot/usr/local/libexec/taichios-mock-provider.mjs',
        'distribution/live/config/includes.chroot/etc/systemd/system/taichios-mock-provider.service',
      ]),
      installer: describeSources(['distribution/live/config/includes.chroot/usr/local/sbin/taichios-install']),
      changeManager: describeSources(['distribution/live/config/includes.chroot/usr/local/sbin/taichios-change']),
      recovery: describeSources([
        'distribution/live/config/includes.chroot/usr/local/sbin/taichios-recovery',
        'distribution/live/config/includes.chroot/etc/systemd/system/taichios-recovery.target',
        'distribution/live/config/includes.chroot/etc/grub.d/41_taichios_recovery',
      ]),
    },
  },
  composition: {
    profiles: describeTree('distribution/runtime/profiles'),
    bundles: describeSources([
      'distribution/runtime/profiles/dsh-tui/package.json',
      'distribution/runtime/profiles/dsh-tui/cordis.patch.yml',
      'distribution/runtime/pnpm-lock.yaml',
      'distribution/debian/runtime.lock.json',
    ]),
  },
  artifacts,
  rollback: {
    migrations: 'No cross-release data migration is provided by the 0.1 MVP prerelease.',
    supportedPath: 'Boot the independent Recovery target and restore the previous-known-good file Change Set.',
  },
}

const metadataPath = resolve(artifactDirectory, 'release-metadata.json')
writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`)

const checksummedFiles = [...expectedFiles, 'release-metadata.json']
const checksums = checksummedFiles
  .map(name => `${sha256(resolve(artifactDirectory, name))}  ${name}`)
  .join('\n')
writeFileSync(resolve(artifactDirectory, 'SHA256SUMS'), `${checksums}\n`)

process.stdout.write(`Release contract ready for ${tag} at ${commit}\n`)
