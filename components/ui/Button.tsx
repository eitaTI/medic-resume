'use client'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'perigo'
  tamanho?: 'normal' | 'pequeno'
}

export function Button({ variante = 'primario', tamanho = 'normal', className, ...props }: ButtonProps) {
  const estilos = {
    primario: 'bg-blue-600 text-white hover:bg-blue-700',
    secundario: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    perigo: 'bg-red-600 text-white hover:bg-red-700'
  }

  const tamanhos = {
    normal: 'px-4 py-2',
    pequeno: 'px-3 py-1 text-sm'
  }

  return (
    <button
      className={`rounded-lg font-medium transition-colors disabled:opacity-50 ${estilos[variante]} ${tamanhos[tamanho]} ${className || ''}`}
      {...props}
    />
  )
}
