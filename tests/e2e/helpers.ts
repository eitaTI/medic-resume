import path from 'node:path'
import { expect, type Page } from '@playwright/test'

export const ADMIN_EMAIL = 'admin@eitati.com'
export const ADMIN_SENHA = 'admin123'

export const FIXTURE_LOGO = path.join(__dirname, '../fixtures/logo.png')

/**
 * Mocka a BrasilAPI (CEP + CNPJ) para respostas determinísticas offline.
 * O CEP `00000000` retorna 404 de verdade (a BrasilAPI não o conhece) — sem
 * mock, o teste depende de rede e falha fora dela.
 */
export async function mockBrasilApi(page: Page) {
  await page.route('https://brasilapi.com.br/api/cep/v2/00000000', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        cep: '00000000',
        street: 'Rua Exemplo',
        neighborhood: 'Centro',
        city: 'Goiânia',
        state: 'GO',
      }),
    }),
  )
  await page.route('https://brasilapi.com.br/api/cnpj/v1/*', (route) =>
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'CNPJ não encontrado (mock E2E)' }),
    }),
  )
}

/**
 * Seleciona vendedor + tipo de processo com retry: as opções chegam via
 * `/api/opcoes-cadastro` (assíncrono) e podem re-renderizar após o 1º select.
 */
export async function selecionarVendedorETipo(page: Page) {
  const vendedor = page.getByLabel('Vendedor responsável')
  await vendedor.locator('option[value="Alyson Alves"]').waitFor({ state: 'attached' })
  await expect(async () => {
    await vendedor.selectOption('Alyson Alves')
    expect(await vendedor.inputValue()).toBe('Alyson Alves')
  }).toPass({ timeout: 10_000 })
  const tipo = page.getByLabel('Tipo de processo')
  await tipo.locator('option[value="Implantação nova Zscan"]').waitFor({ state: 'attached' })
  await expect(async () => {
    await tipo.selectOption('Implantação nova Zscan')
    expect(await tipo.inputValue()).toBe('Implantação nova Zscan')
  }).toPass({ timeout: 10_000 })
}

/**
 * Preenche o wizard de 5 passos e envia o formulário público.
 * Depende de `mockBrasilApi(page)` antes do `goto` para não depender de rede.
 * `identificador` deve ser único por execução — vira parte do nome do
 * titular/clínica, permitindo localizar a submissão no painel admin.
 */
export async function preencherEEnviarFormulario(page: Page, identificador: string) {
  const id = identificador.toLowerCase()

  await mockBrasilApi(page)
  await page.goto('/formulario')

  await selecionarVendedorETipo(page)
  await page.getByLabel('Nome do Titular (completo)').fill(`${identificador} Titular da Silva`)
  await page.getByLabel('Email do Titular').fill(`titular-${id}@exemplo.com`)
  await page.getByLabel('Celular para contato (whatsapp)').fill('62999998888')
  await page.getByLabel('CPF do Titular').fill('12345678901')
  // "Será em CNPJ de Empresa?" → Não (revela CEP/Endereço)
  await page.getByRole('button', { name: 'Não', exact: true }).first().click()
  await page.locator('input[name="cepClinica"]').fill('00000000')
  // O mock de CEP preenche o endereço e o campo trava (lápis) — o clique no
  // lápis é obrigatório (isVisible não basta: o botão pode estar no DOM mas
  // fora do viewport do teste).
  await page.getByRole('button', { name: 'Editar Endereço' }).click()
  await page.locator('input[name="enderecoClinica"]').fill(`Rua Exemplo, 123 - ${identificador}`)
  await page.getByRole('button', { name: 'Próximo →', exact: true }).click()

  // Passo 1 — Usuários
  await page.getByLabel('Nome completo').fill(`${identificador} Dr. Medico`)
  await page.getByLabel('Documento (CRM/CPF)').fill('CRM123456')
  await page.getByLabel('Email').fill(`medico-${id}@exemplo.com`)
  await page.getByRole('button', { name: 'Próximo →', exact: true }).click()

  // Passo 2 — Exames
  await page.getByLabel('Nome do Exame').fill(`Exame ${identificador}`)
  await page
    .getByText('Sabe os títulos (máscaras) das seções do laudo?')
    .locator('xpath=..')
    .getByRole('button', { name: 'Sim', exact: true })
    .click()
  await page.getByLabel('Títulos (máscaras) das seções do laudo').fill('Indicação - Esôfago - Estômago')
  await page.getByLabel('Cabeçalho do Laudo').fill(`Cabecalho ${identificador}`)
  await page.getByLabel('Rodapé do Laudo').fill(`Rodape ${identificador}`)
  await page.getByRole('button', { name: 'Próximo →', exact: true }).click()

  // Passo 3 — Equipamentos
  await page.getByLabel('Tipo').fill(`Tipo ${identificador}`)
  await page.getByLabel('Marca').fill('MarcaX')
  await page.getByLabel('Modelo').fill('ModeloY')
  await page.getByLabel('Nº de Série').fill('SN123')
  await page.getByRole('button', { name: 'Próximo →', exact: true }).click()

  // Passo 4 — Confirmações (aceita na hora; leitura do PC é indício automático)
  await expect(async () => {
    await page.getByRole('checkbox', { name: 'Estou ciente dos requisitos do computador e entendo que, caso não atendidos, podem ocorrer problemas em geral.' }).click()
    expect(await page.getByRole('checkbox', { name: 'Estou ciente dos requisitos do computador e entendo que, caso não atendidos, podem ocorrer problemas em geral.' }).getAttribute('aria-checked')).toBe('true')
  }).toPass({ timeout: 10_000 })
  await page.getByRole('checkbox', { name: 'Li o resumo acima (e posso ler os detalhes) e estou ciente dos problemas que podem ocorrer caso o computador esteja abaixo dos requisitos.' }).click()
  await page.getByRole('checkbox', { name: 'Autorizo o uso dos dados enviados neste cadastro (incluindo a leitura automática do aparelho acima) para análise e implantação do sistema.' }).click()
  await page.getByRole('button', { name: 'Enviar Cadastro', exact: true }).click()

  await page.getByText('Cadastro enviado com sucesso!').waitFor()
}

export async function loginComoAdmin(page: Page) {
  await page.goto('/login')
  await page.getByLabel('E-mail').fill(ADMIN_EMAIL)
  await page.getByLabel('Senha').fill(ADMIN_SENHA)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await page.waitForURL('**/admin')
}
