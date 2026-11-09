import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': root,
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/unit/**/*.test.ts', 'tests/api/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    // Cada arquivo usa seu próprio banco (`test-<pid>.db`, ver tests/setup.ts),
    // então o paralelismo por arquivo é seguro. Se um teste voltar a tocar um
    // caminho compartilhado, volte a `fileParallelism: false` antes de depurar.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['actions/**', 'lib/**', 'app/api/**'],
    },
  },
})
