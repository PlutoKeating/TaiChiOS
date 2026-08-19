import { ContentPage } from '../components/content-page'
import { pages } from '../content/site'
import { pageMeta } from '../lib/meta'
import type { Route } from './+types/architecture'

export const meta: Route.MetaFunction = () => pageMeta(pages.architecture.title, pages.architecture.lead, '/architecture')
export default function Architecture() { return <ContentPage slug="architecture" /> }
