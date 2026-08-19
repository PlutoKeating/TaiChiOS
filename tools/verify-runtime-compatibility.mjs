#!/usr/bin/env node

import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const runtimePackagePath = resolve(workspace, 'distribution/runtime/package.json')
const lockPath = resolve(workspace, 'distribution/debian/runtime.lock.json')
const runtimePackage = JSON.parse(readFileSync(runtimePackagePath, 'utf8'))
const runtimeLock = JSON.parse(readFileSync(lockPath, 'utf8'))
const failures = []
const check = (label, operation) => {
  try {
    operation()
    process.stdout.write(`ok - ${label}\n`)
  } catch (error) {
    failures.push(`${label}: ${error instanceof Error ? error.message : String(error)}`)
    process.stdout.write(`not ok - ${label}\n`)
  }
}

const readInstalledPackage = name => {
  const packagePath = resolve(dirname(runtimePackagePath), 'node_modules', name, 'package.json')
  return {
    directory: dirname(packagePath),
    manifest: JSON.parse(readFileSync(packagePath, 'utf8')),
  }
}

const shellQuote = value => `'${value.replaceAll("'", "'\\''")}'`

check('runtime inputs are immutable', () => {
  assert.equal(runtimeLock.schemaVersion, 1)
  assert.match(runtimeLock.node.sha256, /^[a-f0-9]{64}$/)
  assert.equal(runtimeLock.node.license, 'MIT')
  assert.equal(runtimeLock.node.licenseFile, 'LICENSE')
  assert.equal(readFileSync(resolve(workspace, '.node-version'), 'utf8').trim(), runtimeLock.node.version)
  for (const component of Object.values(runtimeLock.components)) {
    assert.match(component.commit, /^[a-f0-9]{40}$/)
    assert.match(component.distIntegrity, /^sha512-/)
    assert.equal(runtimePackage.dependencies[component.package], component.version)
  }
  assert.equal(runtimePackage.packageManager, `${runtimeLock.packageManager.package}@${runtimeLock.packageManager.version}`)
  assert.equal(runtimePackage.dependencies.pnpm, runtimeLock.packageManager.version)
  for (const [name, dependency] of Object.entries(runtimeLock.runtimeDependencies)) {
    assert.equal(runtimePackage.dependencies[name], dependency.version)
  }
  for (const version of Object.values(runtimePackage.dependencies)) {
    assert.doesNotMatch(version, /^[~^*]|\b(?:latest|next)\b/)
  }
  assert.equal(readInstalledPackage('pnpm').manifest.version, runtimeLock.packageManager.version)
})

check('installed packages match the compatibility lock', () => {
  for (const component of Object.values(runtimeLock.components)) {
    const { manifest } = readInstalledPackage(component.package)
    assert.equal(manifest.version, component.version, component.package)
    assert.equal(manifest.license, component.license, component.package)
  }
  const directDependencies = {
    pnpm: runtimeLock.packageManager,
    ...runtimeLock.runtimeDependencies,
  }
  for (const [name, expected] of Object.entries(directDependencies)) {
    const { manifest } = readInstalledPackage(name)
    assert.equal(manifest.version, expected.version, name)
    assert.equal(manifest.license, expected.license, name)
    assert.ok(existsSync(resolve(dirname(runtimePackagePath), expected.licenseFile)), `${name} license`)
  }
})

check('official Cordis is isolated from the inherited workspace', () => {
  assert.equal(runtimeLock.legacyCordis.runtime, false)
  const legacy = JSON.parse(readFileSync(resolve(workspace, runtimeLock.legacyCordis.workspace, 'package.json'), 'utf8'))
  assert.equal(legacy.name, runtimeLock.legacyCordis.package)
  assert.equal(legacy.version, runtimeLock.legacyCordis.version)
  assert.notEqual(legacy.name, runtimeLock.components.cordis.package)
})

check('dsh-TUI publishes a DSH bundle patch for official Cordis', () => {
  const { directory, manifest } = readInstalledPackage(runtimeLock.components.shell.package)
  assert.equal(manifest.dsh?.bundle?.patch, './cordis.patch.yml')
  assert.ok(manifest.exports?.['./cordis.patch.yml'])
  const patchPath = resolve(directory, manifest.dsh.bundle.patch)
  assert.ok(existsSync(patchPath))
  const patch = readFileSync(patchPath, 'utf8')
  assert.match(patch, /@deepseek-ai\/dsh-/)
  assert.doesNotMatch(patch, /@cordisjs\//)
})

check('official dsh CLI starts on this Node runtime', () => {
  assert.equal(process.versions.node, runtimeLock.node.version, 'Node runtime does not match the compatibility lock')
  const dshPackage = readInstalledPackage(runtimeLock.components.harness.package)
  const bin = resolve(dshPackage.directory, dshPackage.manifest.bin.dsh)
  const version = execFileSync(process.execPath, [bin, '--version'], { encoding: 'utf8' }).trim()
  assert.match(version, new RegExp(runtimeLock.components.harness.version.replaceAll('.', '\\.')))
  const help = execFileSync(process.execPath, [bin, '--help'], { encoding: 'utf8' })
  assert.match(help, /--profile/)
  assert.match(help, /plugin/)
})

check('dsh-TUI profile composes without network access', () => {
  const dshPackage = readInstalledPackage(runtimeLock.components.harness.package)
  const bin = resolve(dshPackage.directory, dshPackage.manifest.bin.dsh)
  const home = mkdtempSync(resolve(tmpdir(), 'taichios-dsh-smoke-'))
  try {
    execFileSync(process.execPath, ['tools/prepare-dsh-profile.mjs', '--home', home], {
      cwd: workspace,
    })
    const config = execFileSync(process.execPath, [bin, '--profile', 'dsh-tui', '--dump-config'], {
      encoding: 'utf8',
      env: { ...process.env, DSH_HOME: home },
    })
    assert.match(config, /@deepseek-ai\/dsh-base/)
    assert.match(config, /@deepseek-harness-tui\/dsh-tui/)
    assert.match(config, /@deepseek-ai\/dsh-agent/)
    assert.doesNotMatch(config, /@cordisjs\//)
  } finally {
    rmSync(home, { force: true, recursive: true })
  }
})

check('dsh-TUI starts offline in a pseudo-terminal', () => {
  const dshPackage = readInstalledPackage(runtimeLock.components.harness.package)
  const bin = resolve(dshPackage.directory, dshPackage.manifest.bin.dsh)
  const runtimeDirectory = dirname(runtimePackagePath)
  const home = mkdtempSync(resolve(tmpdir(), 'taichios-dsh-tui-'))
  const transcript = resolve(home, 'typescript')
  try {
    const isolationProbe = ['--unshare-net', '--bind', '/', '/', 'true']
    const bubblewrap = spawnSync('bwrap', isolationProbe, { encoding: 'utf8' })
    let sandbox = 'bwrap'
    if (bubblewrap.status !== 0) {
      const userBoundary = ['--setuid', String(process.getuid()), '--setgid', String(process.getgid())]
      const elevatedNamespace = spawnSync(
        'sudo',
        ['-n', 'unshare', '--net', ...userBoundary, 'true'],
        { encoding: 'utf8' },
      )
      assert.equal(
        elevatedNamespace.status,
        0,
        `cannot create an offline namespace: ${bubblewrap.stderr || elevatedNamespace.stderr}`,
      )
      sandbox = [
        'sudo -n env',
        `DSH_HOME=${shellQuote(home)}`,
        `HOME=${shellQuote(home)}`,
        `PATH=${shellQuote(`${resolve(runtimeDirectory, 'node_modules/.bin')}:${process.env.PATH ?? ''}`)}`,
        "TERM='xterm-256color'",
        'unshare --net',
        userBoundary.join(' '),
      ].join(' ')
    }
    execFileSync(process.execPath, ['tools/prepare-dsh-profile.mjs', '--home', home], {
      cwd: workspace,
    })
    const startedAt = Date.now()
    const result = spawnSync('timeout', [
      '--signal=INT',
      '--kill-after=2',
      '4',
      'script',
      '-qfec',
      sandbox === 'bwrap'
        ? `${sandbox} --unshare-net --bind / / ${shellQuote(process.execPath)} ${shellQuote(bin)} --profile dsh-tui`
        : `${sandbox} ${shellQuote(process.execPath)} ${shellQuote(bin)} --profile dsh-tui`,
      transcript,
    ], {
      env: {
        ...process.env,
        DSH_HOME: home,
        PATH: `${resolve(runtimeDirectory, 'node_modules/.bin')}:${process.env.PATH ?? ''}`,
        TERM: 'xterm-256color',
      },
      stdio: 'ignore',
    })
    const elapsed = Date.now() - startedAt
    const output = readFileSync(transcript, 'utf8')
    assert.ok(
      elapsed >= 3500 && (result.status === 124 || result.signal === 'SIGINT'),
      `TUI exited before the smoke timeout (status ${result.status}, signal ${result.signal}, ${elapsed}ms)\n${output.slice(-4000)}`,
    )
    assert.match(output, /dsh-TUI/)
    assert.doesNotMatch(output, /plugin tree failed|ERR_MODULE_NOT_FOUND/)
  } finally {
    rmSync(home, { force: true, recursive: true })
  }
})

if (failures.length > 0) {
  process.stderr.write(`\n${failures.join('\n')}\n`)
  process.exitCode = 1
} else {
  process.stdout.write('\nTaiChiOS runtime compatibility: PASS\n')
}
