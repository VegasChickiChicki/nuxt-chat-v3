import { resolve } from 'path'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig(
  {
    test: {
      globals: true,
      environment: 'nuxt',
      setupFiles: ['config/index.ts', 'vitest.setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['html']
		}
    },
    resolve: {
      alias: {
        '~': resolve(__dirname, '.'),
        '~/': resolve(__dirname, './'),
        '@': resolve(__dirname, '.'),
        '@/': resolve(__dirname, './')
      }
    }
  }
)
