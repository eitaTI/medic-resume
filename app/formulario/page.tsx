'use client'

import { useState } from 'react'
import { Stepper } from '@/components/wizard/Stepper'
import { StepClinica } from '@/components/wizard/StepClinica'
import { Button } from '@/components/ui/Button'

const LABELS = ['Clínica', 'Médicos', 'Exames', 'Dispositivos']

export default function FormularioPage() {
  const [passoAtual, setPassoAtual] = useState(0)
  const [dadosClinica, setDadosClinica] = useState({})

  const proximoPasso = () => {
    if (passoAtual < 3) setPassoAtual(passoAtual + 1)
  }

  const passoAnterior = () => {
    if (passoAtual > 0) setPassoAtual(passoAtual - 1)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cadastro da Clínica</h1>

      <Stepper passoAtual={passoAtual} totalPassos={4} labels={LABELS} />

      {passoAtual === 0 && (
        <StepClinica
          dados={dadosClinica}
          onChange={setDadosClinica}
        />
      )}

      {passoAtual >= 1 && (
        <div className="p-8 text-center text-gray-400 border-2 border-dashed rounded-lg">
          Etapa {passoAtual + 1} — em desenvolvimento
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button
          variante="secundario"
          onClick={passoAnterior}
          disabled={passoAtual === 0}
        >
          Anterior
        </Button>

        <Button onClick={proximoPasso} disabled={passoAtual === 3}>
          Próximo
        </Button>
      </div>
    </div>
  )
}
