'use client'

import { useState, useRef, useId } from 'react'
import Image from 'next/image'

interface FileUploadProps {
  label: string
  accept: string
  acceptHint?: string
  maxSizeMB?: number
  onFile: (file: File) => void
}

export function FileUpload({ label, accept, acceptHint, maxSizeMB = 10, onFile }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErro(null)

    const maxBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      setErro(`Arquivo muito grande. Máximo ${maxSizeMB}MB.`)
      return
    }

    const allowedTypes = accept.split(',').map((t) => t.trim())
    const ext = file.name.split('.').pop()?.toLowerCase()
    const typeOk = allowedTypes.some((t) => {
      if (t.startsWith('.')) return ext === t.slice(1)
      if (t.endsWith('/*')) return file.type.startsWith(t.slice(0, -1))
      return file.type === t
    })
    if (!typeOk) {
      setErro(`Tipo de arquivo não permitido. Aceito: ${acceptHint || accept}`)
      return
    }

    onFile(file)
    setFileName(file.name)

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const borderClass = erro
    ? 'border-red-500 hover:border-red-600'
    : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        hidden
      />
      {!fileName ? (
        <button
          type="button"
          onClick={() => { setErro(null); inputRef.current?.click() }}
          className={`w-full border-2 border-dashed ${borderClass} rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}
        >
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">Clique para selecionar o arquivo</p>
          {acceptHint && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{acceptHint}</p>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{fileName}</p>
          </div>
          <button
            type="button"
            onClick={() => { setPreview(null); setFileName(null); setErro(null); if (inputRef.current) inputRef.current.value = '' }}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
          >
            Remover
          </button>
        </div>
      )}
      {erro && (
        <p className="text-red-500 text-xs mt-1" role="alert">{erro}</p>
      )}
      {preview && (
        <div className="mt-2 max-h-32 relative">
          <Image
            src={preview}
            alt="Preview do arquivo enviado"
            fill
            className="rounded border object-contain"
            sizes="100vw"
            unoptimized
          />
        </div>
      )}
    </div>
  )
}
