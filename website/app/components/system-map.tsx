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
      <div className="system-map-glow" aria-hidden="true" />
      {layers.map(([label, name], index) => (
        <div className="system-layer" key={label}>
          <span className="font-mono text-[0.65rem] tracking-[0.18em] text-cyan-300/80">{String(index + 1).padStart(2, '0')} · {label}</span>
          <span className="mt-1 text-sm font-medium text-slate-200">{name}</span>
        </div>
      ))}
    </div>
  )
}
