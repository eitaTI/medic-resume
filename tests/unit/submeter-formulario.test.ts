import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'

vi.mock('next/cache', () => ({ revalidatePath: () => {} }))

import { prisma } from '@/lib/prisma'
import { submeterFormulario } from '@/actions/submeter-formulario'
import { resetTestDb } from '@/tests/helpers/db'

function lerArquivoFixture(nome: string): File {
  const buf = fs.readFileSync(`${process.cwd()}/tests/fixtures/${nome}`)
  const ext = nome.split('.').pop()
  const type = ext === 'png' ? 'image/png' : 'application/pdf'
  return new File([buf], nome, { type })
}

function montarFormDataValido(): FormData {
  const fd = new FormData()
  fd.set('nomeClinica', 'Clínica Saúde LTDA')
  fd.set('cnpjEmpresa', '12345678000195')
  fd.set('nomeEmpresa', 'Empresa SA')
  fd.set('nomeTitular', 'Titular Completo da Silva')
  fd.set('emailTitular', 'titular@clinica.com')
  fd.set('celularTitular', '11999998888')
  fd.set('documentoTitular', '12345678901')
  fd.set('cepClinica', '12345678')
  fd.set('enderecoClinica', 'Rua das Flores, 100')
  fd.set('cabecalhoLaudo', 'Cabeçalho do laudo')
  fd.set('rodapeLaudo', 'Rodapé do laudo')
  fd.set('quantidadeMedicos', '1')

  fd.set('medicos[0].nome', 'Dr. Exame')
  fd.set('medicos[0].documento', '12345678901')
  fd.set('medicos[0].email', 'medico@clinica.com')
  fd.set('medicos[0].tipo', 'examinador')
  fd.set('medicos[0].assinatura', lerArquivoFixture('logo.png'))

  fd.set('exames[0].nome', 'Raio-X de Tórax')
  fd.set('exames[0].laudo', lerArquivoFixture('laudo.pdf'))

  fd.set('dispositivos[0].tipo', 'Ultrassom')
  fd.set('dispositivos[0].marca', 'MarcaX')
  fd.set('dispositivos[0].modelo', 'ModeloY')
  fd.set('dispositivos[0].numeroSerie', 'SN-001')

  fd.set('logo', lerArquivoFixture('logo.png'))
  return fd
}

describe('submeterFormulario (público)', () => {
  beforeAll(async () => {
    await resetTestDb()
  })

  it('cria a clínica com médicos, exames e dispositivos', async () => {
    const r = await submeterFormulario(montarFormDataValido())
    expect(r).toEqual({ sucesso: true })

    const clinica = await prisma.clinica.findFirst({
      where: { nomeClinica: 'Clínica Saúde LTDA' },
      include: { medicos: true, exames: true, dispositivos: true },
    })
    expect(clinica).toBeTruthy()
    expect(clinica?.medicos.length).toBe(1)
    expect(clinica?.exames.length).toBe(1)
    expect(clinica?.dispositivos.length).toBe(1)
    expect(clinica?.status).toBe('PENDENTE')
    expect(clinica?.logoPath).toContain('data/uploads/')
  })

  it('usa o nome do titular quando não há CNPJ', async () => {
    const fd = montarFormDataValido()
    fd.set('cnpjEmpresa', '')
    fd.set('nomeClinica', '')
    fd.set('nomeTitular', 'Titular Sem CNPJ da Silva')
    const r = await submeterFormulario(fd)
    expect(r).toEqual({ sucesso: true })
    const clinica = await prisma.clinica.findFirst({ orderBy: { id: 'desc' } })
    expect(clinica?.nomeClinica).toBe('Titular Sem CNPJ da Silva')
  })

  it('retorna erro quando dados obrigatórios faltam', async () => {
    const fd = montarFormDataValido()
    fd.delete('emailTitular')
    fd.set('emailTitular', 'invalido')
    const r = await submeterFormulario(fd)
    expect(r).toHaveProperty('erro')
  })

  it('retorna erro quando exame não tem nome', async () => {
    const fd = montarFormDataValido()
    fd.set('exames[0].nome', '')
    const r = await submeterFormulario(fd)
    expect(r).toHaveProperty('erro')
  })

  it('retorna erro quando exame não tem laudo nem tópicos (Gap 2)', async () => {
    const fd = montarFormDataValido()
    fd.delete('exames[0].laudo')
    const r = await submeterFormulario(fd)
    expect(r).toHaveProperty('erro', 'Cada exame precisa de um laudo (PDF) ou de tópicos de conteúdo.')
  })

  it('aceita exame somente com tópicos (Gap 2)', async () => {
    const fd = montarFormDataValido()
    fd.delete('exames[0].laudo')
    fd.set('exames[0].topicos', 'Tópico A - Tópico B')
    const r = await submeterFormulario(fd)
    expect(r).toEqual({ sucesso: true })
  })

  it('retorna erro quando o laudo não é PDF (Gap 2)', async () => {
    const fd = montarFormDataValido()
    fd.set('exames[0].laudo', lerArquivoFixture('logo.png'))
    const r = await submeterFormulario(fd)
    expect(r).toHaveProperty('erro', 'O laudo deve ser um arquivo PDF.')
  })

  it('respeita a quantidadeMedicos enviada pelo cliente (Gap 3)', async () => {
    const fd = montarFormDataValido()
    fd.set('quantidadeMedicos', '3')
    const r = await submeterFormulario(fd)
    expect(r).toEqual({ sucesso: true })
    const clinica = await prisma.clinica.findFirst({ orderBy: { id: 'desc' } })
    expect(clinica?.quantidadeMedicos).toBe(3)
  })
})
