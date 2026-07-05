# Task 1: Schema AuditLog + Migração

❌ **Pendente** — adicionar ao schema Prisma

Adicionar modelo `AuditLog` no `prisma/schema.prisma`:
- `id` (Int, autoincrement)
- `adminId` (Int?, relation com Admin)
- `acao` (String) — valores: CRIAR, APROVAR, REJEITAR, EXCLUIR, LOGIN
- `entidade` (String) — Clinica, Medico, Admin, etc.
- `entidadeId` (Int?)
- `detalhes` (String?)
- `ipAddress` (String?)
- `createdAt` (DateTime, default now)

Executar migração:
```
npx prisma migrate dev --name add-audit-log
```

## Commit

```
feat(audit): adicionar modelo AuditLog no schema e migrar
```
