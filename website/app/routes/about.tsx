import { ContentPage } from '../components/content-page'
import { pages } from '../content/site'
import { pageMeta } from '../seo/meta'
import type { Route } from './+types/about'

export const meta: Route.MetaFunction = () => pageMeta(pages.about.title, pages.about.lead, '/about')
export default function About() { return <ContentPage slug="about" /> }
