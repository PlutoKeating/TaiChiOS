import { describe, expect, it, vi } from 'vitest'
import { fetchRepositorySnapshot, firstLine, formatBytes, isRepositorySnapshot } from './repository'

describe('GitHub repository data', () => {
  it('accepts a live repository snapshot without depending on a release tag', () => {
    expect(isRepositorySnapshot({ repository: 'owner/repo', fetchedAt: new Date().toISOString(), latest: null, releases: [], commits: [] })).toBe(true)
    expect(isRepositorySnapshot({ repository: 'owner/repo', fetchedAt: '', latest: {}, releases: [], commits: [] })).toBe(false)
  })

  it('formats API asset and commit data for the current locale', () => {
    expect(formatBytes(1024 ** 2, 'en')).toContain('MB')
    expect(firstLine('subject\n\nbody')).toBe('subject')
  })

  it('combines every paginated release and commit page in the browser', async () => {
    const reference = 'a'.repeat(40)
    const rawCommit = (sha: string) => ({ sha, html_url: `https://example/commit/${sha}`, commit: { message: 'subject', author: { name: 'author', date: '2026-01-01T00:00:00Z' }, committer: { date: '2026-01-01T00:00:00Z' } }, author: null })
    const rawRelease = (index: number) => ({ draft: false, tag_name: `v-live-${index}`, name: '', html_url: `https://example/release/${index}`, published_at: '2026-01-01T00:00:00Z', body: '', prerelease: true, assets: [] })
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input))
      const page = Number(url.searchParams.get('page'))
      if (url.pathname.endsWith('/releases')) {
        return Response.json(page === 1 ? Array.from({ length: 100 }, (_, index) => rawRelease(index)) : [rawRelease(100)])
      }
      return Response.json(page === 1
        ? Array.from({ length: 100 }, (_, index) => rawCommit(index === 0 ? reference : index.toString(16).padStart(40, '0')))
        : [])
    })
    const snapshot = await fetchRepositorySnapshot(fetcher as typeof fetch)

    expect(snapshot.latest?.tag).toBe('v-live-0')
    expect(snapshot.releases).toHaveLength(101)
    expect(snapshot.commits).toHaveLength(100)
    expect(fetcher).toHaveBeenCalledTimes(4)
    expect(fetcher.mock.calls.some(([url]) => String(url).includes(`sha=${reference}`))).toBe(true)
    expect(fetcher.mock.calls.every(([url]) => String(url).startsWith('https://api.github.com/'))).toBe(true)
  })
})
