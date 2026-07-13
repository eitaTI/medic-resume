# Padrões de Banco de Dados

Guia de uso do Prisma ORM e SQLite no projeto Medic Resume.

## Stack

- **ORM:** Prisma v7 (config via `prisma.config.ts`, sem `url` no schema)
- **Banco:** SQLite
- **Adapter:** `PrismaBetterSqlite3`

## Estrutura

```
prisma/
├── schema.prisma      # Schema do banco
├── seed.ts            # Dados iniciais
├── migrations/        # Migrações
└── dev.db             # Banco local (não commitar)
prisma.config.ts       # Config do Prisma v7
```

## Schema (Resumo)

| Modelo | Descrição |
|--------|-----------|
| `Clinica` | Clínicas submetidas (dados, `status`, `jiraSyncStatus`, `nomeEmpresa`, `quantidadeMedicos`) |
| `Medico` | Médicos vinculados a uma clínica |
| `Exame` | Exames vinculados a uma clínica |
| `Dispositivo` | Dispositivos vinculados a uma clínica |
| `AuditLog` | Logs de auditoria (userId → `User`, entidade, acao) |
| `User`/`Session`/`Account`/`Verification` | Modelos do Better Auth (admins são registros `User`) |

O schema completo está em `prisma/schema.prisma`.

## Comandos Essenciais

```bash
# Criar migração
pnpm prisma migrate dev --name descricao

# Gerar cliente (após alterar schema)
pnpm prisma generate

# Seed
pnpm prisma db seed

# Resetar banco
pnpm prisma migrate reset
```

## Padrões de Query

### Select com relacionamentos (evitar N+1)

```typescript
const clinica = await prisma.clinica.findUnique({
  where: { id: 1 },
  include: { medicos: true, exames: true, dispositivos: true }
})
```

### Filtros dinâmicos

```typescript
const where: any = {}
if (filtro.status) where.status = filtro.status
if (filtro.dataInicio) where.createdAt = { gte: new Date(filtro.dataInicio) }

const resultados = await prisma.clinica.findMany({ where })
```

### Paginação

```typescript
const resultados = await prisma.clinica.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' }
})
```

## Status de Clinica

| Valor | Descrição |
|-------|-----------|
| `PENDENTE` | Aguardando revisão |
| `APROVADA` | Aprovada, card criado no Jira |
| `REJEITADA` | Rejeitada com motivo |

## Status de Sincronização Jira (`Clinica.jiraSyncStatus`)

| Valor | Descrição |
|-------|-----------|
| `PENDENTE` | Ainda não sincronizado com o Jira |
| `SINCRONIZADO` | Card criado no Jira com sucesso |
| `ERRO` | Falha na sincronização (ver `jiraErro`) |

## Dicas

- Use `include` para relacionamentos e evite N+1 queries
- Use `prisma.$transaction()` para operações atômicas (ex: atualizar status + criar audit log)
- Singleton do Prisma em `lib/prisma.ts` com `PrismaBetterSqlite3` adapter
- Seed cria um `User` admin via Better Auth (`prisma/seed.ts`) para evitar duplicatas

## Checklist

- [ ] Rodar `pnpm prisma generate` após alterar schema
- [ ] Seed usa adapter `PrismaBetterSqlite3`
- [ ] Queries usam `include` para relacionamentos
- [ ] Backup regular do banco
