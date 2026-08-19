import { ArrowRight, ArrowUpRight, Check, ShieldCheck, TerminalSquare } from 'lucide-react'
import { Link } from 'react-router'
import { SystemMap } from '../components/system-map'
import { GitHubIcon } from '../components/brand'
import { corePrinciples, site } from '../content/site'
import { corePrinciplesEn } from '../content/site.en'
import { homeCopy } from '../i18n/home'
import { useLanguage, useLocalizedDocument } from '../i18n/language'
import { pageMeta } from '../seo/meta'
import type { Route } from './+types/home'

export const meta: Route.MetaFunction = () =>
  pageMeta('AI 原生、可组合、可恢复的操作系统', site.description, '/')

export default function Home() {
  const { locale } = useLanguage()
  const copy = homeCopy[locale]
  const principles = locale === 'zh' ? corePrinciples : corePrinciplesEn
  useLocalizedDocument(
    locale === 'zh' ? 'AI 原生、可组合、可恢复的操作系统 — TaiChiOS' : 'AI-native, composable, and recoverable — TaiChiOS',
    copy.lead,
  )
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/8">
        <div className="site-container grid min-h-[calc(100dvh-var(--header-height))] items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="status-pill"><span className="status-dot" />{copy.status}</span>
              <span className="font-mono text-xs tracking-wider text-slate-500">{copy.platform}</span>
            </div>
            <p className="eyebrow mt-10">{copy.eyebrow}</p>
            <h1 className="display-title mt-6 text-balance">{copy.title}</h1>
            <p className="lead mt-7 max-w-2xl">
              {copy.lead}
            </p>
            <div className="mt-9 flex flex-col gap-3 xs:flex-row">
              <Link to="/features" className="button-primary">{copy.explore} <ArrowRight aria-hidden="true" className="size-4" /></Link>
              <Link to="/download" className="button-secondary">{copy.state} <TerminalSquare aria-hidden="true" className="size-4" /></Link>
            </div>
            <p className="mt-6 flex max-w-xl items-start gap-2 text-sm leading-6 text-slate-500">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cyan-300" />
              {copy.warning}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="hero-orb left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
            <div className="relative rotate-[1deg]"><SystemMap /></div>
          </div>
        </div>
      </section>

      <section aria-label={copy.proofLabel} className="border-b border-white/8 bg-[#0a0e16]">
        <div className="site-container grid grid-cols-2 divide-x divide-y divide-white/8 sm:grid-cols-4 sm:divide-y-0">
          {copy.proofs.map(([value, label]) => (
            <div key={value} className="min-w-0 px-4 py-6 sm:px-5 lg:py-8">
              <p className="font-mono text-xs font-semibold tracking-wider text-white">{value}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="eyebrow">{copy.principlesEyebrow}</p>
              <h2 className="section-title mt-5 text-balance">{copy.principlesTitle}</h2>
            </div>
            <p className="body-copy lg:pb-1">{copy.principlesBody}</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon
              return (
                <article key={principle.title} className="feature-card">
                  <span className="feature-icon"><Icon aria-hidden="true" className="size-5" /></span>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">{principle.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-400">{principle.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="site-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">{copy.mvpEyebrow}</p>
            <h2 className="section-title mt-5 text-balance">{copy.mvpTitle}</h2>
            <p className="body-copy mt-6">{copy.mvpBody}</p>
            <Link className="text-link mt-7" to="/download">{copy.mvpLink} <ArrowRight aria-hidden="true" className="size-4" /></Link>
          </div>
          <ol className="grid gap-3" aria-label={copy.mvpStepsLabel}>
            {['Boot live media', 'Install to an empty disk', 'Boot the installed system', 'Run supervised Harness', 'Fall back to plain shell', 'Enter independent recovery'].map((step, index) => (
              <li key={step} className="flex min-h-15 items-center gap-4 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/5 font-mono text-xs text-cyan-200">{String(index + 1).padStart(2, '0')}</span>
                <span className="font-mono text-sm text-slate-300">{step}</span>
                <Check aria-hidden="true" className="ml-auto size-4 shrink-0 text-cyan-300" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="site-container rounded-3xl border border-violet-300/15 bg-[radial-gradient(circle_at_85%_15%,rgba(34,211,238,0.12),transparent_35%),linear-gradient(135deg,rgba(124,58,237,0.12),rgba(255,255,255,0.02))] p-6 sm:p-10 lg:p-14">
          <div className="max-w-3xl">
            <p className="eyebrow">{copy.ctaEyebrow}</p>
            <h2 className="section-title mt-5 text-balance">{copy.ctaTitle}</h2>
            <p className="lead mt-6">{copy.ctaBody}</p>
            <div className="mt-8 flex flex-col gap-3 xs:flex-row">
              <Link to="/community" className="button-primary">{copy.contribute} <ArrowRight aria-hidden="true" className="size-4" /></Link>
              <a href={site.repo} target="_blank" rel="noreferrer" className="button-secondary"><GitHubIcon className="size-4" /> {copy.source} <ArrowUpRight aria-hidden="true" className="size-4" /></a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
