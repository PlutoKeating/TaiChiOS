import { ArrowUpRight, Check, ChevronRight } from 'lucide-react'
import { pages, site } from '../content/site'
import { pagesEn } from '../content/site.en'
import { useLanguage, useLocalizedDocument } from '../i18n/language'

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="text-link mt-7" href={href} target="_blank" rel="noreferrer">
      {label}<ArrowUpRight aria-hidden="true" className="size-4" />
    </a>
  )
}

export function ContentPage({ slug }: { slug: string }) {
  const { locale } = useLanguage()
  const page = (locale === 'zh' ? pages : pagesEn)[slug]
  useLocalizedDocument(`${page.title} — ${site.name}`, page.lead)

  return (
    <>
      <section className="page-hero overflow-hidden border-b border-white/8">
        <div className="site-container relative py-16 sm:py-20 lg:py-28">
          <div className="hero-orb hero-orb-page" aria-hidden="true" />
          <div className="relative max-w-4xl">
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 className="display-title mt-6 text-balance">{page.title}</h1>
            <p className="lead mt-7 max-w-3xl">{page.lead}</p>
            <p className="mt-8 inline-flex max-w-2xl items-start gap-3 border-l-2 border-cyan-300 pl-4 font-mono text-sm leading-6 text-cyan-100">
              <ChevronRight aria-hidden="true" className="mt-0.5 size-4 shrink-0" />{page.accent}
            </p>
          </div>
        </div>
      </section>

      {page.sections.map((section, index) => (
        <section key={section.title} className={index % 2 === 0 ? 'section' : 'section section-muted'}>
          <div className="site-container">
            <div className="max-w-3xl">
              {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
              <h2 className="section-title mt-4 text-balance">{section.title}</h2>
              <p className="body-copy mt-6">{section.body}</p>
            </div>

            {section.features && (
              <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {section.features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <article key={feature.title} className="feature-card">
                      <span className="feature-icon"><Icon aria-hidden="true" className="size-5" /></span>
                      <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
                    </article>
                  )
                })}
              </div>
            )}

            {section.bullets && (
              <ul className="mt-9 grid max-w-4xl gap-3 sm:grid-cols-2">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.025] p-4 text-sm leading-6 text-slate-300">
                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-cyan-300" />{bullet}
                  </li>
                ))}
              </ul>
            )}

            {section.link && <ExternalLink {...section.link} />}
          </div>
        </section>
      ))}
    </>
  )
}
