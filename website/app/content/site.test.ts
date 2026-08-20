import { describe, expect, it } from 'vitest'
import { pages, primaryNavigation, secondaryNavigation } from './site'
import { pagesEn } from './site.en'
import { publicRoutes } from '../../react-router.config'

describe('website information architecture', () => {
  it('keeps every public content route in navigation and prerendering', () => {
    const navigationRoutes = [...primaryNavigation, ...secondaryNavigation].map((item) => item.href)
    expect(publicRoutes).toEqual(['/', ...navigationRoutes])
  })

  it('ships matching complete Chinese and English pages', () => {
    expect(Object.keys(pagesEn)).toEqual(Object.keys(pages))
    for (const slug of Object.keys(pages)) {
      expect(pages[slug].sections.length).toBeGreaterThan(0)
      expect(pagesEn[slug].sections).toHaveLength(pages[slug].sections.length)
      expect(pagesEn[slug].title).not.toBe(pages[slug].title)
    }
  })

  it('offers the prerelease without claiming it is stable', () => {
    expect(pages.download.lead).toContain('v0.1.0-mvp.3')
    expect(pages.download.accent).toContain('不是稳定版')
    expect(pagesEn.download.lead).toContain('v0.1.0-mvp.3')
    expect(pagesEn.download.accent).toContain('not stable')
    expect(pages.download.sections.at(-1)?.link?.href).toContain('/releases/tag/v0.1.0-mvp.3')
    expect(pagesEn.download.sections.at(-1)?.link?.href).toContain('/releases/tag/v0.1.0-mvp.3')
  })
})
