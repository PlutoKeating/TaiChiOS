import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const workspace = fileURLToPath(new URL('../..', import.meta.url))

describe('TaiChiOS Harness runtime compatibility', () => {
  it('passes the public compatibility smoke entry point', () => {
    const output = execFileSync(process.execPath, ['tools/verify-runtime-compatibility.mjs'], {
      cwd: workspace,
      encoding: 'utf8',
    })

    expect(output).toContain('TaiChiOS runtime compatibility: PASS')
    expect(output).toContain('dsh-TUI profile composes without network access')
    expect(output).toContain('dsh-TUI starts offline in a pseudo-terminal')
  })
})
