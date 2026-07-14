'use client'

import { useState, useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import type { FormularioValues } from '@/lib/validacoes'

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function formatCelular(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function StepClinica() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<FormularioValues>()
  const [possuiCnpj, setPossuiCnpj] = useState<boolean | null>(null)
  const [isAddressEditable, setIsAddressEditable] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)
  const [cnpjError, setCnpjError] = useState<string | null>(null)

  const watchPossuiCnpj = watch('possuiCnpj') as boolean | undefined
  const watchCepClinica = watch('cepClinica') as string | undefined
  const watchCnpjEmpresa = watch('cnpjEmpresa') as string | undefined

  useEffect(() => {
    if (watchPossuiCnpj === true) {
      setPossuiCnpj(true)
    } else if (watchPossuiCnpj === false) {
      setPossuiCnpj(false)
    }
  }, [watchPossuiCnpj])

  const fetchCEP = useCallback(async (cep: string) => {
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) {
      setCepError('CEP deve ter 8 dígitos')
      return
    }

    setCepError(null)

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${digits}`)

      if (!response.ok) {
        setCepError(response.status === 404 ? 'CEP não encontrado' : 'Erro ao buscar CEP')
        return
      }

      const data = await response.json()
      if (data.cep) {
        const partes = [
          [data.street, data.neighborhood].filter(Boolean).join(', '),
          [data.city, data.state].filter(Boolean).join(' - '),
        ].filter(Boolean)
        setValue('enderecoClinica', partes.join(' | '), { shouldValidate: true })
      }
    } catch {
      setCepError('Erro ao buscar CEP')
    }
  }, [setValue])

  const fetchCNPJ = useCallback(async (cnpj: string) => {
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length !== 14) {
      setCnpjError('CNPJ deve ter 14 dígitos')
      return
    }

    setCnpjError(null)

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`)

      if (!response.ok) {
        setCnpjError(response.status === 404 ? 'CNPJ não encontrado' : 'Erro ao buscar CNPJ')
        return
      }

      const data = await response.json()
      const nomeFantasia = data.nome_fantasia || data.razao_social || ''
      const tipoLogradouro = data.descricao_tipo_logradouro ? `${data.descricao_tipo_logradouro} ` : ''
      const endereco = [
        `${tipoLogradouro}${data.logradouro || ''}`.trim(),
        data.numero ? `nº ${data.numero}` : '',
        data.complemento || '',
        data.bairro || '',
        data.municipio || '',
      ].filter(Boolean).join(', ')
      const cep = String(data.cep || '').replace(/^(\d{5})(\d{3})$/, '$1-$2')

      setValue('nomeClinica', nomeFantasia, { shouldValidate: true })
      setValue('cepClinica', cep, { shouldValidate: true })
      setValue('enderecoClinica', endereco, { shouldValidate: true })
    } catch {
      setCnpjError('Erro ao buscar CNPJ')
    }
  }, [setValue])

  useEffect(() => {
    const cep = watchCepClinica
    if (cep && !isAddressEditable && cep.replace(/\D/g, '').length === 8) {
      fetchCEP(cep)
    }
  }, [watchCepClinica, isAddressEditable, fetchCEP])

  useEffect(() => {
    const cnpj = watchCnpjEmpresa
    if (cnpj && !isAddressEditable && cnpj.replace(/\D/g, '').length === 14) {
      fetchCNPJ(cnpj)
    }
  }, [watchCnpjEmpresa, isAddressEditable, fetchCNPJ])

  const handleCnpjToggle = (value: boolean) => {
    setPossuiCnpj(value)
    setValue('possuiCnpj', value)
  }

  const handleEditAddress = () => {
    setIsAddressEditable(true)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dados do Titular</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nome do Titular (completo)"
          {...register('nomeTitular')}
          erro={errors.nomeTitular?.message}
          required
        />
        <Input
          label="Email do Titular"
          type="email"
          {...register('emailTitular')}
          erro={errors.emailTitular?.message}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Celular para contato (whatsapp)"
          placeholder="(62) 99999-8888"
          {...register('celularTitular')}
          onChange={(e) => {
            setValue('celularTitular', formatCelular(e.target.value), { shouldValidate: false })
          }}
          erro={errors.celularTitular?.message}
          required
        />
        <Input
          label="CPF do Titular"
          placeholder="000.000.000-00"
          {...register('documentoTitular')}
          onChange={(e) => {
            setValue('documentoTitular', formatCPF(e.target.value), { shouldValidate: false })
          }}
          erro={errors.documentoTitular?.message}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Será em CNPJ de Empresa?</label>
        <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            type="button"
            onClick={() => handleCnpjToggle(true)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${possuiCnpj === true ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => handleCnpjToggle(false)}
            className={`px-4 py-2 text-sm font-medium border-l border-gray-300 dark:border-gray-600 transition-colors ${possuiCnpj === false ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
          >
            Não
          </button>
        </div>
      </div>

      {possuiCnpj && (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Dados da Empresa</h3>

          <Input
            label="CNPJ da Empresa"
            placeholder="00.000.000/0000-00"
            {...register('cnpjEmpresa')}
            onChange={(e) => {
              const formatted = formatCNPJ(e.target.value)
              setValue('cnpjEmpresa', formatted, { shouldValidate: false })
            }}
            erro={errors.cnpjEmpresa?.message}
            required
          />

          {cnpjError && (
            <p className="text-red-500 text-sm" role="alert">{cnpjError}</p>
          )}

          <div className="space-y-2">
            <Input
              label="Nome Fantasia"
              {...register('nomeClinica')}
              erro={errors.nomeClinica?.message}
              required
              disabled
            />
          </div>

          <Input
            label="CEP"
            placeholder="00000-000"
            {...register('cepClinica')}
            onChange={(e) => {
              const formatted = formatCEP(e.target.value)
              setValue('cepClinica', formatted, { shouldValidate: false })
            }}
            erro={errors.cepClinica?.message}
            required
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Endereço</label>
              {(watchCnpjEmpresa || watchCepClinica) && (
                <button
                  type="button"
                  onClick={handleEditAddress}
                  className="flex items-center gap-2 px-3 py-1 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              )}
            </div>
            <Input
              label=""
              {...register('enderecoClinica')}
              erro={errors.enderecoClinica?.message}
              required
              disabled={!isAddressEditable && !!(watchCnpjEmpresa || watchCepClinica)}
            />
            {(cnpjError || cepError) && (
              <p className="text-red-500 text-sm" role="alert">{cnpjError || cepError}</p>
            )}
          </div>
        </div>
      )}

      {possuiCnpj === false && (
        <div className="space-y-4">
          <Input
            label="CEP"
            placeholder="00000-000"
            {...register('cepClinica')}
            onChange={(e) => {
              const formatted = formatCEP(e.target.value)
              setValue('cepClinica', formatted, { shouldValidate: false })
            }}
            erro={errors.cepClinica?.message}
            required
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Endereço</label>
              {watchCepClinica && (
                <button
                  type="button"
                  onClick={handleEditAddress}
                  className="flex items-center gap-2 px-3 py-1 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              )}
            </div>
            <Input
              label=""
              {...register('enderecoClinica')}
              erro={errors.enderecoClinica?.message}
              required
              disabled={!isAddressEditable}
            />
            {cepError && (
              <p className="text-red-500 text-sm" role="alert">{cepError}</p>
            )}
          </div>
        </div>
      )}

      <FileUpload
        label="Logo da Clínica"
        accept="image/*"
        acceptHint="PNG, JPG ou JPEG"
        onFile={(file) => setValue('logo', file)}
      />
    </div>
  )
}