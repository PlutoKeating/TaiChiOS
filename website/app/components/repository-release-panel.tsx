import { ArrowUpRight, Clock3, Download, GitCommitHorizontal, PackageOpen } from 'lucide-react'
import { useRepositoryData } from '../github/repository-context'
import { firstLine, formatBytes } from '../github/repository'
import { useLanguage } from '../i18n/language'

const copy = {
  zh: {
    eyebrow: 'LIVE GITHUB DATA', title: '最新发布与完整下载', loading: '正在从 GitHub 获取最新 Release…',
    error: '暂时无法读取 GitHub 数据。页面不会用过期的硬编码版本替代实时结果。', assets: '发布资产',
    history: '版本记录', commits: '最新提交', published: '发布于', prerelease: '预发布', stable: '稳定发布', empty: 'GitHub 尚无公开 Release。',
  },
  en: {
    eyebrow: 'LIVE GITHUB DATA', title: 'Latest release and complete downloads', loading: 'Loading the latest GitHub Release…',
    error: 'GitHub data is temporarily unavailable. The site will not substitute a stale hardcoded version.', assets: 'Release assets',
    history: 'Version history', commits: 'Recent commits', published: 'Published', prerelease: 'Prerelease', stable: 'Stable', empty: 'No public GitHub Release is available.',
  },
} as const

export function RepositoryReleasePanel() {
  const { locale } = useLanguage()
  const { data, loading, error } = useRepositoryData()
  const text = copy[locale]
  const date = (value: string) => new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

  return (
    <section className="section section-muted" aria-live="polite">
      <div className="site-container">
        <p className="eyebrow">{text.eyebrow}</p>
        <h2 className="section-title mt-4 text-balance">{text.title}</h2>
        {loading && <p className="body-copy mt-6">{text.loading}</p>}
        {error && <p className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100">{text.error}</p>}
        {!loading && !data?.latest && <p className="body-copy mt-6">{text.empty}</p>}

        {data?.latest && (
          <article className="mt-8 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.035] p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-mono text-xl font-semibold text-white">{data.latest.tag}</h3>
              <span className="status-pill"><span className="status-dot" />{data.latest.prerelease ? text.prerelease : text.stable}</span>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-slate-400"><Clock3 aria-hidden="true" className="size-4" />{text.published} {date(data.latest.publishedAt)}</p>
            <a className="text-link mt-5" href={data.latest.url} target="_blank" rel="noreferrer">GitHub Release <ArrowUpRight aria-hidden="true" className="size-4" /></a>
            <h4 className="mt-8 font-semibold text-white">{text.assets}</h4>
            <ul className="mt-4 grid gap-3 lg:grid-cols-2">
              {data.latest.assets.map((asset) => (
                <li key={asset.url} className="rounded-xl border border-white/8 bg-black/10 p-4">
                  <a className="flex min-h-11 items-center gap-3 font-mono text-sm text-cyan-200 hover:text-white" href={asset.url}>
                    <Download aria-hidden="true" className="size-4 shrink-0" /><span className="min-w-0 break-all">{asset.name}</span>
                    <span className="ml-auto shrink-0 text-xs text-slate-500">{formatBytes(asset.size, locale)}</span>
                  </a>
                  {asset.digest && <p className="mt-2 break-all font-mono text-[0.68rem] leading-5 text-slate-500">{asset.digest}</p>}
                </li>
              ))}
            </ul>
          </article>
        )}

        {data && (
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><PackageOpen aria-hidden="true" className="size-5 text-violet-300" />{text.history}</h3>
              <ul className="mt-4 grid gap-3">
                {data.releases.map((release) => <li key={release.url}><a className="feature-card block" href={release.url} target="_blank" rel="noreferrer"><span className="font-mono text-sm text-cyan-200">{release.tag}</span><span className="mt-2 block text-xs text-slate-500">{date(release.publishedAt)}</span></a></li>)}
              </ul>
            </section>
            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><GitCommitHorizontal aria-hidden="true" className="size-5 text-violet-300" />{text.commits}</h3>
              <ul className="mt-4 grid gap-3">
                {data.commits.map((commit) => <li key={commit.sha}><a className="feature-card block" href={commit.url} target="_blank" rel="noreferrer"><span className="font-mono text-xs text-cyan-200">{commit.sha.slice(0, 7)}</span><span className="mt-2 block text-sm leading-6 text-slate-300">{firstLine(commit.message)}</span><span className="mt-2 block text-xs text-slate-500">{commit.author} · {date(commit.authoredAt)}</span></a></li>)}
              </ul>
            </section>
          </div>
        )}
      </div>
    </section>
  )
}
