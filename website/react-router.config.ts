import type { Config } from '@react-router/dev/config'

export const publicRoutes = [
  '/',
  '/features',
  '/download',
  '/architecture',
  '/docs',
  '/community',
  '/security',
  '/about',
]

export default {
  ssr: false,
  prerender: publicRoutes,
} satisfies Config
