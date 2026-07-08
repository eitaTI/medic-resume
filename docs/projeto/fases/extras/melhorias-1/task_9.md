# Task 9: Foco Automático no Primeiro Campo ao Mudar de Passo

❌ **Pendente**

Quando o usuário navega entre os passos do wizard, o foco do teclado deve ir automaticamente para o primeiro campo do passo atual, melhorando a acessibilidade e a experiência para usuários de teclado.

## O que fazer

### 1. Criar hook ou utilidade de foco

Opção A — `useEffect` no container de cada step:

```typescript
import { useEffect, useRef } from 'react'

export function useAutoFocus(deps: unknown[]) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const input = ref.current?.querySelector('input, select, textarea') as HTMLElement
    input?.focus()
  }, deps)
  return ref
}
```

### 2. Aplicar em cada Step

- `StepClinica.tsx`: container `div` com ref → foco em `nomeClinica`
- `StepUsuarios.tsx`: foco no nome do primeiro usuário
- `StepExames.tsx`: foco em `cabecalhoLaudo` (primeiro campo)
- `StepEquipamentos.tsx`: foco no tipo do primeiro equipamento

### 3. Alternativa com React Hook Form

React Hook Form já expõe `ref` via `register()`. É possível combinar com `useEffect` e `setFocus('campo')` do React Hook Form:

```typescript
const { setFocus } = useFormContext()

useEffect(() => {
  setFocus('nomeClinica')
}, [passoAtual])
```

### 4. Acessibilidade

- `tabIndex` apropriado nos campos
- Anunciar mudança de passo para leitores de tela (aria-live region no stepper)

## Critérios de aceite

- [ ] Foco vai para o primeiro input ao entrar em cada passo
- [ ] Funciona para usuários de teclado (Tab)
- [ ] Não causa scroll indesejado em mobile
- [ ] Build passa sem erros

## Dependências

- Task 1 (React Hook Form) — `setFocus` é mais limpo com RHF

## Commit

```
feat(acessibilidade): foco automático no primeiro campo ao trocar de passo
```
