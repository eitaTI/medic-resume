import { expect, test } from '@playwright/test'
import { loginComoAdmin, preencherEEnviarFormulario } from './helpers'

async function criarSubmissaoPendente(page: import('@playwright/test').Page, id: string) {
  await preencherEEnviarFormulario(page, id)
  await loginComoAdmin(page)
  await page.goto('/admin')
  await page.getByRole('link', { name: new RegExp(id) }).first().click()
  await expect(page.getByRole('heading', { name: new RegExp(id) })).toBeVisible()
}

test.describe('Revisão de submissões (admin)', () => {
  test('aprova uma submissão pendente (Jira mockado falha → fail-open)', async ({ page }) => {
    const id = `aprovar${Date.now()}`
    await criarSubmissaoPendente(page, id)

    await page.getByRole('button', { name: 'Aprovar', exact: true }).click()
    await expect(page.getByText('APROVADA').first()).toBeVisible()
    // Com JIRA_* dummy o card falha, mas o fluxo é fail-open:
    await expect(page.getByText(/Card Jira pendente|Aprovação concluída/)).toBeVisible()
  })

  test('sincroniza novamente exibe erro quando o Jira falha (fail-closed)', async ({ page }) => {
    const id = `sync${Date.now()}`
    await criarSubmissaoPendente(page, id)

    await page.getByRole('button', { name: 'Aprovar', exact: true }).click()
    await expect(page.getByText('APROVADA').first()).toBeVisible()

    await page.getByRole('button', { name: 'Sincronizar novamente', exact: true }).click()
    await expect(page.getByText('Erro ao sincronizar com o Jira')).toBeVisible()
  })

  test('rejeita uma submissão com motivo', async ({ page }) => {
    const id = `rejeitar${Date.now()}`
    await criarSubmissaoPendente(page, id)

    await page.getByRole('button', { name: 'Rejeitar', exact: true }).click()
    await page.getByPlaceholder('Motivo da rejeição...').fill('Documentação incompleta.')
    await page.getByRole('button', { name: 'Confirmar Rejeição', exact: true }).click()
    await expect(page.getByText('REJEITADA').first()).toBeVisible()
  })
})
