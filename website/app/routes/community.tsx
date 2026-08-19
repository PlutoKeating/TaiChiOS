import { ContentPage } from '../components/content-page'
import { pages } from '../content/site'
import { pageMeta } from '../lib/meta'
import type { Route } from './+types/community'

export const meta: Route.MetaFunction = () => pageMeta(pages.community.title, pages.community.lead, '/community')
export default function Community() { return <ContentPage slug="community" /> }
