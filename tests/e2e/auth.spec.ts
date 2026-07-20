import { expect, test } from '@playwright/test'
import { ADMIN_EMAIL, ADMIN_SENHA, loginComoAdmin } from './helpers'

test.describe('Autenticação e guardas', () => {
  test('"/" redireciona para "/formulario"', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL('**/formulario')
    await expect(page.getByText('Cadastro da Clínica')).toBeVisible()
  })

  test('acesso a "/admin" sem sessão redireciona para "/login"', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForURL('**/login')
    await expect(page.getByRole('heading', { name: 'Login Admin' })).toBeVisible()
  })

  test('login com credenciais inválidas exibe erro', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill(ADMIN_EMAIL)
    await page.getByLabel('Senha').fill('senha-errada')
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page.getByText('Credenciais inválidas')).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('login válido navega para "/admin"', async ({ page }) => {
    await loginComoAdmin(page)
    await expect(page.getByRole('heading', { name: 'Submissões' })).toBeVisible()
  })

  test('logout retorna para "/login"', async ({ page }) => {
    await loginComoAdmin(page)
    page.on('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Sair', exact: true }).click()
    await page.waitForURL('**/login')
  })
})
