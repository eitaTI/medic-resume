import { z } from "zod"

export const clinicaSchema = z.object({
  nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório"),
  nomeClinica: z.string().min(1, "Nome da clínica é obrigatório"),
  nomeTitular: z.string().min(1, "Nome do titular é obrigatório"),
  emailTitular: z.string().email("Email inválido"),
  quantidadeMedicos: z.number().min(1, "Pelo menos 1 médico"),
})

export const medicoSchema = z.object({
  nome: z.string().min(1, "Nome do médico é obrigatório"),
  documento: z.string().min(1, "Documento é obrigatório"),
  email: z.string().email("Email inválido"),
})

export const exameSchema = z.object({
  nome: z.string().min(1, "Nome do exame é obrigatório"),
})

export const dispositivoSchema = z.object({
  tipo: z.string().min(1, "Tipo é obrigatório"),
  marca: z.string().min(1, "Marca é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  numeroSerie: z.string().min(1, "Número de série é obrigatório"),
})

export type DadosClinica = z.output<typeof clinicaSchema>
export type Medico = z.output<typeof medicoSchema>
export type Exame = z.output<typeof exameSchema>
export type Dispositivo = z.output<typeof dispositivoSchema>
