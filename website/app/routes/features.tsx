import { ContentPage } from '../components/content-page'
import { pages } from '../content/site'
import { pageMeta } from '../lib/meta'
import type { Route } from './+types/features'

export const meta: Route.MetaFunction = () => pageMeta(pages.features.title, pages.features.lead, '/features')
export default function Features() { return <ContentPage slug="features" /> }
