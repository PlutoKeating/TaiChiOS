import { useEffect } from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router'
import { SiteFooter } from './components/site-footer'
import { SiteHeader } from './components/site-header'
import { site } from './content/site'
import { LanguageProvider, useLanguage } from './i18n/language'
import { ui } from './i18n/ui'
import type { Route } from './+types/root'
import './app.css'

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'sitemap', href: '/sitemap.xml', type: 'application/xml' },
]

function RouteFocus() {
  const location = useLocation()
  useEffect(() => {
    document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true })
  }, [location.pathname])
  return null
}

export function Layout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: site.name,
    applicationCategory: 'OperatingSystem',
    operatingSystem: 'x86_64',
    url: site.origin,
    codeRepository: site.repo,
    license: 'https://www.apache.org/licenses/LICENSE-2.0',
    description: site.description,
  }

  return (
    <html lang="zh-CN" className="bg-[#080b12]">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#080b12" />
        <Meta />
        <Links />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body>
        <LanguageProvider>
          <LocalizedShell>{children}</LocalizedShell>
        </LanguageProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function LocalizedShell({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage()
  return (
    <>
      <a className="skip-link" href="#main-content">{ui[locale].skip}</a>
      {children}
    </>
  )
}

export default function App() {
  return (
    <div className="min-h-dvh overflow-x-clip bg-[#080b12] text-slate-100">
      <RouteFocus />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="outline-none"><Outlet /></main>
      <SiteFooter />
    </div>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404
  const { locale } = useLanguage()
  const copy = ui[locale]
  return (
    <main className="grid min-h-dvh place-items-center bg-[#080b12] px-5 text-slate-100">
      <div className="max-w-xl text-center">
        <p className="eyebrow">{notFound ? copy.notFoundEyebrow : copy.errorEyebrow}</p>
        <h1 className="display-title mt-6">{notFound ? copy.notFoundTitle : copy.errorTitle}</h1>
        <p className="lead mt-6">{notFound ? copy.notFoundBody : copy.errorBody}</p>
        <NavLink className="button-primary mt-8" to="/">{copy.backHome}</NavLink>
      </div>
    </main>
  )
}
