# Task 3: Botões Aprovar/Rejeitar com Feedback Jira

❌ **Pendente** — atualizar `components/admin/AprovarRejeitarButtons.tsx`

Atualizar `components/admin/AprovarRejeitarButtons.tsx` (criado na Fase 4):
- Props: `clinicaId: number`, `status: string`
- Estado: `motivo` (string), `carregando` (boolean), `resultado` (sucesso/erro)
- Se `status` não for `'PENDENTE'`, exibir badge de revisado (sem ações)
- Botão "Aprovar": chama `aprovarSubmissao(clinicaId)` → se retornar `jiraIssueKey`, exibir feedback inline "Card Jira criado: ZSCAN-42" (não usar `alert`)
- Botão "Rejeitar": input para motivo + confirma → chama `rejeitarSubmissao(clinicaId, motivo)` → feedback inline
- Usar `useActionState` (padrão do projeto) para estados de loading/pending
- `router.refresh()` após sucesso (importar de `next/navigation`)
- Tratar erros com feedback inline (não `alert`)

## Commit

```
feat(jira): integrar feedback Jira nos botões AprovarRejeitar
```
