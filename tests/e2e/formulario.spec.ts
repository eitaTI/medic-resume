import { expect, test } from '@playwright/test'
import { mockBrasilApi, preencherEEnviarFormulario, selecionarVendedorETipo } from './helpers'

test.describe('Formulário público (wizard)', () => {
  test('validação client-side bloqueia avanço com passo 0 vazio', async ({ page }) => {
    await page.goto('/formulario')
    await page.getByRole('button', { name: 'Próximo →', exact: true }).click()
    await expect(
      page.getByText('O nome completo do titular deve ter no mínimo 10 caracteres'),
    ).toBeVisible()
    await expect(page).toHaveURL(/\/formulario$/)
  })

  test('preenche os 5 passos e envia com sucesso', async ({ page }) => {
    const id = `form${Date.now()}`
    await preencherEEnviarFormulario(page, id)
    await expect(page.getByRole('heading', { name: 'Cadastro enviado com sucesso!' })).toBeVisible()
  })

  test('envia exame com modelo padrão sem PDF nem títulos', async ({ page }) => {
    const id = `mod${Date.now()}`
    const slug = id.toLowerCase()

    await mockBrasilApi(page)
    await page.goto('/formulario')

    await selecionarVendedorETipo(page)
    await page.getByLabel('Nome do Titular (completo)').fill(`${id} Titular da Silva`)
    await page.getByLabel('Email do Titular').fill(`titular-${slug}@exemplo.com`)
    await page.getByLabel('Celular para contato (whatsapp)').fill('62999998888')
    await page.getByLabel('CPF do Titular').fill('12345678901')
    await page.getByRole('button', { name: 'Não', exact: true }).first().click()
    await page.locator('input[name="cepClinica"]').fill('00000000')
    await page.getByRole('button', { name: 'Editar Endereço' }).click()
    await page.locator('input[name="enderecoClinica"]').fill(`Rua Exemplo, 123 - ${id}`)
    await page.getByRole('button', { name: 'Próximo →', exact: true }).click()

    await page.getByLabel('Nome completo').fill(`${id} Dr. Medico`)
    await page.getByLabel('Documento (CRM/CPF)').fill('CRM123456')
    await page.getByLabel('Email').fill(`medico-${slug}@exemplo.com`)
    await page.getByRole('button', { name: 'Próximo →', exact: true }).click()

    await page.getByLabel('Nome do Exame').fill(`Exame ${id}`)
    await page.getByRole('button', { name: 'Concordo em utilizar o modelo padrão do sistema' }).click()
    await page.getByLabel('Cabeçalho do Laudo').fill(`Cabecalho ${id}`)
    await page.getByLabel('Rodapé do Laudo').fill(`Rodape ${id}`)
    await page.getByRole('button', { name: 'Próximo →', exact: true }).click()

    await page.getByLabel('Tipo').fill(`Tipo ${id}`)
    await page.getByLabel('Marca').fill('MarcaX')
    await page.getByLabel('Modelo').fill('ModeloY')
    await page.getByLabel('Nº de Série').fill('SN123')
    await page.getByRole('button', { name: 'Próximo →', exact: true }).click()

    await page.getByRole('checkbox', { name: 'Estou ciente dos requisitos do computador e entendo que, caso não atendidos, podem ocorrer problemas em geral.' }).click()
    await page.getByRole('checkbox', { name: 'Li o resumo acima (e posso ler os detalhes) e estou ciente dos problemas que podem ocorrer caso o computador esteja abaixo dos requisitos.' }).click()
    await page.getByRole('checkbox', { name: 'Autorizo o uso dos dados enviados neste cadastro (incluindo a leitura automática do aparelho acima) para análise e implantação do sistema.' }).click()
    await page.getByRole('button', { name: 'Enviar Cadastro', exact: true }).click()

    await expect(page.getByRole('heading', { name: 'Cadastro enviado com sucesso!' })).toBeVisible()
  })
})
