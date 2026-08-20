export type GitHubAsset = {
  name: string
  url: string
  size: number
  contentType: string
  digest: string | null
}

export type GitHubRelease = {
  tag: string
  name: string
  url: string
  publishedAt: string
  body: string
  prerelease: boolean
  assets: GitHubAsset[]
}

export type GitHubCommit = {
  sha: string
  url: string
  message: string
  authoredAt: string
  author: string
}

export type RepositorySnapshot = {
  repository: string
  fetchedAt: string
  latest: GitHubRelease | null
  releases: GitHubRelease[]
  commits: GitHubCommit[]
}

const GITHUB_API = 'https://api.github.com/repos/PlutoKeating/TaiChiOS'
const PAGE_SIZE = 100

type RawGitHubAsset = {
  name?: unknown
  browser_download_url?: unknown
  size?: unknown
  content_type?: unknown
  digest?: unknown
}

type RawGitHubRelease = {
  draft?: unknown
  tag_name?: unknown
  name?: unknown
  html_url?: unknown
  published_at?: unknown
  body?: unknown
  prerelease?: unknown
  assets?: unknown
}

type RawGitHubCommit = {
  sha?: unknown
  html_url?: unknown
  author?: { login?: unknown } | null
  commit?: {
    message?: unknown
    author?: { name?: unknown; date?: unknown } | null
    committer?: { date?: unknown } | null
  }
}

export function formatBytes(bytes: number, locale: 'zh' | 'en') {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'unit',
    unit: bytes >= 1024 ** 3 ? 'gigabyte' : 'megabyte',
    unitDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(bytes / (bytes >= 1024 ** 3 ? 1024 ** 3 : 1024 ** 2))
}

export function firstLine(message: string) {
  return message.split('\n', 1)[0]
}

export function isRepositorySnapshot(value: unknown): value is RepositorySnapshot {
  if (!value || typeof value !== 'object') return false
  const snapshot = value as Partial<RepositorySnapshot>
  return typeof snapshot.repository === 'string'
    && typeof snapshot.fetchedAt === 'string'
    && Array.isArray(snapshot.releases)
    && Array.isArray(snapshot.commits)
    && (snapshot.latest === null || typeof snapshot.latest?.tag === 'string')
}

export async function fetchRepositorySnapshot(fetcher: typeof fetch = fetch, signal?: AbortSignal): Promise<RepositorySnapshot> {
  const loadCollection = async (collection: 'releases' | 'commits') => {
    const releases = new Map<string, GitHubRelease>()
    const commits = new Map<string, GitHubCommit>()
    let pageNumber = 1
    let reference: string | null = null
    while (true) {
      const path = collection === 'releases'
        ? 'releases'
        : `commits?sha=${encodeURIComponent(reference || 'main')}`
      const separator = path.includes('?') ? '&' : '?'
      const response = await fetcher(`${GITHUB_API}/${path}${separator}per_page=${PAGE_SIZE}&page=${pageNumber}`, { headers: { accept: 'application/json' }, signal })
      const payload: unknown = await response.json()
      if (!response.ok || !Array.isArray(payload)) throw new Error('invalid GitHub repository page')
      if (collection === 'commits') {
        const values = payload.map((value) => {
          const commit = value as RawGitHubCommit
          return {
            sha: String(commit.sha || ''),
            url: String(commit.html_url || ''),
            message: String(commit.commit?.message || ''),
            authoredAt: String(commit.commit?.author?.date || commit.commit?.committer?.date || ''),
            author: String(commit.author?.login || commit.commit?.author?.name || 'unknown'),
          }
        }).filter((commit) => commit.sha)
        if (pageNumber === 1) reference = values[0]?.sha || null
        for (const commit of values) commits.set(commit.sha, commit)
      } else {
        for (const value of payload) {
          const release = value as RawGitHubRelease
          if (release.draft || !release.tag_name) continue
          const sanitized: GitHubRelease = {
            tag: String(release.tag_name),
            name: String(release.name || release.tag_name),
            url: String(release.html_url || ''),
            publishedAt: String(release.published_at || ''),
            body: String(release.body || ''),
            prerelease: Boolean(release.prerelease),
            assets: Array.isArray(release.assets) ? release.assets.map((value) => {
              const asset = value as RawGitHubAsset
              return {
                name: String(asset.name || ''),
                url: String(asset.browser_download_url || ''),
                size: Number(asset.size || 0),
                contentType: String(asset.content_type || ''),
                digest: asset.digest ? String(asset.digest) : null,
              }
            }) : [],
          }
          releases.set(sanitized.tag, sanitized)
        }
      }
      if (payload.length < PAGE_SIZE) return { releases: [...releases.values()], commits: [...commits.values()] }
      pageNumber += 1
    }
  }
  const [releaseData, commitData] = await Promise.all([loadCollection('releases'), loadCollection('commits')])
  return {
    repository: 'PlutoKeating/TaiChiOS',
    fetchedAt: new Date().toISOString(),
    latest: releaseData.releases[0] || null,
    releases: releaseData.releases,
    commits: commitData.commits,
  }
}
