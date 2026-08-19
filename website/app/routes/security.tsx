import { ContentPage } from '../components/content-page'
import { pages } from '../content/site'
import { pageMeta } from '../lib/meta'
import type { Route } from './+types/security'

export const meta: Route.MetaFunction = () => pageMeta(pages.security.title, pages.security.lead, '/security')
export default function Security() { return <ContentPage slug="security" /> }
