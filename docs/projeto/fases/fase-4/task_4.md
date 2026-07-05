# Task 4: Componente AprovarRejeitarButtons

❌ **Pendente** — criar `components/admin/AprovarRejeitarButtons.tsx`

Criar `components/admin/AprovarRejeitarButtons.tsx` (Server Component):
- Receber `clinicaId` (number) e `status` (string) como props
- Se status não for `'PENDENTE'`, não renderizar nada (ou exibir badge indicando já revisado)
- Botão "Aprovar": chama `aprovarSubmissao(clinicaId)` via form
- Botão "Rejeitar": abre campo de texto para motivo, chama `rejeitarSubmissao(clinicaId, motivo)` via form
- Usar `Button` de `@/components/ui/Button`
- Importar `aprovarSubmissao` e `rejeitarSubmissao` de `@/actions/submissoes`

## Commit

```
feat(admin): criar AprovarRejeitarButtons com actions de aprovação/rejeição
```
