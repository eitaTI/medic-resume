import path from 'node:path'
import { expect, test } from '@playwright/test'
import { ADMIN_EMAIL, ADMIN_SENHA, FIXTURE_LOGO, loginComoAdmin } from './helpers'

test.describe('Branding (admin)', () => {
  test.beforeEach(async ({ page }) => {
    await loginComoAdmin(page)
    await page.goto('/admin/branding')
  })

  test('faz upload de um slot e restaura o padrão', async ({ page }) => {
    const arquivo = path.join(FIXTURE_LOGO)

    await page.locator('input[name="arquivo"]').first().setInputFiles(arquivo)
    await page.getByRole('button', { name: 'Salvar', exact: true }).first().click()
    await expect(page.getByText('Salvo com sucesso.').first()).toBeVisible()

    await page.getByRole('button', { name: 'Restaurar Padrão', exact: true }).first().click()
    await expect(page.getByText('Padrão restaurado.').first()).toBeVisible()
  })

  test('upload de tipo não permitido é rejeitado', async ({ page }) => {
    // Cria um arquivo .txt temporário para violar ALLOWED_TYPES
    const txt = path.join(path.dirname(FIXTURE_LOGO), 'nao-permitido.txt')
    const fs = await import('node:fs/promises')
    await fs.writeFile(txt, 'conteudo invalido')

    await page.locator('input[name="arquivo"]').first().setInputFiles(txt)
    await page.getByRole('button', { name: 'Salvar', exact: true }).first().click()
    await expect(page.getByText(/Tipo não suportado/).first()).toBeVisible()

    await fs.unlink(txt)
  })
})
