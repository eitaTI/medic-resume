# Task 1: Reconciliar Schema — dropar `Admin` e migrar `AuditLog.adminId → userId`

❌ **Pendente**

## Problema

O `init` (`prisma/migrations/20260708181853_init/migration.sql:2,63-72`) cria a tabela `Admin` e `AuditLog.adminId INTEGER FK → Admin`. O schema atual (`prisma/schema.prisma`) **não tem** o modelo `Admin` (substituído pelo Better Auth `User`/`Session`/`Account`/`Verification` na migração `add_better_auth_tables`) e define `AuditLog.userId String? → User` (`prisma/schema.prisma:114-123`).

Nenhuma migração reconcilia essa mudança. Consequências:
- O banco de dados (e o histórico de migrações aplicado) ainda possui a coluna `adminId` e a tabela `Admin`.
- O código escreve/ler `userId` (`lib/audit.ts`, `actions/login.ts:40`, `actions/auditoria.ts`), cuja coluna **não existe no banco** → erro em runtime ao registrar auditoria/login.
- `prisma migrate dev` futuro detectaria o drift e exigiria uma nova migração.

## O que fazer

1. Criar migração `reconcile_admin_to_user` que:
   - Remove a FK e a coluna `adminId` de `AuditLog`;
   - Adiciona `userId TEXT` (nullable) em `AuditLog`;
   - Dropa a tabela `Admin` (e índices/constraints relacionados).
2. Comandos Prisma v7: `pnpm prisma migrate dev --name reconcile_admin_to_user` (gere a migração a partir do diff real do schema).
3. Validar que `pnpm prisma migrate dev` roda limpo e que o `dev.db` fica consistente (`pnpm prisma validate` + teste de escrita de `AuditLog`).

## Critérios de aceite

- [ ] Migração criada e aplicada sem conflito com o `dev.db` atual
- [ ] `AuditLog` tem `userId` (String, FK → `User`) e não tem `adminId`
- [ ] Tabela `Admin` removida
- [ ] `pnpm build` e um registro de auditoria real (login) funcionam sem erro
- [ ] `prisma migrate dev` estável em banco limpo

## Commit

```
fix(db): reconciliar schema Admin→User e migrar AuditLog
```
