import { describe, expect, it, vi } from 'vitest'
// @ts-expect-error Cloudflare Pages serves this JavaScript worker directly.
import worker from '../../public/_worker.js'

describe('Cloudflare Pages advanced-mode worker', () => {
  it('redirects generated Pages hosts to the project custom domain', async () => {
    const response = await worker.fetch(
      new Request('https://deployment.taichios.pages.dev/download/?source=test'),
      { ASSETS: { fetch: vi.fn() } },
    )

    expect(response.status).toBe(308)
    expect(response.headers.get('location')).toBe('https://taichios.arr2018.dpdns.org/download/?source=test')
  })

  it('serves the custom domain through the Pages asset binding', async () => {
    const assetResponse = new Response('asset')
    const assetFetch = vi.fn().mockResolvedValue(assetResponse)
    const request = new Request('https://taichios.arr2018.dpdns.org/download/')
    const response = await worker.fetch(request, { ASSETS: { fetch: assetFetch } })

    expect(response).toBe(assetResponse)
    expect(assetFetch).toHaveBeenCalledWith(request)
  })
})
