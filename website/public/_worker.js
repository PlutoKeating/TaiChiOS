const CANONICAL_HOST = 'taichios.arr2018.dpdns.org'
const GITHUB_API = 'https://api.github.com/repos/PlutoKeating/TaiChiOS'

const githubHeaders = (env) => {
  const headers = {
    accept: 'application/vnd.github+json',
    'user-agent': 'TaiChiOS-website',
    'x-github-api-version': '2022-11-28',
  }
  if (env.GITHUB_TOKEN) headers.authorization = `Bearer ${env.GITHUB_TOKEN}`
  return headers
}

async function repositorySnapshot(env) {
  const [releaseResponse, commitResponse] = await Promise.all([
    fetch(`${GITHUB_API}/releases?per_page=20`, { headers: githubHeaders(env) }),
    fetch(`${GITHUB_API}/commits?sha=main&per_page=20`, { headers: githubHeaders(env) }),
  ])
  if (!releaseResponse.ok || !commitResponse.ok) {
    throw new Error(`GitHub API failure: releases=${releaseResponse.status}, commits=${commitResponse.status}`)
  }
  const [rawReleases, rawCommits] = await Promise.all([releaseResponse.json(), commitResponse.json()])
  const releases = rawReleases.filter((release) => !release.draft).map((release) => ({
    tag: release.tag_name,
    name: release.name || release.tag_name,
    url: release.html_url,
    publishedAt: release.published_at,
    body: release.body || '',
    prerelease: release.prerelease,
    assets: release.assets.map((asset) => ({
      name: asset.name,
      url: asset.browser_download_url,
      size: asset.size,
      contentType: asset.content_type,
      digest: asset.digest || null,
    })),
  }))
  const commits = rawCommits.map((commit) => ({
    sha: commit.sha,
    url: commit.html_url,
    message: commit.commit.message,
    authoredAt: commit.commit.author?.date || commit.commit.committer?.date,
    author: commit.author?.login || commit.commit.author?.name || 'unknown',
  }))
  return {
    repository: 'PlutoKeating/TaiChiOS',
    fetchedAt: new Date().toISOString(),
    latest: releases[0] || null,
    releases,
    commits,
  }
}

async function githubApiResponse(request, env, context) {
  const cache = caches.default
  const cacheKey = new Request(request.url, { method: 'GET' })
  const cached = await cache.match(cacheKey)
  if (cached) return cached
  try {
    const response = Response.json(await repositorySnapshot(env), {
      headers: { 'cache-control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300' },
    })
    context.waitUntil(cache.put(cacheKey, response.clone()))
    return response
  } catch (error) {
    return Response.json({ error: 'github_unavailable', detail: String(error) }, { status: 502, headers: { 'cache-control': 'no-store' } })
  }
}

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url)

    if (url.hostname.endsWith('.pages.dev')) {
      url.hostname = CANONICAL_HOST
      url.protocol = 'https:'
      url.port = ''

      return Response.redirect(url.toString(), 308)
    }

    if (url.pathname === '/api/github/repository' && request.method === 'GET') {
      return githubApiResponse(request, env, context)
    }

    return env.ASSETS.fetch(request)
  },
}
