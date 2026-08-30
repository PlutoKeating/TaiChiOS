import { configDefaults, defineConfig } from 'vitest/config'
import unyaml from '@cordisjs/unyaml/vite'

export default defineConfig({
  plugins: [unyaml()],
  test: {
    exclude: [...configDefaults.exclude, 'distribution/live/chroot/**', 'distribution/live/binary/**', 'artifacts/**', 'website/**'],
    pool: 'forks',
    execArgv: ['--expose-internals', '--import', 'tsx', '--import', '@cordisjs/unyaml'],
  },
})
