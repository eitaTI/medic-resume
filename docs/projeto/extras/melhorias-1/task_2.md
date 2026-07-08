# Task 2: Substituir useState por useActionState + useFormStatus

❌ **Pendente**

Migrar o estado de submissão (`submetendo`, `resultado`) para usar `useActionState` (React 19) e `useFormStatus` do React DOM.

## O que fazer

### 1. Alterar `app/formulario/page.tsx`

- Importar `useActionState` de `react` e `useFormStatus` de `react-dom`
- Criar Server Action encapsulada que recebe o objeto do formulário (via React Hook Form `getValues()`)
- Usar `const [state, formAction, isPending] = useActionState(submeterAction, initialState)`
- Substituir `submetendo` e `setResultado` pelo estado retornado pelo `useActionState`
- Componente `SubmitButton` separado que usa `useFormStatus()` para exibir "Enviando..."
- **Remover**: estado `submetendo` e `resultado` manuais

### 2. Criar componente `SubmitButton`

Novo componente ou dentro do próprio `page.tsx`:

```tsx
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Enviando...' : 'Enviar Cadastro'}
    </Button>
  )
}
```

### 3. Criar Server Action `actions/submeter-wizard.ts`

Nova action que recebe dados JSON (não FormData):

```typescript
'use server'

export async function submeterWizard(prevState: unknown, data: unknown) {
  // validar com Zod
  // salvar no banco
  // retornar { sucesso: true } | { erro: string }
}
```

### 4. Ajustar fluxo de erro

- O estado retornado por `useActionState` deve substituir o banner de erro atual
- Manter o mesmo design do alerta vermelho existente

## Critérios de aceite

- [ ] `useState<boolean>(false)` para submetendo removido
- [ ] `useState<{ sucesso?, erro? }>(null)` para resultado removido
- [ ] `useActionState` gerencia estado de submissão
- [ ] `useFormStatus` controla loading do botão
- [ ] Botão "Enviar Cadastro" desabilitado durante submissão
- [ ] Erros são exibidos via estado do `useActionState`
- [ ] Build passa sem erros

## Notas

- `useFormStatus` deve estar em um componente *dentro* do `<form>`
- React 19 já está no projeto — não requer instalação adicional

## Commit

```
feat(form): usar useActionState e useFormStatus para submissão
```
