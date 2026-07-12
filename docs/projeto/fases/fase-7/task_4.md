# Task 4: Componente AuditLogCard

✅ **Concluído** — criar `components/admin/AuditLogCard.tsx`

Criar `components/admin/AuditLogCard.tsx` (`'use client'`):
- Props: `log` com `id`, `createdAt`, `acao`, `entidade`, `entidadeId?`, `detalhes?`, `admin?`
- Badge colorido por ação: APROVAR (verde), REJEITAR (vermelho), CRIAR (azul), EXCLUIR (cinza), LOGIN (roxo)
- Exibir nome do admin, entidade#id, data/hora formatada (pt-BR)
- Clicável: expande/colapsa detalhes em `<pre>` formatado com JSON.stringify(..., null, 2)

## Commit

```
feat(audit): criar AuditLogCard com badge de ação e detalhes expandíveis
```
