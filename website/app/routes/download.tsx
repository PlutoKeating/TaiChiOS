import { ContentPage } from '../components/content-page'
import { pages } from '../content/site'
import { pageMeta } from '../seo/meta'
import type { Route } from './+types/download'

export const meta: Route.MetaFunction = () => pageMeta(pages.download.title, pages.download.lead, '/download')
export default function Download() { return <ContentPage slug="download" /> }
