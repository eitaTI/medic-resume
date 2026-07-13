import { z } from 'zod'

export const schemaClinica = z.object({
  nomeClinica: z.string().min(1, 'Nome da clínica é obrigatório'),
  nomeEmpresa: z.string().optional(),
  nomeTitular: z.string().min(1, 'Nome do titular é obrigatório'),
  emailTitular: z.string().email('Email do titular inválido'),
  celularTitular: z.string().optional(),
  documentoTitular: z.string().optional(),
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
})

export const schemaDispositivo = z.object({
  tipo: z.string().min(1, 'Tipo do dispositivo é obrigatório'),
  marca: z.string().min(1, 'Marca do dispositivo é obrigatório'),
  modelo: z.string().min(1, 'Modelo do dispositivo é obrigatório'),
  numeroSerie: z.string().min(1, 'Número de série do dispositivo é obrigatório'),
})

export const schemaFormulario = z.object({
  nomeClinica: z.string().min(1, 'Nome da clínica é obrigatório'),
  nomeEmpresa: z.string().optional(),
  nomeTitular: z.string().min(1, 'Nome do titular é obrigatório'),
  emailTitular: z.string().email('Email do titular inválido'),
  celularTitular: z.string().optional(),
  documentoTitular: z.string().optional(),
  cabecalhoLaudo: z.string().optional(),
  rodapeLaudo: z.string().optional(),
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
