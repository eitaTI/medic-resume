import { expect, test } from '@playwright/test'
import { loginComoAdmin } from './helpers'

test.describe('Auditoria (admin)', () => {
  test('lista logs e filtra por ação LOGIN', async ({ page }) => {
    // O próprio login gera um registro LOGIN
    await loginComoAdmin(page)
    await page.goto('/admin/auditoria')

    await expect(page.getByText(/^LOGIN$/).first()).toBeVisible()

    await page.getByLabel('Ação').selectOption('LOGIN')
    await page.getByRole('button', { name: 'Filtrar', exact: true }).click()

    await expect(page.getByText(/^LOGIN$/).first()).toBeVisible()
  })
})
