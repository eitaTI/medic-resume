import { describe, it, expect } from 'vitest'
import {
  schemaClinica,
  schemaMedico,
  schemaExame,
  schemaDispositivo,
  schemaFormulario,
} from '@/lib/validacoes'

describe('schemaClinica', () => {
  it('aceita dados válidos', () => {
    const r = schemaClinica.safeParse({
      nomeClinica: 'Clínica Teste',
      nomeTitular: 'Titular Completo da Silva',
      emailTitular: 'titular@clinica.com',
      celularTitular: '11999998888',
      documentoTitular: '12345678901',
      cnpjEmpresa: '12345678000195',
      quantidadeMedicos: 2,
    })
    expect(r.success).toBe(true)
  })

  it('faz coerção de quantidadeMedicos (string -> number)', () => {
    const r = schemaClinica.safeParse({
      nomeClinica: 'Clínica Teste',
      nomeTitular: 'Titular Completo da Silva',
      emailTitular: 'titular@clinica.com',
      celularTitular: '11999998888',
      documentoTitular: '12345678901',
      quantidadeMedicos: '3',
    })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.quantidadeMedicos).toBe(3)
  })

  it('rejeita nome do titular curto', () => {
    const r = schemaClinica.safeParse({
      nomeClinica: 'Clínica',
      nomeTitular: 'Curto',
      emailTitular: 'a@b.com',
      celularTitular: '11999998888',
      documentoTitular: '12345678901',
    })
    expect(r.success).toBe(false)
  })

  it('rejeita celular com quantidade de dígitos inválida', () => {
    const r = schemaClinica.safeParse({
      nomeClinica: 'Clínica',
      nomeTitular: 'Titular Completo da Silva',
      emailTitular: 'a@b.com',
      celularTitular: '119999',
      documentoTitular: '12345678901',
    })
    expect(r.success).toBe(false)
  })

  it('rejeita CNPJ com tamanho inválido', () => {
    const r = schemaClinica.safeParse({
      nomeClinica: 'Clínica',
      nomeTitular: 'Titular Completo da Silva',
      emailTitular: 'a@b.com',
      celularTitular: '11999998888',
      documentoTitular: '12345678901',
      cnpjEmpresa: '123',
    })
    expect(r.success).toBe(false)
  })

  it('aceita CNPJ vazio (pessoa física)', () => {
    const r = schemaClinica.safeParse({
      nomeClinica: 'Clínica',
      nomeTitular: 'Titular Completo da Silva',
      emailTitular: 'a@b.com',
      celularTitular: '11999998888',
      documentoTitular: '12345678901',
      cnpjEmpresa: '',
    })
    expect(r.success).toBe(true)
  })
})

describe('schemaMedico', () => {
  it('aceita dados válidos', () => {
    expect(
      schemaMedico.safeParse({ nome: 'Dr. A', documento: '123', email: 'a@b.com' }).success,
    ).toBe(true)
  })
  it('rejeita email inválido', () => {
    expect(
      schemaMedico.safeParse({ nome: 'Dr. A', documento: '123', email: 'invalido' }).success,
    ).toBe(false)
  })
})

describe('schemaExame', () => {
  it('requer apenas o nome', () => {
    expect(schemaExame.safeParse({ nome: 'Raio-X' }).success).toBe(true)
  })
})

describe('schemaDispositivo', () => {
  it('aceita dados válidos', () => {
    expect(
      schemaDispositivo.safeParse({
        tipo: 'Ultrassom',
        marca: 'Marca',
        modelo: 'X1',
        numeroSerie: 'SN1',
      }).success,
    ).toBe(true)
  })
})

describe('schemaFormulario (agregado client-side)', () => {
  const base = {
    nomeTitular: 'Titular Completo da Silva',
    emailTitular: 'titular@clinica.com',
    celularTitular: '11999998888',
    documentoTitular: '12345678901',
    cepClinica: '12345678',
    enderecoClinica: 'Rua A, 1',
    cabecalhoLaudo: 'Cabeçalho',
    rodapeLaudo: 'Rodapé',
    quantidadeMedicos: 1,
    usuarios: [{ nome: 'Dr. A', documento: '123', email: 'a@b.com', tipo: 'examinador', temAssinatura: false }],
    equipamentos: [{ tipo: 'Ultrassom', marca: 'M', modelo: 'X', numeroSerie: 'SN' }],
  }

  it('aceita exame com laudo PDF (File)', () => {
    const r = schemaFormulario.safeParse({
      ...base,
      exames: [{ nome: 'Raio-X', temLaudo: true, laudo: new File([Buffer.from('x')], 'l.pdf') }],
    })
    expect(r.success).toBe(true)
  })

  it('aceita exame com tópicos', () => {
    const r = schemaFormulario.safeParse({
      ...base,
      exames: [{ nome: 'Raio-X', temTopicos: true, topicos: 'A - B - C' }],
    })
    expect(r.success).toBe(true)
  })

  it('rejeita exame sem laudo e sem tópicos (superRefine)', () => {
    const r = schemaFormulario.safeParse({
      ...base,
      exames: [{ nome: 'Raio-X' }],
    })
    expect(r.success).toBe(false)
  })

  it('rejeita laudo marcado mas não é arquivo', () => {
    const r = schemaFormulario.safeParse({
      ...base,
      exames: [{ nome: 'Raio-X', temLaudo: true, laudo: 'nao-e-arquivo' }],
    })
    expect(r.success).toBe(false)
  })

  it('rejeita sem usuários e sem equipamentos', () => {
    const r = schemaFormulario.safeParse({
      ...base,
      usuarios: [],
      equipamentos: [],
      exames: [{ nome: 'Raio-X', temTopicos: true, topicos: 'A' }],
    })
    expect(r.success).toBe(false)
  })
})
