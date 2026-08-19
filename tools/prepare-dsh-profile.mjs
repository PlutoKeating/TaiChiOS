#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readlinkSync, symlinkSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export function prepareDshProfile({
  home,
  runtime = resolve(workspace, 'distribution/runtime'),
} = {}) {
  if (!home) throw new Error('prepare-dsh-profile: home is required')

  const source = resolve(workspace, 'distribution/runtime/profiles/dsh-tui')
  const profile = resolve(home, 'profiles/dsh-tui')
  const packageSource = resolve(runtime, 'node_modules/@deepseek-harness-tui/dsh-tui')
  const packageLink = resolve(profile, 'node_modules/@deepseek-harness-tui/dsh-tui')

  if (!existsSync(packageSource)) {
    throw new Error(`prepare-dsh-profile: runtime package is missing: ${packageSource}`)
  }
  if (!existsSync(profile)) cpSync(source, profile, { recursive: true })
  mkdirSync(dirname(packageLink), { recursive: true })

  if (existsSync(packageLink)) {
    if (resolve(dirname(packageLink), readlinkSync(packageLink)) !== packageSource) {
      throw new Error(`prepare-dsh-profile: refusing to replace existing package link: ${packageLink}`)
    }
  } else {
    symlinkSync(packageSource, packageLink, 'dir')
  }

  return profile
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const homeIndex = args.indexOf('--home')
  const runtimeIndex = args.indexOf('--runtime')
  const home = homeIndex < 0 ? process.env.DSH_HOME : args[homeIndex + 1]
  const runtime = runtimeIndex < 0 ? undefined : args[runtimeIndex + 1]
  process.stdout.write(`${prepareDshProfile({ home, runtime })}\n`)
}
