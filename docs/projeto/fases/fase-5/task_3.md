# Task 3: Botões Aprovar/Rejeitar com Feedback Jira

❌ **Pendente** — criar/atualizar `components/admin/AprovarRejeitarButtons.tsx`

Criar `components/admin/AprovarRejeitarButtons.tsx` (`'use client'`):
- Props: `clinicaId` (number), `status` (string)
- Estado: `motivo` (string), `carregando` (boolean)
- Se status não for `'PENDENTE'`, retornar `null`
- Botão "Aprovar": confirm dialog → chama `aprovarSubmissao(clinicaId)` → alert com `result.jiraIssueKey` → `router.refresh()`
- Botão "Rejeitar": input para motivo + confirma → chama `rejeitarSubmissao(clinicaId, motivo)` → alert → `router.refresh()`
- Desabilitar botões enquanto `carregando`
- Tratar erros com try/catch e alert

## Commit

```
feat(jira): criar AprovarRejeitarButtons com loading, confirmação e feedback do Jira
```
