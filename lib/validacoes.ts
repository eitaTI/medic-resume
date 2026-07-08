import { z } from 'zod'

export const schemaClinica = z.object({
  nomeEmpresa: z.string().min(1, 'Nome da empresa é obrigatório'),
  nomeClinica: z.string().min(1, 'Nome da clínica é obrigatório'),
  nomeTitular: z.string().min(1, 'Nome do titular é obrigatório'),
  emailTitular: z.string().email('Email do titular inválido'),
  quantidadeMedicos: z.number().min(1, 'Quantidade de médicos deve ser no mínimo 1'),
})

export const schemaMedico = z.object({
  nome: z.string().min(1, 'Nome do médico é obrigatório'),
  documento: z.string().min(1, 'Documento do médico é obrigatório'),
  email: z.string().email('Email do médico inválido'),
})

export const schemaExame = z.object({
  nome: z.string().min(1, 'Nome do exame é obrigatório'),
})

export const schemaDispositivo = z.object({
  tipo: z.string().min(1, 'Tipo do dispositivo é obrigatório'),
  marca: z.string().min(1, 'Marca do dispositivo é obrigatório'),
  modelo: z.string().min(1, 'Modelo do dispositivo é obrigatório'),
  numeroSerie: z.string().min(1, 'Número de série do dispositivo é obrigatório'),
})
