'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Stepper } from '@/components/wizard/Stepper'
import { StepClinica } from '@/components/wizard/StepClinica'
import { StepMedicos, criarMedicoVazio } from '@/components/wizard/StepMedicos'
import { StepExames, criarExameVazio } from '@/components/wizard/StepExames'
import { StepDispositivos } from '@/components/wizard/StepDispositivos'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { DadosClinica } from '@/components/wizard/StepClinica'
import type { Medico } from '@/components/wizard/StepMedicos'
const LABELS = ['Clínica', 'Médicos', 'Exames', 'Dispositivos']

export default function FormularioPage() {
  const [passoAtual, setPassoAtual] = useState(0)
  const [dadosClinica, setDadosClinica] = useState<DadosClinica>({})
  const [dadosMedicos, setDadosMedicos] = useState<Medico[]>([criarMedicoVazio()])
  const [dadosExames, setDadosExames] = useState({
    cabecalho: '',
    rodape: '',
    exames: [criarExameVazio()]
  })
  const [dadosDispositivos, setDadosDispositivos] = useState([{ tipo: '', marca: '', modelo: '', numeroSerie: '' }])

  const proximoPasso = () => {
    if (passoAtual < 3) setPassoAtual(passoAtual + 1)
  }

  const passoAnterior = () => {
    if (passoAtual > 0) setPassoAtual(passoAtual - 1)
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
              <StepMedicos medicos={dadosMedicos} onChange={setDadosMedicos} />
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
              <StepDispositivos dispositivos={dadosDispositivos} onChange={setDadosDispositivos} />
            )}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button variante="secundario" onClick={passoAnterior} disabled={passoAtual === 0}>
              ← Anterior
            </Button>
            <Button onClick={proximoPasso} disabled={passoAtual === 3}>
              Próximo →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}