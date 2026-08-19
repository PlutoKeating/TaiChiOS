import { Languages, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { primaryNavigation, secondaryNavigation, site } from '../content/site'
import { useLanguage } from '../i18n/language'
import { ui } from '../i18n/ui'
import { Brand, GitHubIcon } from './brand'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
    isActive ? 'bg-white/8 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { locale, toggleLocale } = useLanguage()
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

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#080b12]/90 backdrop-blur-xl">
      <div className="site-container flex min-h-18 items-center justify-between gap-4 py-3">
        <Brand />

        <nav aria-label={copy.navigation} className="hidden items-center gap-1 lg:flex">
          {primaryNavigation.map((item) => (
            <NavLink key={item.href} to={item.href} className={navClass}>
              {labelFor(item.href)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <span className="status-pill"><span className="status-dot" />0.1 MVP</span>
          <button type="button" className="language-button" onClick={toggleLocale} aria-label={copy.languageAction} title={copy.languageAction}>
            <Languages aria-hidden="true" className="size-4" /><span>{copy.languageShort}</span>
          </button>
          <a className="icon-button inline-flex" href={site.repo} target="_blank" rel="noreferrer" aria-label={copy.githubLabel}>
            <GitHubIcon />
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button type="button" className="language-button" onClick={toggleLocale} aria-label={copy.languageAction} title={copy.languageAction}>
            <Languages aria-hidden="true" className="size-4" /><span>{copy.languageShort}</span>
          </button>
          <button
            type="button"
            className="icon-button inline-flex"
            aria-label={open ? copy.closeMenu : copy.openMenu}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-navigation" aria-label={copy.mobileNavigation} className="border-t border-white/8 bg-[#080b12] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-1 sm:grid-cols-2">
            {[...primaryNavigation, ...secondaryNavigation].map((item) => (
              <NavLink key={item.href} to={item.href} className={navClass}>
                {labelFor(item.href)}
              </NavLink>
            ))}
            <a href={site.repo} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">
              <GitHubIcon className="size-4" /> {copy.github}
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
