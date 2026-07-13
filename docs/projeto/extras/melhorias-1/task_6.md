# Task 6: Componente Select.tsx Reutilizável

✅ **Concluído**

Extrair o `<select>` inline do `StepUsuarios.tsx` para um componente `Select` reutilizável, seguindo o mesmo padrão do `Input.tsx`.

## O que fazer

### 1. Criar `components/ui/Select.tsx`

```tsx
'use client'

import { useId } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  opcoes: SelectOption[]
  erro?: string
}

export function Select({ label, opcoes, erro, id, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id || generatedId

  return (
    <div className="space-y-1">
      <label htmlFor={selectId} ...>{label}</label>
      <select id={selectId} className={`w-full px-3 py-2 border rounded-lg ... ${erro ? 'border-red-500' : ''}`} {...props}>
        {opcoes.map(op => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </select>
      {erro && <p className="text-red-500 text-xs" role="alert">{erro}</p>}
    </div>
  )
}
```

### 2. Substituir uso em `StepUsuarios.tsx`

- Trocar `<label>` + `<select>` inline por `<Select label="Tipo" opcoes={TIPOS_USUARIO} ... />`
- Incluir prop `erro` quando integrado com React Hook Form

### 3. Estilização

- Dark mode (assim como Input.tsx)
- focus ring com `focus:ring-2 focus:ring-blue-500`
- Bordas consistentes com o Input

## Critérios de aceite

- [ ] `components/ui/Select.tsx` criado
- [ ] StepUsuarios usa Select em vez de select inline
- [ ] Dark mode funcionando
- [ ] Prop `erro` funcional com borda vermelha
- [ ] Build passa sem erros

## Commit

```
feat(ui): criar componente Select reutilizável
```
