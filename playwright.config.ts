import { defineConfig, devices } from '@playwright/test'
import { E2E_DB } from './tests/e2e/global-setup'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Um único servidor de dev (Next.js em modo dev, com compilação on-demand)
  // é compartilhado por todos os testes. Rodar specs em paralelo causa contenção
  // e timeouts na compilação a frio da primeira requisição. Mantemos 1 worker
  // localmente e também no CI para estabilidade.
  workers: 1,
  timeout: 90_000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  globalSetup: './tests/e2e/global-setup.ts',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Usa um banco isolado (e2e.db) para não destruir o dev.db do desenvolvedor.
    // O globalSetup popula esse banco (schema + seed do admin) antes de subir o servidor.
    command: 'pnpm dev',
    env: { DATABASE_URL: E2E_DB },
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
