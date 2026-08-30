import { ContentPage } from '../components/content-page'
import { pages } from '../content/site'
import { pageMeta } from '../seo/meta'
import type { Route } from './+types/docs'

export const meta: Route.MetaFunction = () => pageMeta(pages.docs.title, pages.docs.lead, '/docs')
export default function Docs() { return <ContentPage slug="docs" /> }
