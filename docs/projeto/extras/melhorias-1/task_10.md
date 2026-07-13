# Task 10: Persistir Rascunho no localStorage

✅ **Concluído**

Salvar automaticamente os dados do formulário no `localStorage` para que o usuário não perca o progresso se fechar o navegador ou recarregar a página acidentalmente.

## O que fazer

### 1. Criar hook `useDraftPersistence`

Criar `hooks/useDraftPersistence.ts`:

```typescript
'use client'

import { useEffect } from 'react'
import { useFormContext, UseFormReturn } from 'react-hook-form'

const DRAFT_KEY = 'medic-resume-draft'

export function useDraftPersistence() {
  const { watch, reset, getValues } = useFormContext()

  // Salvar a cada alteração (debounced)
  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // Restaurar ao montar
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      try {
        const values = JSON.parse(draft)
        reset(values)
      } catch {
        localStorage.removeItem(DRAFT_KEY)
      }
    }
  }, [reset])

  // Limpar após submissão bem-sucedida
  const limparRascunho = () => localStorage.removeItem(DRAFT_KEY)

  return { limparRascunho }
}
```

### 2. Integrar em `app/formulario/page.tsx`

- Usar o hook no formulário principal
- Chamar `limparRascunho()` após submissão bem-sucedida

### 3. Tratamento de arquivos (File)

- `localStorage` não suporta `File` objects
- Salvar metadados dos arquivos (nome, tamanho, tipo) e exibir indicador "Arquivo selecionado (reanexar após recarregar)"
- Ou ignorar arquivos no draft (apenas campos de texto)

### 4. Limites

- `localStorage` tem limite de ~5MB
- Não salvar se o formulário estiver vazio
- Limpar rascunho ao resetar formulário (task 7)

## Critérios de aceite

- [ ] Dados de texto persistem entre recarregamentos
- [ ] Rascunho é restaurado ao montar o formulário
- [ ] Rascunho é limpo após submissão bem-sucedida
- [ ] Arquivos não quebram a persistência (ignorados ou com metadados)
- [ ] Não salva formulário vazio
- [ ] Build passa sem erros

## Avisos

- `localStorage` não é criptografado — não armazenar dados sensíveis
- Limpar rascunho no logout/navegação segura se aplicável

## Dependências

- Task 1 (React Hook Form) — para `watch()` e `reset()`

## Commit

```
feat(form): persistir rascunho no localStorage
```
