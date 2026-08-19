import { useLanguage } from '../i18n/language'

const layersZh = [
  ['INTERFACES', 'Shell · TUI · WebView'],
  ['AGENT RUNTIME', 'DeepSeek Harness'],
  ['CONTROL PLANE', 'Identity · Policy · Provider'],
  ['COMPOSITION', 'Cordis Context · Service · Fiber'],
  ['EXECUTION', 'Broker · Sandbox · Audit'],
  ['FOUNDATION', 'Debian · systemd · Linux'],
]

const layersEn = [
  ['INTERFACES', 'Shell · TUI · WebView'],
  ['AGENT RUNTIME', 'DeepSeek Harness'],
  ['CONTROL PLANE', 'Identity · Policy · Provider'],
  ['COMPOSITION', 'Cordis Context · Service · Fiber'],
  ['EXECUTION', 'Broker · Sandbox · Audit'],
  ['FOUNDATION', 'Debian · systemd · Linux'],
]

export function SystemMap() {
  const { locale } = useLanguage()
  const layers = locale === 'zh' ? layersZh : layersEn
  return (
    <div className="system-map" aria-label={locale === 'zh' ? 'TaiChiOS 六层系统架构' : 'TaiChiOS six-layer system architecture'}>
      <div className="system-map-halo" aria-hidden="true" />
      <div className="system-map-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="presentation">
          <defs>
            <linearGradient id="system-map-ring" x1="5" y1="5" x2="43" y2="43">
              <stop stopColor="#a78bfa" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="21" fill="#080b12" stroke="url(#system-map-ring)" strokeWidth="1.4" />
          <path d="M24 3a10.5 10.5 0 0 1 0 21 10.5 10.5 0 0 0 0 21 21 21 0 0 0 0-42Z" fill="url(#system-map-ring)" />
          <circle cx="24" cy="13.5" r="2.7" fill="#080b12" />
          <circle cx="24" cy="34.5" r="2.7" fill="#eef2ff" />
        </svg>
      </div>
      <div className="system-map-layers">
        {layers.map(([label, name], index) => (
          <div className="system-layer" key={label}>
            <span className="font-mono text-[0.65rem] tracking-[0.18em] text-cyan-300/80">{String(index + 1).padStart(2, '0')} · {label}</span>
            <span className="mt-1 text-sm font-medium text-slate-200">{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
