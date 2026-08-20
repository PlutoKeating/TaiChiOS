import { afterEach, describe, expect, it, vi } from 'vitest'
// @ts-expect-error Cloudflare Pages serves this JavaScript worker directly.
import worker from '../../public/_worker.js'

afterEach(() => vi.unstubAllGlobals())

describe('Cloudflare GitHub repository endpoint', () => {
  it('returns sanitized live releases, assets, and commits from GitHub', async () => {
    const cache = { match: vi.fn().mockResolvedValue(undefined), put: vi.fn().mockResolvedValue(undefined) }
    vi.stubGlobal('caches', { default: cache })
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(Response.json([{ draft: false, tag_name: 'v-live', name: '', html_url: 'https://example/release', published_at: '2026-01-01T00:00:00Z', body: 'notes', prerelease: true, assets: [{ name: 'image.iso', browser_download_url: 'https://example/image.iso', size: 42, content_type: 'application/octet-stream', digest: 'sha256:abc' }] }]))
      .mockResolvedValueOnce(Response.json([{ sha: 'abcdef123456', html_url: 'https://example/commit', commit: { message: 'subject', author: { name: 'Author', date: '2026-01-01T00:00:00Z' }, committer: { date: '2026-01-01T00:00:00Z' } }, author: { login: 'author' } }])))
    const pending: Promise<unknown>[] = []
    const response = await worker.fetch(
      new Request('https://taichios.arr2018.dpdns.org/api/github/repository'),
      { ASSETS: { fetch: vi.fn() } },
      { waitUntil: (promise: Promise<unknown>) => pending.push(promise) },
    )
    const payload = await response.json()
    await Promise.all(pending)

    expect(response.status).toBe(200)
    expect(payload.latest.tag).toBe('v-live')
    expect(payload.latest.assets[0].digest).toBe('sha256:abc')
    expect(payload.commits[0].sha).toBe('abcdef123456')
    expect(cache.put).toHaveBeenCalledOnce()
  })

  it('paginates until every public release and main commit is returned', async () => {
    const cache = { match: vi.fn().mockResolvedValue(undefined), put: vi.fn().mockResolvedValue(undefined) }
    vi.stubGlobal('caches', { default: cache })
    const release = { draft: false, tag_name: 'v-page', name: '', html_url: 'https://example/release', published_at: '2026-01-01T00:00:00Z', body: '', prerelease: true, assets: [] }
    const commit = { sha: 'abcdef123456', html_url: 'https://example/commit', commit: { message: 'subject', author: { name: 'Author', date: '2026-01-01T00:00:00Z' }, committer: { date: '2026-01-01T00:00:00Z' } }, author: null }
    const githubFetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input))
      const firstPage = url.searchParams.get('page') === '1'
      const value = url.pathname.endsWith('/releases') ? release : commit
      return Response.json(firstPage ? Array.from({ length: 100 }, () => value) : [value])
    })
    vi.stubGlobal('fetch', githubFetch)
    const pending: Promise<unknown>[] = []
    const response = await worker.fetch(
      new Request('https://taichios.arr2018.dpdns.org/api/github/repository'),
      { ASSETS: { fetch: vi.fn() } },
      { waitUntil: (promise: Promise<unknown>) => pending.push(promise) },
    )
    const payload = await response.json()
    await Promise.all(pending)

    expect(payload.releases).toHaveLength(101)
    expect(payload.commits).toHaveLength(101)
    expect(githubFetch).toHaveBeenCalledTimes(4)
  })
})
