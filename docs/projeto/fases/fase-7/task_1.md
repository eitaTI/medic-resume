# Task 1: Schema AuditLog + Migração

✅ **Concluído** — modelo `AuditLog` adicionado ao schema Prisma

Adicionar modelo `AuditLog` no `prisma/schema.prisma`:
- `id` (Int, autoincrement)
- `userId` (String, relation com User)
- `acao` (String) — valores: CRIAR, APROVAR, REJEITAR, EXCLUIR, LOGIN
- `entidade` (String) — Clinica, Medico, User, etc.
- `entidadeId` (Int?)
- `detalhes` (String?)
- `ipAddress` (String?)
- `createdAt` (DateTime, default now)

Executar migração:
```
pnpm prisma migrate dev --name add-audit-log
```

## Commit

```
feat(audit): adicionar modelo AuditLog no schema e migrar
```
