import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('features', 'routes/features.tsx'),
  route('download', 'routes/download.tsx'),
  route('architecture', 'routes/architecture.tsx'),
  route('docs', 'routes/docs.tsx'),
  route('community', 'routes/community.tsx'),
  route('security', 'routes/security.tsx'),
  route('about', 'routes/about.tsx'),
] satisfies RouteConfig
