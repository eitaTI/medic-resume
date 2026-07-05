# Task 5: Página de Auditoria

❌ **Pendente** — criar `app/admin/auditoria/page.tsx`

Criar `app/admin/auditoria/page.tsx` (Server Component):
- Ler `searchParams`: `acao`, `dataInicio`, `dataFim`
- Chamar `listarAuditoria` com filtros
- Título "Auditoria"
- Formulário de filtros: select de ação (Todas, APROVAR, REJEITAR, CRIAR, EXCLUIR, LOGIN), inputs date para data início/fim, botão "Filtrar"
- Lista de `AuditLogCard` no restante da página
- Mensagem "Nenhum registro encontrado" se vazio

## Commit

```
feat(audit): criar página de auditoria com filtros por ação e período
```
