# Task 4: Feedback Visual de Erros por Campo no Input

❌ **Pendente**

Exibir mensagens de erro validação inline abaixo de cada campo, com destaque visual (borda vermelha).

## O que fazer

### 1. Alterar `components/ui/Input.tsx`

- Adicionar prop opcional `erro?: string`
- Se `erro` presente:
  - Adicionar borda vermelha (`border-red-500`)
  - Exibir texto de erro abaixo do input em vermelho (`text-red-500 text-xs mt-1`)
- Se `erro` ausente: comportamento normal

### 2. Conectar com React Hook Form

- Em cada step, obter erros via `formState.errors` do `useFormContext()`
- Passar `erro={errors.nomeClinica?.message}` para cada `Input`

### 3. Estilizar estados

- `erro`: borda vermelha + mensagem
- `sucesso` (opcional): borda verde quando valor válido e touched
- Transição suave entre estados

### 4. Acessibilidade

- Usar `aria-invalid={!!erro}` no `<input>`
- Usar `aria-describedby` apontando para o elemento de erro
- Mensagem de erro deve ter `role="alert"` para leitores de tela

## Critérios de aceite

- [ ] Input exibe mensagem de erro inline quando prop `erro` fornecida
- [ ] Borda vermelha em campos com erro
- [ ] `aria-invalid` e `aria-describedby` implementados
- [ ] Build passa sem erros

## Exemplo visual

```
┌─────────────────────────┐
│ Nome da Clínica         │  ← label
│ ┌─────────────────────┐ │
│ │                     │ │  ← input com border-red-500
│ └─────────────────────┘ │
│ Nome da clínica é       │  ← text-red-500 text-xs
│ obrigatório             │
└─────────────────────────┘
```

## Commit

```
feat(ui): adicionar feedback de erro inline no componente Input
```
