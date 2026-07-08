'use client'

import Image from 'next/image'
import { useState } from 'react'
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
const LABELS = ['Clínica', 'Usuários', 'Exames', 'Equipamentos']

const defaultValues: FormularioValues = {
  nomeClinica: '',
  nomeTitular: '',
  emailTitular: '',
  celularTitular: '',
  documentoTitular: '',
  cabecalhoLaudo: '',
  rodapeLaudo: '',
  usuarios: [{ nome: '', documento: '', email: '', tipo: 'examinador', temAssinatura: false }],
  exames: [{ nome: '' }],
  equipamentos: [{ tipo: '', marca: '', modelo: '', numeroSerie: '' }],
}

export default function FormularioPage() {
  const [passoAtual, setPassoAtual] = useState(0)
  const [resultado, setResultado] = useState<{ sucesso?: boolean; erro?: string } | null>(null)

  const formMethods = useForm<FormularioValues>({
    resolver: zodResolver(schemaFormulario),
    defaultValues,
  })

  const { handleSubmit, getValues, reset, watch } = formMethods

  const proximoPasso = () => {
    if (passoAtual < 3) setPassoAtual(passoAtual + 1)
  }

  const passoAnterior = () => {
    if (passoAtual > 0) setPassoAtual(passoAtual - 1)
  }

  async function onSubmit() {
    setResultado(null)
    const dados = getValues()

    const fd = new FormData()
    fd.append('nomeClinica', dados.nomeClinica || '')
    fd.append('nomeTitular', dados.nomeTitular || '')
    fd.append('emailTitular', dados.emailTitular || '')
    fd.append('celularTitular', dados.celularTitular || '')
    fd.append('documentoTitular', dados.documentoTitular || '')
    fd.append('cabecalhoLaudo', dados.cabecalhoLaudo || '')
    fd.append('rodapeLaudo', dados.rodapeLaudo || '')

    const logoField = watch('logo')
    if (logoField instanceof File) fd.append('logo', logoField)

    const raw = getValues() as Record<string, unknown>
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

    const res = await submeterFormulario(fd)
    setResultado(res)
  }

  const sucesso = resultado && 'sucesso' in resultado

  if (sucesso) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-fixed transition-colors duration-300
          bg-[url('/images/zscan-light-wallpaper.png')]
          dark:bg-[url('/images/zscan-dark-wallpaper.png')]"
      >
        <ThemeToggle />
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 text-center">
            <Image
              src="/images/zscan-logo-light.png"
              alt="ZScan"
              width={93}
              height={40}
              className="block dark:hidden mx-auto mb-6"
              priority
            />
            <Image
              src="/images/zscan-logo-dark.png"
              alt="ZScan"
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
        bg-[url('/images/zscan-light-wallpaper.png')]
        dark:bg-[url('/images/zscan-dark-wallpaper.png')]"
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
                src="/images/zscan-logo-light.png"
                alt="ZScan"
                width={93}
                height={40}
                className="block dark:hidden"
                priority
              />
              <Image
                src="/images/zscan-logo-dark.png"
                alt="ZScan"
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
                <Button onClick={handleSubmit(onSubmit)}>
                  Enviar Cadastro
                </Button>
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
    setResultado(null)
    setPassoAtual(0)
  }
}
