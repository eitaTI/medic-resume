import path from 'node:path'
import { type Page } from '@playwright/test'

export const ADMIN_EMAIL = 'admin@eitati.com'
export const ADMIN_SENHA = 'admin123'

export const FIXTURE_LOGO = path.join(__dirname, '../fixtures/logo.png')

/**
 * Preenche o wizard de 4 passos e envia o formulário público.
 * Usa a opção "Tópicos de conteúdo" (sem upload de PDF) para evitar
 * dependência de inputs de arquivo ocultos e de rede (Consulta CEP).
 * `identificador` deve ser único por execução — vira parte do nome do
 * titular/clínica, permitindo localizar a submissão no painel admin.
 */
export async function preencherEEnviarFormulario(page: Page, identificador: string) {
  const id = identificador.toLowerCase()

  await page.goto('/formulario')

  // Passo 0 — Titular
  await page.getByLabel('Nome do Titular (completo)').fill(`${identificador} Titular da Silva`)
  await page.getByLabel('Email do Titular').fill(`titular-${id}@exemplo.com`)
  await page.getByLabel('Celular para contato (whatsapp)').fill('62999998888')
  await page.getByLabel('CPF do Titular').fill('12345678901')
  // "Será em CNPJ de Empresa?" → Não (revela CEP/Endereço)
  await page.getByRole('button', { name: 'Não', exact: true }).first().click()
  await page.locator('input[name="cepClinica"]').fill('00000000')
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
    .getByText('Possui Tópicos de conteúdo?')
    .locator('xpath=..')
    .getByRole('button', { name: 'Sim', exact: true })
    .click()
  await page.getByLabel('Tópicos de conteúdo').fill('Topico1 - Topico2')
  await page.getByLabel('Cabeçalho do Laudo').fill(`Cabecalho ${identificador}`)
  await page.getByLabel('Rodapé do Laudo').fill(`Rodape ${identificador}`)
  await page.getByRole('button', { name: 'Próximo →', exact: true }).click()

  // Passo 3 — Equipamentos
  await page.getByLabel('Tipo').fill(`Tipo ${identificador}`)
  await page.getByLabel('Marca').fill('MarcaX')
  await page.getByLabel('Modelo').fill('ModeloY')
  await page.getByLabel('Nº de Série').fill('SN123')
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
