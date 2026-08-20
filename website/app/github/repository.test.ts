import { describe, expect, it } from 'vitest'
import { firstLine, formatBytes, isRepositorySnapshot } from './repository'

describe('GitHub repository data', () => {
  it('accepts a live repository snapshot without depending on a release tag', () => {
    expect(isRepositorySnapshot({ repository: 'owner/repo', fetchedAt: new Date().toISOString(), latest: null, releases: [], commits: [] })).toBe(true)
    expect(isRepositorySnapshot({ repository: 'owner/repo', fetchedAt: '', latest: {}, releases: [], commits: [] })).toBe(false)
  })

  it('formats API asset and commit data for the current locale', () => {
    expect(formatBytes(1024 ** 2, 'en')).toContain('MB')
    expect(firstLine('subject\n\nbody')).toBe('subject')
  })
})
