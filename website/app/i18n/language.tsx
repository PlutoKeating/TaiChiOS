import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Locale = 'zh' | 'en'

type LanguageContextValue = {
  locale: Locale
  toggleLocale: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)
const storageKey = 'taichios-locale'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('zh')

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)
    if (saved === 'zh' || saved === 'en') setLocale(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    window.localStorage.setItem(storageKey, locale)
  }, [locale])

  const value = useMemo(
    () => ({ locale, toggleLocale: () => setLocale((current) => (current === 'zh' ? 'en' : 'zh')) }),
    [locale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}

export function useLocalizedDocument(title: string, description: string) {
  useEffect(() => {
    document.title = title
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) meta.content = description
  }, [title, description])
}
