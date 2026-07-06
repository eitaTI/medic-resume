'use client'

import { useState, useActionState } from 'react'
import { Stepper } from '@/components/wizard/Stepper'
import { StepClinica } from '@/components/wizard/StepClinica'
import { StepMedicos, criarMedicoVazio } from '@/components/wizard/StepMedicos'
import { StepExames, criarExameVazio } from '@/components/wizard/StepExames'
import { StepDispositivos } from '@/components/wizard/StepDispositivos'
import { Button } from '@/components/ui/Button'
import { submeterFormulario } from '@/actions/submeter-formulario'
import type { DadosClinica, Medico } from '@/lib/validacoes'
import type { ExameComId } from '@/components/wizard/StepExames'

const LABELS = ['Clínica', 'Médicos', 'Exames', 'Dispositivos']

export default function FormularioPage() {
  const [passoAtual, setPassoAtual] = useState(0)
  const [dadosClinica, setDadosClinica] = useState<Partial<DadosClinica>>({})
  const [dadosMedicos, setDadosMedicos] = useState<Medico[]>([criarMedicoVazio()])
  const [cabecalhoLaudo, setCabecalhoLaudo] = useState('')
  const [rodapeLaudo, setRodapeLaudo] = useState('')
  const [dadosExames, setDadosExames] = useState<ExameComId[]>([criarExameVazio()])
  const [dadosDispositivos, setDadosDispositivos] = useState([{ tipo: '', marca: '', modelo: '', numeroSerie: '' }])

  const [state, formAction, pending] = useActionState(submeterFormulario, null)

  const proximoPasso = () => {
    if (passoAtual < 3) setPassoAtual(passoAtual + 1)
  }

  const passoAnterior = () => {
    if (passoAtual > 0) setPassoAtual(passoAtual - 1)
  }

  const handleSubmit = async () => {
    const formData = new FormData()

    if (dadosClinica.nomeEmpresa) formData.set('nomeEmpresa', dadosClinica.nomeEmpresa)
    if (dadosClinica.nomeClinica) formData.set('nomeClinica', dadosClinica.nomeClinica)
    if (dadosClinica.nomeTitular) formData.set('nomeTitular', dadosClinica.nomeTitular)
    if (dadosClinica.emailTitular) formData.set('emailTitular', dadosClinica.emailTitular)
    if (dadosClinica.quantidadeMedicos) formData.set('quantidadeMedicos', String(dadosClinica.quantidadeMedicos))
    if (dadosClinica.logo) formData.set('logo', dadosClinica.logo)

    formData.set('cabecalhoLaudo', cabecalhoLaudo)
    formData.set('rodapeLaudo', rodapeLaudo)

    dadosMedicos.forEach((m, i) => {
      formData.set(`medicos[${i}].nome`, m.nome)
      formData.set(`medicos[${i}].documento`, m.documento)
      formData.set(`medicos[${i}].email`, m.email)
      if (m.assinatura) formData.set(`medicos[${i}].assinatura`, m.assinatura)
    })

    dadosExames.forEach((e, i) => {
      formData.set(`exames[${i}].nome`, e.nome)
      if (e.laudo) formData.set(`exames[${i}].laudo`, e.laudo)
    })

    dadosDispositivos.forEach((d, i) => {
      formData.set(`dispositivos[${i}].tipo`, d.tipo)
      formData.set(`dispositivos[${i}].marca`, d.marca)
      formData.set(`dispositivos[${i}].modelo`, d.modelo)
      formData.set(`dispositivos[${i}].numeroSerie`, d.numeroSerie)
    })

    formAction(formData)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cadastro da Clínica</h1>

      <Stepper passoAtual={passoAtual} totalPassos={4} labels={LABELS} />

      {passoAtual === 0 && (
        <StepClinica dados={dadosClinica} onChange={setDadosClinica} />
      )}

      {passoAtual === 1 && (
        <StepMedicos medicos={dadosMedicos} onChange={setDadosMedicos} />
      )}

      {passoAtual === 2 && (
        <StepExames
          cabecalho={cabecalhoLaudo}
          rodape={rodapeLaudo}
          exames={dadosExames}
          onChange={({ cabecalho, rodape, exames }) => {
            setCabecalhoLaudo(cabecalho)
            setRodapeLaudo(rodape)
            setDadosExames(exames)
          }}
        />
      )}

      {passoAtual === 3 && (
        <StepDispositivos dispositivos={dadosDispositivos} onChange={setDadosDispositivos} />
      )}

      {state?.sucesso && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
          Formulário enviado com sucesso!
        </div>
      )}

      {state?.erro && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {state.erro}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variante="secundario" onClick={passoAnterior} disabled={passoAtual === 0 || pending}>
          Anterior
        </Button>

        {passoAtual < 3 ? (
          <Button onClick={proximoPasso}>
            Próximo
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={pending}>
            {pending ? 'Enviando...' : 'Enviar Formulário'}
          </Button>
        )}
      </div>
    </div>
  )
}
