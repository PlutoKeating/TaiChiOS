import { Link } from 'react-router'
import { useLanguage } from '../i18n/language'
import { ui } from '../i18n/ui'

export function Brand({ compact = false }: { compact?: boolean }) {
  const { locale } = useLanguage()
  return (
    <Link
      to="/"
      aria-label={`TaiChiOS ${ui[locale].home}`}
      className="group inline-flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="size-9 shrink-0 transition-transform duration-200 group-hover:rotate-6"
      >
        <defs>
          <linearGradient id="brand-ring" x1="6" y1="6" x2="42" y2="42">
            <stop stopColor="#a78bfa" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="#080b12" stroke="url(#brand-ring)" strokeWidth="2.5" />
        <path d="M24 4a10 10 0 0 1 0 20 10 10 0 0 0 0 20 20 20 0 0 0 0-40Z" fill="url(#brand-ring)" />
        <circle cx="24" cy="14" r="2.6" fill="#080b12" />
        <circle cx="24" cy="34" r="2.6" fill="#e8edf7" />
      </svg>
      <span className="flex items-baseline gap-1.5">
        <span className="text-lg font-semibold tracking-[-0.03em] text-white">TaiChi</span>
        <span className="font-mono text-xs font-medium tracking-[0.18em] text-cyan-300">OS</span>
      </span>
      {!compact && <span className="sr-only">AI-native operating system</span>}
    </Link>
  )
}

export function GitHubIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.58-.3-5.29-1.29-5.29-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18a10.92 10.92 0 0 1 5.76 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.09 0 4.42-2.72 5.39-5.31 5.68.42.36.79 1.07.79 2.16v3.25c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  )
}
