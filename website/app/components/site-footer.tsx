import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { primaryNavigation, secondaryNavigation, site } from '../content/site'
import { useLanguage } from '../i18n/language'
import { ui } from '../i18n/ui'
import { Brand, GitHubIcon } from './brand'

export function SiteFooter() {
  const { locale } = useLanguage()
  const copy = ui[locale]
  const labelFor = (href: string) => ({
    '/features': copy.features,
    '/download': copy.download,
    '/architecture': copy.architecture,
    '/docs': copy.docs,
    '/community': copy.community,
    '/security': copy.security,
    '/about': copy.about,
  })[href]
  return (
    <footer className="border-t border-white/10 bg-[#05070c]">
      <div className="site-container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr] lg:py-16">
        <div className="max-w-md">
          <Brand compact />
          <p className="mt-5 text-sm leading-7 text-slate-400">{site.slogan}</p>
          <p className="mt-2 text-sm leading-7 text-slate-500">{locale === 'zh' ? '独立、开源、可组合、可恢复的 Debian 衍生操作系统。' : 'An independent, open, composable, and recoverable Debian derivative.'}</p>
        </div>
        <div>
          <h2 className="footer-heading">{copy.explore}</h2>
          <ul className="mt-4 grid gap-1">
            {primaryNavigation.map((item) => (
              <li key={item.href}><Link className="footer-link" to={item.href}>{labelFor(item.href)}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer-heading">{copy.project}</h2>
          <ul className="mt-4 grid gap-1">
            {secondaryNavigation.map((item) => (
              <li key={item.href}><Link className="footer-link" to={item.href}>{labelFor(item.href)}</Link></li>
            ))}
            <li>
              <a className="footer-link gap-2" href={site.repo} target="_blank" rel="noreferrer">
                <GitHubIcon className="size-4" /> {copy.github} <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/8">
        <div className="site-container flex flex-col gap-2 py-5 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {copy.copyright}</span>
          <span>{copy.officialDomain} · taichios.arr2018.dpdns.org</span>
        </div>
      </div>
    </footer>
  )
}
