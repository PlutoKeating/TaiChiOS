import { describe, expect, it } from 'vitest'
import { pages, primaryNavigation, secondaryNavigation } from './site'
import { pagesEn } from './site.en'
import { publicRoutes } from '../../react-router.config'
import { homeCopy } from '../i18n/home'

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

  it('describes release behavior without embedding a release version', () => {
    expect(pages.download.lead).toContain('GitHub')
    expect(pages.download.accent).toContain('GitHub')
    expect(pagesEn.download.lead).toContain('GitHub')
    expect(pagesEn.download.accent).toContain('GitHub')
    expect(pages.download.sections[0].body).toContain('Live Shell')
    expect(pages.download.sections[0].body).toContain('用户登录页')
    expect(pagesEn.download.sections[0].body).toContain('Live shell')
    expect(pagesEn.download.sections[0].body).toContain('user login page')
    const staticCopy = JSON.stringify({ pages, pagesEn, homeCopy })
    expect(staticCopy).not.toMatch(/v\d+\.\d+\.\d+-mvp\.\d+/)
    expect(staticCopy).not.toMatch(/\b0\.1\b|MVP 候选|MVP candidate/i)
  })
})
