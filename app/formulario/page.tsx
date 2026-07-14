'use client'

import Image from 'next/image'
import { useState, useActionState, useEffect, type CSSProperties } from 'react'
import { useFormStatus } from 'react-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stepper } from '@/components/wizard/Stepper'
import { StepClinica } from '@/components/wizard/StepClinica'
import { StepUsuarios } from '@/components/wizard/StepUsuarios'
import { StepExames } from '@/components/wizard/StepExames'
import { StepEquipamentos } from '@/components/wizard/StepEquipamentos'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { submeterFormulario } from '@/actions/submeter-formulario'
import { schemaFormulario } from '@/lib/validacoes'
import type { FormularioValues } from '@/lib/validacoes'
import { useDraftPersistence } from '@/hooks/useDraftPersistence'
import { useBranding } from '@/components/providers/BrandingProvider'
const LABELS = ['Clínica', 'Usuários', 'Exames', 'Equipamentos']

const defaultValues: FormularioValues = {
  nomeClinica: '',
  nomeEmpresa: '',
  nomeTitular: '',
  emailTitular: '',
  celularTitular: '',
  documentoTitular: '',
  cnpjEmpresa: '',
  cepClinica: '',
  enderecoClinica: '',
  cabecalhoLaudo: '',
  rodapeLaudo: '',
  quantidadeMedicos: 1,
  usuarios: [{ nome: '', documento: '', email: '', tipo: 'examinador', temAssinatura: false }],
  exames: [{ nome: '' }],
  equipamentos: [{ tipo: '', marca: '', modelo: '', numeroSerie: '' }],
}

export default function FormularioPage() {
  const branding = useBranding()
  const [passoAtual, setPassoAtual] = useState(0)

  const formMethods = useForm<FormularioValues>({
    resolver: zodResolver(schemaFormulario),
    defaultValues,
  })

  const { handleSubmit, getValues, reset, setFocus, watch } = formMethods

  useEffect(() => {
    const campos = {
      0: 'nomeClinica' as const,
      1: 'usuarios.0.nome' as const,
      2: 'cabecalhoLaudo' as const,
      3: 'equipamentos.0.tipo' as const,
    }
    const campo = campos[passoAtual as keyof typeof campos]
    setTimeout(() => setFocus(campo), 100)
  }, [passoAtual, setFocus])

  const { limparRascunho } = useDraftPersistence(watch, reset)

  const montarFormData = (): FormData => {
    const dados = getValues()
    const fd = new FormData()
    fd.append('nomeClinica', dados.nomeClinica || '')
    fd.append('nomeEmpresa', dados.nomeEmpresa || '')
    fd.append('nomeTitular', dados.nomeTitular || '')
    fd.append('emailTitular', dados.emailTitular || '')
    fd.append('celularTitular', dados.celularTitular || '')
    fd.append('documentoTitular', dados.documentoTitular || '')
    fd.append('cnpjEmpresa', dados.cnpjEmpresa || '')
    fd.append('cepClinica', dados.cepClinica || '')
    fd.append('enderecoClinica', dados.enderecoClinica || '')
    fd.append('cabecalhoLaudo', dados.cabecalhoLaudo || '')
    fd.append('rodapeLaudo', dados.rodapeLaudo || '')
    fd.append('quantidadeMedicos', String(dados.quantidadeMedicos ?? 1))

    const raw = dados as Record<string, unknown>
    const logoField = raw.logo
    if (logoField instanceof File) fd.append('logo', logoField)

    const usuariosArr = raw.usuarios as (Record<string, unknown> & { nome: string; documento: string; email: string; tipo?: string })[]
    usuariosArr.forEach((usuario, i) => {
      fd.append(`medicos[${i}].nome`, usuario.nome)
      fd.append(`medicos[${i}].documento`, usuario.documento)
      fd.append(`medicos[${i}].email`, usuario.email)
      fd.append(`medicos[${i}].tipo`, usuario.tipo || 'examinador')
      const ass = usuario.assinatura
      if (ass instanceof File) fd.append(`medicos[${i}].assinatura`, ass)
    })

    const examesArr = raw.exames as (Record<string, unknown> & { nome: string })[]
    examesArr.forEach((exame, i) => {
      fd.append(`exames[${i}].nome`, exame.nome)
      const laudoFile = exame.laudo
      if (laudoFile instanceof File) fd.append(`exames[${i}].laudo`, laudoFile)
    })

    dados.equipamentos.forEach((equipamento, i) => {
      fd.append(`dispositivos[${i}].tipo`, equipamento.tipo)
      fd.append(`dispositivos[${i}].marca`, equipamento.marca)
      fd.append(`dispositivos[${i}].modelo`, equipamento.modelo)
      fd.append(`dispositivos[${i}].numeroSerie`, equipamento.numeroSerie)
    })

    return fd
  }

  const [resultado, formAction, isPending] = useActionState(
    async () => {
      const res = await submeterFormulario(montarFormData())
      if (res && 'sucesso' in res) limparRascunho()
      return res
    },
    null,
  )

  const proximoPasso = async () => {
    const camposPorPasso: Record<number, (keyof FormularioValues)[]> = {
      0: ['nomeTitular', 'emailTitular', 'celularTitular', 'documentoTitular', 'cepClinica', 'enderecoClinica'],
      1: ['usuarios'],
      2: ['exames'],
      3: ['equipamentos'],
    }
    const campos = [...camposPorPasso[passoAtual]]
    if (passoAtual === 0 && getValues('possuiCnpj') === true) campos.push('cnpjEmpresa')
    const valido = await formMethods.trigger(campos)
    if (valido && passoAtual < 3) setPassoAtual(passoAtual + 1)
  }

  const passoAnterior = () => {
    if (passoAtual > 0) setPassoAtual(passoAtual - 1)
  }

  const sucesso = resultado && 'sucesso' in resultado

  if (sucesso) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-fixed transition-colors duration-300
          [background-image:var(--wp-light)] dark:[background-image:var(--wp-dark)]"
        style={{ '--wp-light': branding.wallpaperLight, '--wp-dark': branding.wallpaperDark } as CSSProperties}
      >
        <ThemeToggle />
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 text-center">
            <Image
              src={branding.logoLight}
              alt="EitaTI"
              width={93}
              height={40}
              className="block dark:hidden mx-auto mb-6"
              priority
            />
            <Image
              src={branding.logoDark}
              alt="EitaTI"
              width={93}
              height={40}
              className="hidden dark:block mx-auto mb-6"
              priority
            />
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-blue-600 dark:text-blue-400">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Cadastro enviado com sucesso!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Agradecemos pelo cadastro. Sua clínica será revisada em breve.
            </p>
            <Button onClick={resetarFormulario}>
              Novo Cadastro
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed transition-colors duration-300
        [background-image:var(--wp-light)] dark:[background-image:var(--wp-dark)]"
      style={{ '--wp-light': branding.wallpaperLight, '--wp-dark': branding.wallpaperDark } as CSSProperties}
    >
      <a
        href="/login"
        className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
          border border-gray-200 dark:border-gray-700
          shadow-lg hover:shadow-xl
          text-sm font-medium text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-700
          transition-all duration-200"
      >
        Admin
      </a>
      <ThemeToggle />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4 shrink-0">
              <Image
                src={branding.logoLight}
                alt="EitaTI"
                width={93}
                height={40}
                className="block dark:hidden"
                priority
              />
              <Image
                src={branding.logoDark}
                alt="EitaTI"
                width={93}
                height={40}
                className="hidden dark:block"
                priority
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Cadastro da Clínica
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Preencha os dados para cadastrar sua clínica
                </p>
              </div>
            </div>
          </div>

          <FormProvider {...formMethods}>
            <Stepper passoAtual={passoAtual} totalPassos={4} labels={LABELS} />

            <div className="mt-8">
              {passoAtual === 0 && <StepClinica />}
              {passoAtual === 1 && <StepUsuarios />}
              {passoAtual === 2 && <StepExames />}
              {passoAtual === 3 && <StepEquipamentos />}
            </div>

            {resultado && 'erro' in resultado && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {resultado.erro}
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <Button variante="secundario" onClick={passoAnterior} disabled={passoAtual === 0}>
                ← Anterior
              </Button>
              {passoAtual === 3 ? (
                <SubmitButton onClick={handleSubmit(() => formAction())} isPending={isPending} />
              ) : (
                <Button onClick={proximoPasso}>
                  Próximo →
                </Button>
              )}
            </div>
          </FormProvider>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Todos os dados são sigilosos conforme a LGPD.
        </p>
      </div>
    </div>
  )

  function resetarFormulario() {
    reset(defaultValues)
    limparRascunho()
    setPassoAtual(0)
  }
}

function SubmitButton({ onClick, isPending }: { onClick: () => void; isPending: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button onClick={onClick} disabled={isPending || pending}>
      {isPending || pending ? 'Enviando...' : 'Enviar Cadastro'}
    </Button>
  )
}
