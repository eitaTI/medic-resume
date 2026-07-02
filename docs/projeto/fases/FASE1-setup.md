# Fase 1: Setup do Projeto

Configuração inicial do projeto Next.js com Prisma v7 e TypeScript.

## Objetivo

Criar a base do projeto com todas as dependências configuradas e banco de dados pronto.

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Git

## Passo a Passo

### 1. Criar projeto Next.js

```bash
npx create-next-app@latest medic-resume --ts --tailwind --app --src-dir=false
cd medic-resume
```

### 1.5 Configurar Tailwind CSS v4+

Substitua o conteúdo de `app/globals.css`:

```css
@import "tailwindcss";
```

O Tailwind CSS v4+ dispensa `tailwind.config.ts` — a configuração é feita via CSS.

### 2. Instalar dependências

```bash
# Dependências principais
npm install @prisma/client better-auth bcryptjs ofetch zod

# Dependências de desenvolvimento
npm install -D prisma @types/bcryptjs dotenv

# Adapter SQLite para Prisma v7
npm install better-sqlite3 @prisma/adapter-better-sqlite3
```

### 3. Configurar Prisma

```bash
npx prisma init --datasource-provider sqlite
```

Isso cria:
- `prisma/schema.prisma`
- `prisma.config.ts`
- `.env`

### 4. Criar schema.prisma

Substitua o conteúdo de `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
}

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

**Nota:** O Prisma v7 não suporta `url` no datasource. A URL é configurada em `prisma.config.ts`.

### 5. Configurar prisma.config.ts

Atualize `prisma.config.ts` para incluir o seed:

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

### 6. Rodar migração

```bash
npx prisma migrate dev --name init
```

### 7. Criar variáveis de ambiente

Atualize `.env` na raiz:

```env
# Better Auth
BETTER_AUTH_SECRET=dev_secret_32_chars_minimum_len_example
BETTER_AUTH_URL=http://localhost:3000

# Jira (usado apenas na aprovação)
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=seu_token_aqui
JIRA_PROJECT_KEY=ZSCAN

# Database
DATABASE_URL=file:./dev.db
```

### 7.5 Criar .env.example

Crie `.env.example` na raiz (sem valores sensíveis):

```env
# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Jira (usado apenas na aprovação)
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=
JIRA_PROJECT_KEY=ZSCAN

# Database
DATABASE_URL=file:./dev.db
```

### 8. Criar seed do admin

Crie `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const senhaHash = await bcrypt.hash('admin123', 10);

  await prisma.admin.upsert({
    where: { email: 'admin@zscan.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@zscan.com',
      senha: senhaHash,
    },
  });

  console.log('Admin padrão criado: admin@zscan.com / admin123');
}

main();
```

### 9. Gerar cliente Prisma e rodar seed

```bash
# Gerar cliente Prisma
npx prisma generate

# Rodar seed
npx prisma db seed
```

### 10. Configurar Better Auth

Crie `lib/prisma.ts` (singleton com adapter):

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

Crie `lib/auth.ts`:

```typescript
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite'
  }),
  emailAndPassword: {
    enabled: true
  }
})
```

### 11. Atualizar package.json

Adicione ao `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  },
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
}
```

### 12. Testar

```bash
npm run dev
```

Acesse `http://localhost:3000` e veja se o projeto carrega.

## Arquivos Criados

```
medic-resume/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── prisma.config.ts
├── lib/
│   ├── prisma.ts
│   └── auth.ts
├── app/
│   └── globals.css
├── .env
├── .env.example
└── package.json (atualizado)
```

## Comandos Úteis

```bash
# Ver dados no banco (interface web)
npx prisma studio

# Resetar banco
npx prisma migrate reset

# Gerar cliente Prisma
npx prisma generate

# Rodar seed novamente
npx prisma db seed
```

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| Erro "database not found" | Rode `npx prisma migrate dev` |
| Erro "admin already exists" | O seed usa `upsert`, é seguro rodar novamente |
| Porta 3000 em uso | Use `npm run dev -- -p 3001` |
| Better Auth não funciona | Verifique se `BETTER_AUTH_SECRET` tem 32+ caracteres no `.env` |
| PrismaClient erro de construção | Verifique se `lib/prisma.ts` usa o adapter `PrismaBetterSqlite3` |
| Seed falha | Execute `npx prisma generate` antes do seed |
