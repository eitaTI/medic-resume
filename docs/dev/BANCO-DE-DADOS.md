# Padrões de Banco de Dados

Guia de uso do Prisma ORM e SQLite no projeto ZScan Formulário.

## Visão Geral

- **ORM:** Prisma v7
- **Banco:** SQLite
- **Adapter:** PrismaBetterSqlite3

## Estrutura

```
prisma/
├── schema.prisma      # Schema do banco
├── seed.ts            # Dados iniciais
├── migrations/        # Migrações
└── dev.db             # Banco de dados (não commitar)
prisma.config.ts       # Configuração do Prisma v7
```

## Schema

### Configuração do Prisma v7

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
}
```

**Nota:** O Prisma v7 não suporta `url` no datasource. A URL é configurada em `prisma.config.ts`.

### Modelos

```prisma
model Admin {
  id        Int        @id @default(autoincrement())
  nome      String
  email     String     @unique
  senha     String
  createdAt DateTime   @default(now())
  auditLogs AuditLog[]
}

model Clinica {
  id                Int       @id @default(autoincrement())
  nomeEmpresa       String
  nomeClinica       String
  nomeTitular       String
  emailTitular      String
  quantidadeMedicos Int
  logoPath          String?
  cabecalhoLaudo    String?   @default("")
  rodapeLaudo       String?   @default("")
  status            String    @default("PENDENTE")
  motivoRejeicao    String?
  jiraIssueKey      String?
  createdAt         DateTime  @default(now())
  reviewedAt        DateTime?

  medicos      Medico[]
  exames       Exame[]
  dispositivos Dispositivo[]
}

model Medico {
  id             Int     @id @default(autoincrement())
  clinicaId      Int
  clinica        Clinica @relation(fields: [clinicaId], references: [id])
  nome           String
  documento      String
  email          String
  assinaturaPath String?
}

model Exame {
  id         Int     @id @default(autoincrement())
  clinicaId  Int
  clinica    Clinica @relation(fields: [clinicaId], references: [id])
  nome       String
  laudoPath  String?
}

model Dispositivo {
  id          Int     @id @default(autoincrement())
  clinicaId   Int
  clinica     Clinica @relation(fields: [clinicaId], references: [id])
  tipo        String
  marca       String
  modelo      String
  numeroSerie String
}

model AuditLog {
  id         Int      @id @default(autoincrement())
  adminId    Int?
  admin      Admin?   @relation(fields: [adminId], references: [id])
  acao       String
  entidade   String
  entidadeId Int?
  detalhes   String?
  ipAddress  String?
  createdAt  DateTime @default(now())
}
```

## Configuração

### prisma.config.ts

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### lib/prisma.ts (Singleton)

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Comandos

### Migrações

```bash
# Criar migração após alterar schema
npx prisma migrate dev --name nome_da_migracao

# Rodar migrações pendentes
npx prisma migrate deploy

# Resetar banco (apaga dados)
npx prisma migrate reset
```

### Gerar Cliente

```bash
# Gerar cliente Prisma
npx prisma generate
```

### Seed

```bash
# Rodar seed
npx prisma db seed
```

### Studio

```bash
# Abrir interface web
npx prisma studio
```

## Padrões de Queries

### Select Básico

```typescript
// Buscar todos
const clinicas = await prisma.clinica.findMany()

// Buscar por ID
const clinica = await prisma.clinica.findUnique({
  where: { id: 1 }
})

// Buscar com relacionamentos
const clinicaComDados = await prisma.clinica.findUnique({
  where: { id: 1 },
  include: {
    medicos: true,
    exames: true,
    dispositivos: true
  }
})
```

### Filtros

```typescript
// Filtrar por status
const pendentes = await prisma.clinica.findMany({
  where: { status: 'PENDENTE' }
})

// Filtros dinâmicos
const where: any = {}
if (filtro.status) where.status = filtro.status
if (filtro.dataInicio) {
  where.createdAt = { gte: new Date(filtro.dataInicio) }
}

const resultados = await prisma.clinica.findMany({ where })
```

### Paginação

```typescript
const page = 1
const pageSize = 50

const resultados = await prisma.clinica.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' }
})
```

### Create com Relacionamentos

```typescript
const clinica = await prisma.clinica.create({
  data: {
    nomeEmpresa: 'Empresa',
    nomeClinica: 'Clínica',
    nomeTitular: 'Titular',
    emailTitular: 'email@exemplo.com',
    quantidadeMedicos: 3,
    status: 'PENDENTE',
    medicos: {
      create: [
        { nome: 'Dr. 1', documento: 'CRM 1', email: 'dr1@email.com' },
        { nome: 'Dr. 2', documento: 'CRM 2', email: 'dr2@email.com' }
      ]
    },
    exames: {
      create: [
        { nome: 'Exame 1' },
        { nome: 'Exame 2' }
      ]
    }
  }
})
```

### Update

```typescript
// Atualizar status
await prisma.clinica.update({
  where: { id: 1 },
  data: {
    status: 'APROVADA',
    reviewedAt: new Date(),
    jiraIssueKey: 'ZSCAN-42'
  }
})
```

### Delete

```typescript
await prisma.admin.delete({
  where: { id: 1 }
})
```

### Upsert

```typescript
// Usado no seed
await prisma.admin.upsert({
  where: { email: 'admin@zscan.com' },
  update: {},
  create: {
    nome: 'Administrador',
    email: 'admin@zscan.com',
    senha: senhaHash
  }
})
```

## Seed

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const senhaHash = await bcrypt.hash('admin123', 10)

  await prisma.admin.upsert({
    where: { email: 'admin@zscan.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@zscan.com',
      senha: senhaHash
    }
  })

  console.log('Admin padrão criado: admin@zscan.com / admin123')
}

main()
```

## Status Possíveis

### Clinica.status

| Valor | Descrição |
|-------|-----------|
| `PENDENTE` | Formulário enviado, aguardando revisão |
| `APROVADA` | Admin aprovou, card criado no Jira |
| `REJEITADA` | Admin rejeitou com motivo |

## Backup

### Backup Manual

```bash
# Backup do banco
sqlite3 prisma/dev.db .backup backups/db_$(date +%Y%m%d_%H%M%S).db

# Backup completo (banco + uploads)
./scripts/backup.sh
```

### Restauração

```bash
# Restaurar banco
cp backups/db_20260701_020000.db prisma/dev.db
```

## Dicas

### Evitar N+1 Queries

```typescript
// ❌ Ruim - Múltiplas queries
const clinicas = await prisma.clinica.findMany()
for (const clinica of clinicas) {
  clinica.medicos = await prisma.medico.findMany({
    where: { clinicaId: clinica.id }
  })
}

// ✅ Bom - Uma query com include
const clinicas = await prisma.clinica.findMany({
  include: { medicos: true }
})
```

### Transações

```typescript
// Usar transação para operações atômicas
await prisma.$transaction([
  prisma.clinica.update({ where: { id: 1 }, data: { status: 'APROVADA' } }),
  prisma.auditLog.create({ data: { acao: 'APROVAR', entidade: 'Clinica' } })
])
```

## Checklist

- [ ] Schema atualizado antes de rodar migração
- [ ] `npx prisma generate` após alterar schema
- [ ] Seed usa adapter `PrismaBetterSqlite3`
- [ ] Queries usam `include` para relacionamentos
- [ ] Backup regular do banco
