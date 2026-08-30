import { site } from '../content/site'

export function pageMeta(title: string, description: string, path: string) {
  const fullTitle = `${title} — ${site.name}`
  const url = `${site.origin}${path}`

  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: site.name },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
  ]
}
