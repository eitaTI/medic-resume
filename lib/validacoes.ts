import { z } from 'zod'

export const schemaClinica = z.object({
  nomeClinica: z.string().min(1, 'Nome da clínica é obrigatório'),
  nomeEmpresa: z.string().optional(),
  nomeTitular: z.string().min(10, 'O nome completo do titular deve ter no mínimo 10 caracteres'),
  emailTitular: z.string().email('Email do titular inválido'),
  celularTitular: z.string().refine((val) => val.replace(/\D/g, '').length === 11, 'Celular deve ser preenchido integralmente'),
  documentoTitular: z.string().refine((val) => val.replace(/\D/g, '').length === 11, 'CPF do titular deve ser preenchido integralmente'),
  cnpjEmpresa: z.string().optional().refine((val) => !val || val.replace(/\D/g, '').length === 14, 'CNPJ deve ser preenchido integralmente'),
  cepClinica: z.string().optional(),
  enderecoClinica: z.string().optional(),
  possuiCnpj: z.boolean().optional(),
  quantidadeMedicos: z.coerce.number().int().min(1, 'Informe ao menos 1 médico').default(1),
})

export const schemaMedico = z.object({
  nome: z.string().min(1, 'Nome do usuário é obrigatório'),
  documento: z.string().min(1, 'Documento do usuário é obrigatório'),
  email: z.string().email('Email do usuário inválido'),
  tipo: z.enum(['examinador', 'solicitante', 'recepcao']).optional(),
})

export const schemaExame = z.object({
  nome: z.string().min(1, 'Nome do exame é obrigatório'),
  temLaudo: z.boolean().optional(),
})

export const schemaDispositivo = z.object({
  tipo: z.string().min(1, 'Tipo do dispositivo é obrigatório'),
  marca: z.string().min(1, 'Marca do dispositivo é obrigatório'),
  modelo: z.string().min(1, 'Modelo do dispositivo é obrigatório'),
  numeroSerie: z.string().min(1, 'Número de série do dispositivo é obrigatório'),
})

export const schemaFormulario = z.object({
  nomeClinica: z.string().optional(),
  nomeEmpresa: z.string().optional(),
  nomeTitular: z.string().min(10, 'O nome completo do titular deve ter no mínimo 10 caracteres'),
  emailTitular: z.string().email('Email do titular inválido'),
  celularTitular: z.string().refine((val) => val.replace(/\D/g, '').length === 11, 'Celular deve ser preenchido integralmente'),
  documentoTitular: z.string().refine((val) => val.replace(/\D/g, '').length === 11, 'CPF do titular deve ser preenchido integralmente'),
  cnpjEmpresa: z.string().optional().refine((val) => !val || val.replace(/\D/g, '').length === 14, 'CNPJ deve ser preenchido integralmente'),
  cepClinica: z.string().refine((val) => val.replace(/\D/g, '').length === 8, 'CEP deve ser preenchido integralmente'),
  enderecoClinica: z.string().min(1, 'Endereço é obrigatório'),
  possuiCnpj: z.boolean().optional(),
  cabecalhoLaudo: z.string().min(1, 'Cabeçalho do laudo é obrigatório'),
  rodapeLaudo: z.string().min(1, 'Rodapé do laudo é obrigatório'),
  quantidadeMedicos: z.number().int().min(1, 'Informe ao menos 1 médico'),
  usuarios: z
    .array(
      z.object({
        nome: z.string().min(1, 'Nome do usuário é obrigatório'),
        documento: z.string().min(1, 'Documento do usuário é obrigatório'),
        email: z.string().email('Email do usuário inválido'),
        tipo: z.enum(['examinador', 'solicitante', 'recepcao']).optional(),
        temAssinatura: z.boolean(),
      }),
    )
    .min(1),
  exames: z
    .array(
      z.object({
        nome: z.string().min(1, 'Nome do exame é obrigatório'),
        temLaudo: z.boolean().optional(),
      }),
    )
    .min(1),
  equipamentos: z
    .array(
      z.object({
        tipo: z.string().min(1, 'Tipo do dispositivo é obrigatório'),
        marca: z.string().min(1, 'Marca do dispositivo é obrigatório'),
        modelo: z.string().min(1, 'Modelo do dispositivo é obrigatório'),
        numeroSerie: z.string().min(1, 'Número de série do dispositivo é obrigatório'),
      }),
    )
    .min(1),
})

export type FormularioValues = z.infer<typeof schemaFormulario> & {
  logo?: File
  usuarios: (z.infer<typeof schemaFormulario.shape.usuarios.element> & {
    assinatura?: File
  })[]
  exames: (z.infer<typeof schemaFormulario.shape.exames.element> & {
    laudo?: File
  })[]
}
