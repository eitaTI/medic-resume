import { expect, test } from '@playwright/test'
import { preencherEEnviarFormulario } from './helpers'

test.describe('Formulário público (wizard)', () => {
  test('validação client-side bloqueia avanço com passo 0 vazio', async ({ page }) => {
    await page.goto('/formulario')
    await page.getByRole('button', { name: 'Próximo →', exact: true }).click()
    await expect(
      page.getByText('O nome completo do titular deve ter no mínimo 10 caracteres'),
    ).toBeVisible()
    await expect(page).toHaveURL(/\/formulario$/)
  })

  test('preenche os 4 passos e envia com sucesso', async ({ page }) => {
    const id = `form${Date.now()}`
    await preencherEEnviarFormulario(page, id)
    await expect(page.getByRole('heading', { name: 'Cadastro enviado com sucesso!' })).toBeVisible()
  })
})
