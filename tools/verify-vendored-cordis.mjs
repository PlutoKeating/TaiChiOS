#!/usr/bin/env node

import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const boundary = resolve(workspace, 'vendor/cordis')
const packageRoot = resolve(boundary, 'packages')
const manifest = JSON.parse(readFileSync(resolve(boundary, 'upstream.json'), 'utf8'))

const filesInBoundary = () => {
  const prefix = 'vendor/cordis/packages/'
  const tracked = execFileSync('git', ['ls-files', prefix], { cwd: workspace, encoding: 'utf8' })
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard', prefix], {
    cwd: workspace,
    encoding: 'utf8',
  })
  return `${tracked}\n${untracked}`.trim().split('\n').filter(Boolean)
    .map(path => path.slice(prefix.length))
    .sort()
}

assert.match(manifest.commit, /^[a-f0-9]{40}$/)
execFileSync('git', ['cat-file', '-e', `${manifest.commit}^{commit}`], { cwd: workspace })

const upstreamFiles = execFileSync('git', [
  'ls-tree',
  '-r',
  '--name-only',
  manifest.commit,
  manifest.sourcePrefix,
], { cwd: workspace, encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean)

const expectedFiles = upstreamFiles.map(path => path.slice(`${manifest.sourcePrefix}/`.length)).sort()
assert.deepEqual(filesInBoundary(), expectedFiles, 'vendored file set differs from the pinned upstream tree')

const patchedFiles = new Set(manifest.localPatches.flatMap(patch => patch.files))
for (const path of upstreamFiles) {
  const vendored = readFileSync(resolve(boundary, path))
  const upstream = execFileSync('git', ['show', `${manifest.commit}:${path}`], {
    cwd: workspace,
    maxBuffer: 16 * 1024 * 1024,
  })
  if (patchedFiles.has(path)) {
    assert.notDeepEqual(vendored, upstream, `declared patch has no diff: ${path}`)
  } else {
    assert.deepEqual(vendored, upstream, `undeclared local patch: ${path}`)
  }
}

for (const path of patchedFiles) {
  assert.ok(upstreamFiles.includes(path), `patch queue references unknown upstream file: ${path}`)
}

const actualPackages = {}
for (const directory of readdirSync(packageRoot, { withFileTypes: true })) {
  if (!directory.isDirectory()) continue
  const packageJson = JSON.parse(readFileSync(resolve(packageRoot, directory.name, 'package.json'), 'utf8'))
  actualPackages[packageJson.name] = packageJson.version
}
assert.deepEqual(actualPackages, manifest.packages)

const license = readFileSync(resolve(boundary, manifest.licenseFile))
assert.equal(createHash('sha256').update(license).digest('hex'), manifest.licenseSha256)
assert.match(license.toString(), /MIT License/)

const rootPackage = JSON.parse(readFileSync(resolve(workspace, 'package.json'), 'utf8'))
assert.ok(rootPackage.workspaces.includes('vendor/cordis/packages/*'))
assert.equal(rootPackage.workspaces.includes('vendor/*'), false)

process.stdout.write('Vendored Cordis boundary: PASS\n')
