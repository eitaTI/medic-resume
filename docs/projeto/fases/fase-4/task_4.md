# Task 4: Componente AprovarRejeitarButtons

✅ **Concluído** — criar `components/admin/AprovarRejeitarButtons.tsx`

Criar `components/admin/AprovarRejeitarButtons.tsx`:

```tsx
'use client'
```

- Receber `clinicaId: number` e `status: string` como props
- Se `status` não for `'PENDENTE'`, exibir badge indicando já revisado (verde se aprovado, vermelho se rejeitado, com texto em português)
- **Botão "Aprovar"**:
  - `variante="primario"` (do componente `Button`)
  - Chama `aprovarSubmissao(clinicaId)` via `useActionState` ou form action
- **Botão "Rejeitar"**:
  - `variante="perigo"` (do componente `Button`)
  - Abre campo de texto (`textarea`) para o motivo da rejeição
  - Chama `rejeitarSubmissao(clinicaId, motivo)` via `useActionState` ou form action
- Importar:
  - `Button` de `@/components/ui/Button`
  - `aprovarSubmissao` e `rejeitarSubmissao` de `@/actions/submissoes`
- Usar o padrão de `useActionState` já existente no projeto (ver `app/formulario/page.tsx` para referência)
- Feedback visual: mostrar estado de carregamento nos botões durante a ação

## Commit

```
feat(admin): criar AprovarRejeitarButtons com feedback de carregamento
```
