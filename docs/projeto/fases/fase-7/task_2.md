# Task 2: Helper de Auditoria

✅ **Concluído** — criar `lib/audit.ts`

Criar `lib/audit.ts`:
- Função `registrarAcao(params)` com: `userId?`, `acao`, `entidade`, `entidadeId?`, `detalhes?` (Record), `ipAddress?`
- Inserir no Prisma `auditLog.create` com `detalhes` convertido para JSON string

## Commit

```
feat(audit): criar helper registrarAcao para log de auditoria
```
