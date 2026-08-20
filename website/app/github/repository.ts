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
