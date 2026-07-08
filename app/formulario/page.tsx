'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Stepper } from '@/components/wizard/Stepper'
import { StepClinica } from '@/components/wizard/StepClinica'
import { StepUsuarios, criarUsuarioVazio } from '@/components/wizard/StepUsuarios'
import { StepExames, criarExameVazio } from '@/components/wizard/StepExames'
import { StepEquipamentos } from '@/components/wizard/StepEquipamentos'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { submeterFormulario } from '@/actions/submeter-formulario'
import type { DadosClinica } from '@/components/wizard/StepClinica'
import type { Usuario } from '@/components/wizard/StepUsuarios'
const LABELS = ['Clínica', 'Usuários', 'Exames', 'Equipamentos']

export default function FormularioPage() {
  const [passoAtual, setPassoAtual] = useState(0)
  const [dadosClinica, setDadosClinica] = useState<DadosClinica>({
    nomeClinica: '', nomeTitular: '', emailTitular: '', celularTitular: '', documentoTitular: ''
  })
  const [dadosUsuarios, setDadosUsuarios] = useState<Usuario[]>([criarUsuarioVazio('examinador')])
  const [dadosExames, setDadosExames] = useState({
    cabecalho: '',
    rodape: '',
    exames: [criarExameVazio()]
  })
  const [dadosEquipamentos, setDadosEquipamentos] = useState([{ tipo: '', marca: '', modelo: '', numeroSerie: '' }])
  const [submetendo, setSubmetendo] = useState(false)
  const [resultado, setResultado] = useState<{ sucesso?: boolean; erro?: string } | null>(null)

  const proximoPasso = () => {
    if (passoAtual < 3) setPassoAtual(passoAtual + 1)
  }

  const passoAnterior = () => {
    if (passoAtual > 0) setPassoAtual(passoAtual - 1)
  }

  async function handleSubmit() {
    setSubmetendo(true)
    setResultado(null)

    const fd = new FormData()
    fd.append('nomeClinica', dadosClinica.nomeClinica || '')
    fd.append('nomeTitular', dadosClinica.nomeTitular || '')
    fd.append('emailTitular', dadosClinica.emailTitular || '')
    fd.append('celularTitular', dadosClinica.celularTitular || '')
    fd.append('documentoTitular', dadosClinica.documentoTitular || '')
    fd.append('cabecalhoLaudo', dadosExames.cabecalho)
    fd.append('rodapeLaudo', dadosExames.rodape)
    if (dadosClinica.logo) fd.append('logo', dadosClinica.logo)

    dadosUsuarios.forEach((usuario, i) => {
      fd.append(`medicos[${i}].nome`, usuario.nome)
      fd.append(`medicos[${i}].documento`, usuario.documento)
      fd.append(`medicos[${i}].email`, usuario.email)
      fd.append(`medicos[${i}].tipo`, usuario.tipo)
      if (usuario.assinatura) fd.append(`medicos[${i}].assinatura`, usuario.assinatura)
    })

    dadosExames.exames.forEach((exame, i) => {
      fd.append(`exames[${i}].nome`, exame.nome)
      if (exame.laudo) fd.append(`exames[${i}].laudo`, exame.laudo)
    })

    dadosEquipamentos.forEach((equipamento, i) => {
      fd.append(`dispositivos[${i}].tipo`, equipamento.tipo)
      fd.append(`dispositivos[${i}].marca`, equipamento.marca)
      fd.append(`dispositivos[${i}].modelo`, equipamento.modelo)
      fd.append(`dispositivos[${i}].numeroSerie`, equipamento.numeroSerie)
    })

    const res = await submeterFormulario(fd)
    setResultado(res)
    setSubmetendo(false)
  }

  if (resultado && 'sucesso' in resultado) {
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

          <Stepper passoAtual={passoAtual} totalPassos={4} labels={LABELS} />

          <div className="mt-8">
            {passoAtual === 0 && (
              <StepClinica dados={dadosClinica} onChange={setDadosClinica} />
            )}

            {passoAtual === 1 && (
              <StepUsuarios usuarios={dadosUsuarios} onChange={setDadosUsuarios} />
            )}

            {passoAtual === 2 && (
              <StepExames
                cabecalho={dadosExames.cabecalho}
                rodape={dadosExames.rodape}
                exames={dadosExames.exames}
                onChange={setDadosExames}
              />
            )}

            {passoAtual === 3 && (
              <StepEquipamentos equipamentos={dadosEquipamentos} onChange={setDadosEquipamentos} />
            )}
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
              <Button onClick={handleSubmit} disabled={submetendo}>
                {submetendo ? 'Enviando...' : 'Enviar Cadastro'}
              </Button>
            ) : (
              <Button onClick={proximoPasso}>
                Próximo →
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Todos os dados são sigilosos conforme a LGPD.
        </p>
      </div>
    </div>
  )
}

function resetarFormulario() {
  window.location.reload()
}
