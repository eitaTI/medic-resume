# Plano de Implementação — Zscan Formulario (Next.js)

## Visão Geral

Migração do projeto de Express + HTML monolítico para **Next.js 15** com painel de administração, banco de dados SQLite e integração manual com Jira após aprovação.

---

## Fluxo do Sistema

```
CLIENTE (público)
  │  Acessa /formulario
  │  Preenche wizard (4 etapas)
  │  Envia formulário
  │  Dados salvos como PENDENTE no banco
  │
ADMIN (login com email/senha)
  │  Acessa /admin
  │  Visualiza lista de submissões pendentes
  │  Revisa dados e arquivos enviados
  │  Clica "Aprovar" → card criado no Jira
  │  Ou clica "Rejeitar" → informa motivo
```

---

## Stack Tecnológica

| Camada            | Tecnologia                          |
| ----------------- | ----------------------------------- |
| Framework         | Next.js 15 (App Router)             |
| Linguagem         | TypeScript ^6                       |
| Banco de dados    | SQLite via Prisma ORM ^7            |
| Autenticação      | Better Auth (Credentials)           |
| Senhas            | bcryptjs (hash, pure JS)            |
| Upload de arquivos| Web API FormData (nativo)           |
| Cabeçalho/Rodapé  | `<textarea>` simples                |
| Integração Jira   | ofetch ^1 (REST API v3)             |
| Estilização       | Tailwind CSS ^4 (CSS-first config)  |
| Deploy            | Docker + Docker Compose             |

---

## Schema do Banco de Dados (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
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
  acao       String   # CRIAR, APROVAR, REJEITAR, EXCLUIR, LOGIN, etc.
  entidade   String   # Clinica, Medico, Admin, etc.
  entidadeId Int?
  detalhes   String?  # JSON com dados extras
  ipAddress  String?
  createdAt  DateTime @default(now())
}
```

### Status possíveis para Clinica.status

- `PENDENTE` — formulário enviado, aguardando revisão
- `APROVADA` — admin aprovou, card criado no Jira
- `REJEITADA` — admin rejeitou com motivo

---

## Estrutura de Pastas

```
medic-resume/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css                        # @import "tailwindcss"
│   │
│   ├── formulario/
│   │   └── page.tsx                       # formulário público (wizard Client Component)
│   │
│   ├── login/
│   │   └── page.tsx                       # tela de login admin
│   │
│   └── admin/
│       ├── layout.tsx                     # layout protegido
│       ├── page.tsx                       # dashboard (lista submissões via Server Component)
│       ├── submissao/
│       │   └── [id]/
│       │       └── page.tsx               # detalhe (aprovar/rejeitar)
│       └── admins/
│           └── page.tsx                   # gerenciar outros admins
│
├── components/
│   ├── wizard/
│   │   ├── Stepper.tsx
│   │   ├── StepClinica.tsx
│   │   ├── StepMedicos.tsx
│   │   ├── StepExames.tsx
│   │   └── StepDispositivos.tsx
│   ├── admin/
│   │   ├── SubmissaoCard.tsx
│   │   ├── SubmissaoDetalhe.tsx
│   │   ├── AprovarRejeitarButtons.tsx
│   │   └── AdminForm.tsx
│   └── ui/
│       ├── FileUpload.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       └── StatusBadge.tsx
│
├── actions/
│   ├── submeter-formulario.ts             # Server Action: salvar dados + arquivos
│   ├── submissoes.ts                      # Server Actions: listar, aprovar, rejeitar
│   └── admins.ts                          # Server Actions: CRUD admins
│
├── lib/
│   ├── prisma.ts                          # singleton PrismaClient
│   ├── auth.ts                            # config Better Auth
│   ├── jira.ts                            # cliente Axios para API do Jira
│   └── audit.ts                           # helper de auditoria
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── data/
│   └── uploads/                          # fora de public/ (segurança LGPD)
│
├── .env
├── .env.example
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Dependências

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "better-auth": "^1",
    "@prisma/client": "^7",
    "bcryptjs": "^2",
    "ofetch": "^1",
    "zod": "^3"
  },
  "devDependencies": {
    "prisma": "^7",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "typescript": "^6",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/bcryptjs": "^2"
  }
}
```

---

## Variáveis de Ambiente

### `.env.example`

```env
# Better Auth
BETTER_AUTH_SECRET=                          # gere com: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000

# Jira (usado apenas na aprovação)
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=
JIRA_PROJECT_KEY=ZSCAN

# Database
DATABASE_URL=file:./dev.db
```

### `.env` (valores para desenvolvimento)

```env
BETTER_AUTH_SECRET=dev_secret_32_chars_minimum_len_example
BETTER_AUTH_URL=http://localhost:3000

JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=seu_token_aqui
JIRA_PROJECT_KEY=ZSCAN

DATABASE_URL=file:./dev.db
```

---

## Seed do Admin Padrão

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

O seed também pode ser executado via `npx better-auth seed` se configurado no `auth.ts`.

---

## Server Actions (substituem API Routes)

O Next.js 15 App Router permite usar **Server Actions** em vez de API Routes tradicionais. Cada Server Action é uma função `"use server"` tipada que pode ser chamada diretamente de um Client Component via formulário ou `useActionState`.

### Públicas

| Action                           | Descrição                                      |
| -------------------------------- | ---------------------------------------------- |
| `submeterFormulario(formData)`   | Cliente envia formulário + arquivos (multipart) |

### Protegidas (autenticadas via Better Auth)

| Action                               | Descrição                              |
| ------------------------------------ | -------------------------------------- |
| `listarSubmissoes(filtro?)`          | Lista submissões com filtro de status  |
| `detalharSubmissao(id)`              | Retorna dados completos da submissão   |
| `aprovarSubmissao(id)`               | Aprova e cria card no Jira             |
| `rejeitarSubmissao(id, motivo)`      | Rejeita com motivo                     |
| `criarAdmin(dados)`                  | Cria novo admin                        |
| `excluirAdmin(id)`                   | Remove admin                           |
| `listarAuditoria(filtro?)`           | Lista logs de auditoria                |
| `registrarAcao(dados)`               | Registra ação no AuditLog              |

### Vantagens das Server Actions

- **Zero boilerplate** — sem configurar `bodyParser`, sem `NextApiRequest`
- **FormData nativo** — o browser envia FormData diretamente (incluindo arquivos)
- **Validação integrada** — chame Zod dentro da própria action
- **Revalidação automática** — `revalidatePath()` após mutações
- **Tipagem segura** — formulário e action compartilham os mesmos tipos

---

## Sistema de Auditoria

### O que é registrado

Toda ação administrativa gera um registro na tabela `AuditLog`:

| Ação        | Descrição                                   |
| ----------- | ------------------------------------------- |
| `CRIAR`     | Criação de clínica, médico, admin           |
| `APROVAR`   | Aprovação de submissão                      |
| `REJEITAR`  | Rejeição de submissão com motivo            |
| `EXCLUIR`   | Exclusão de registro                        |
| `LOGIN`     | Login do admin                              |
| `DOWNLOAD`  | Download de arquivo (logo, PDF, assinatura) |

### Helper de Auditoria (`lib/audit.ts`)

```typescript
// lib/audit.ts
import { prisma } from './prisma'

interface RegistrarAcaoParams {
  adminId?: number
  acao: string
  entidade: string
  entidadeId?: number
  detalhes?: Record<string, unknown>
  ipAddress?: string
}

export async function registrarAcao(params: RegistrarAcaoParams) {
  return prisma.auditLog.create({
    data: {
      adminId: params.adminId,
      acao: params.acao,
      entidade: params.entidade,
      entidadeId: params.entidadeId,
      detalhes: params.detalhes ? JSON.stringify(params.detalhes) : null,
      ipAddress: params.ipAddress,
    },
  })
}
```

### Exemplo de uso nas Server Actions

```typescript
// Aprovar submissão
await registrarAcao({
  adminId: session.user.id,
  acao: 'APROVAR',
  entidade: 'Clinica',
  entidadeId: clinica.id,
  detalhes: { jiraIssueKey: 'ZSCAN-42' },
  ipAddress: request.headers.get('x-forwarded-for'),
})
```

### Tela de Auditoria (`/admin/auditoria`)

- Lista de logs com: data, admin, ação, entidade, detalhes
- Filtros: por data, por admin, por ação
- Paginação (50 registros por página)

---

## Sistema de Backup

### Estratégia de Backup

| Tipo       | Frequência  | Retenção  | Comando                          |
| ---------- | ----------- | --------- | -------------------------------- |
| Completo   | Diário 02h  | 30 dias   | `sqlite3 dev.db .backup backup.db` |
| Incremental| A cada hora | 7 dias    | via cron + rsync                 |

### Script de Backup (`scripts/backup.sh`)

```bash
#!/bin/bash
BACKUP_DIR="./backups"
DB_PATH="./prisma/dev.db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# Backup do banco
sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/db_$TIMESTAMP.db'"

# Backup dos uploads
tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" ./data/uploads/

# Remove backups com mais de 30 dias
find "$BACKUP_DIR" -name "*.db" -mtime +30 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete

echo "Backup concluído: $TIMESTAMP"
```

### Cron Job (Docker)

Adicionar ao `docker-compose.yml`:

```yaml
services:
  backup:
    image: alpine:latest
    volumes:
      - ./:/app
      - ./backups:/backups
    command: >
      sh -c "echo '0 2 * * * /app/scripts/backup.sh' | crontab - && crond -f -l 2"
    restart: unless-stopped
```

### Restauração

```bash
# Restaurar banco
cp ./backups/db_20260701_020000.db ./prisma/dev.db

# Restaurar uploads
tar -xzf ./backups/uploads_20260701_020000.tar.gz -C ./
```

---

## Integração Jira (apenas na aprovação)

### Payload enviado ao Jira

```json
{
  "fields": {
    "project": { "key": "ZSCAN" },
    "issuetype": { "name": "Task" },
    "summary": "[ZScan] Cadastro - Nome da Clínica",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Clínica: Nome | Titular: Nome | Email: email | Médicos: 3 | Exames: 2 | Dispositivos: 1 | Cabeçalho/Rodapé: preenchidos"
            }
          ]
        }
      ]
    },
    "labels": ["cadastro", "clinica"]
  }
}
```

Após criação, a chave do issue (ex: `ZSCAN-42`) é salva em `Clinica.jiraIssueKey`.

---

## Telas do Admin

### 1. Login (`/login`)

- Campo: Email
- Campo: Senha
- Botão: Entrar
- Mensagem de erro em caso de credenciais inválidas

### 2. Dashboard (`/admin`)

- Filtros: Todas | Pendentes | Aprovadas | Rejeitadas
- Cards com: nome da clínica, titular, data, badge de status
- Clicar no card → detalhe da submissão

### 3. Detalhe da Submissão (`/admin/submissao/[id]`)

- Dados da clínica (empresa, nome, titular, email, qtd médicos)
- Logo enviada (preview)
- Cabeçalho e rodapé dos laudos (HTML renderizado)
- Lista de médicos (nome, documento, email, assinatura)
- Lista de exames (nome, download do PDF)
- Lista de dispositivos (tipo, marca, modelo, série)
- Botões: **Aprovar** (verde) | **Rejeitar** (vermelho)
- Ao rejeitar: campo de texto para motivo obrigatório
- Ao aprovar: status muda para APROVADA, card criado no Jira

### 4. Gerenciar Admins (`/admin/admins`)

- Lista de admins (nome, email, data de criação)
- Formulário: nome, email, senha → Criar novo admin
- Botão de excluir (exceto para o admin logado)

### 5. Auditoria (`/admin/auditoria`)

- Lista de logs com: data/hora, admin, ação, entidade, detalhes
- Filtros: período, admin, tipo de ação
- Paginação (50 registros por página)
- Detalhes expandíveis (JSON formatado)

---

## Fases de Implementação

### Fase 1: Setup do Projeto

- [ ] `npx create-next-app@latest medic-resume --ts --tailwind --app --src-dir=false`
- [ ] Configurar `globals.css` com `@import "tailwindcss"` (Tailwind v4, sem `tailwind.config.ts`)
- [ ] Instalar dependências: `prisma ^7`, `@prisma/client ^7`, `better-auth`, `bcryptjs`, `ofetch`, `zod`
- [ ] `npx prisma init` com SQLite
- [ ] Criar `schema.prisma` com modelos `Admin`, `Clinica`, `Medico`, `Exame`, `Dispositivo`
- [ ] Rodar `npx prisma migrate dev --name init`
- [ ] Criar `prisma/seed.ts` (admin padrão com bcryptjs)
- [ ] Configurar `.env` e `.env.example`
- [ ] Configurar Better Auth (`lib/auth.ts` com Credentials provider + Prisma adapter)
- [ ] Rodar `npx prisma db seed`

### Fase 2: Formulário Público

- [ ] Criar rota `/formulario` + `"use client"`
- [ ] Estilizar wizard com Tailwind CSS v4 (classes utilitárias)
- [ ] Criar componente `Stepper` (progresso das etapas)
- [ ] Criar `StepClinica` (empresa, clínica, titular, email, qtd médicos, logo)
- [ ] Criar `StepMedicos` (cards dinâmicos: nome, documento, email, assinatura)
- [ ] Criar `StepExames` (campos globais: cabeçalho e rodapé textarea + cards: nome, upload PDF)
- [ ] Criar `StepDispositivos` (cards dinâmicos: tipo, marca, modelo, série)
- [ ] Criar `FileUpload.tsx` (preview + validação de tipo/tamanho)
- [ ] Validar formulário com Zod + `useActionState`
- [ ] Criar Server Action `actions/submeter-formulario.ts` (recebe FormData nativo do Web API, sem biblioteca de parsing — salva arquivos em `data/uploads/` e dados no banco)
- [ ] Testar envio completo (dados + logos + PDFs + cabeçalho/rodapé)

### Fase 3: Autenticação e Login

- [ ] Configurar Better Auth com Credentials provider e adapter Prisma
- [ ] Criar tela de login (`/login`) com formulário server-action
- [ ] Criar middleware de proteção de rotas `/admin/*`
- [ ] Testar login/logout

### Fase 4: Painel Admin

- [ ] Criar layout protegido (`admin/layout.tsx`) com verificação de sessão
- [ ] Criar Server Action `listarSubmissoes(filtro?)` em `actions/submissoes.ts`
- [ ] Criar dashboard (Server Component que chama Server Action)
- [ ] Criar componente `SubmissaoCard` (nome, titular, data, badge)
- [ ] Criar componente `StatusBadge` (verde/amarelo/vermelho)
- [ ] Criar página de detalhe da submissão (`admin/submissao/[id]`)
- [ ] Criar Server Actions `aprovarSubmissao(id)` e `rejeitarSubmissao(id, motivo)`

### Fase 5: Integração Jira

- [ ] Criar `lib/jira.ts` (função `criarCardJira` com ofetch)
- [ ] Chamar `criarCardJira(clinica)` dentro de `aprovarSubmissao()`
- [ ] Salvar `jiraIssueKey` no banco após confirmação

### Fase 6: Gerenciar Admins

- [ ] Criar página `/admin/admins` (Server Component)
- [ ] Server Actions: `criarAdmin(dados)` e `excluirAdmin(id)` em `actions/admins.ts`
- [ ] Formulário de criação inline com `useActionState`

### Fase 7: Sistema de Auditoria

- [ ] Adicionar modelo `AuditLog` ao schema Prisma
- [ ] Rodar `npx prisma migrate dev --name add-audit-log`
- [ ] Criar `lib/audit.ts` com função `registrarAcao()`
- [ ] Integrar `registrarAcao()` em todas as Server Actions de mutação
- [ ] Criar Server Action `listarAuditoria(filtro?)` em `actions/auditoria.ts`
- [ ] Criar página `/admin/auditoria` (lista de logs com filtros)
- [ ] Criar componente `AuditLogCard` (data, admin, ação, entidade)
- [ ] Testar geração de logs em todas as ações

### Fase 8: Sistema de Backup

- [ ] Criar diretório `scripts/`
- [ ] Criar `scripts/backup.sh` (backup banco + uploads)
- [ ] Tornar script executável: `chmod +x scripts/backup.sh`
- [ ] Testar backup manual: `./scripts/backup.sh`
- [ ] Adicionar serviço `backup` ao `docker-compose.yml` (cron diário)
- [ ] Testar restauração do banco
- [ ] Testar restauração dos uploads

### Fase 9: Deploy com Docker

- [ ] Criar `Dockerfile` (multi-stage: build + produção)
- [ ] Criar `docker-compose.yml` (app + banco SQLite em volume)
- [ ] Criar `.dockerignore`
- [ ] Configurar variáveis de ambiente no `docker-compose.yml`
- [ ] `docker compose up -d` no servidor
- [ ] Configurar Nginx como reverse proxy (opcional, para SSL)
- [ ] Configurar SSL com Certbot (opcional)

---

## Comandos Úteis

```bash
# Setup
npx create-next-app@latest medic-resume --ts --tailwind --app --src-dir=false
npm install @prisma/client@latest better-auth bcryptjs ofetch zod
npm install -D prisma@latest @types/bcryptjs

# Prisma
npx prisma init --datasource-provider sqlite
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio                    # interface web para ver o banco

# Better Auth
npx better-auth generate             # gera os tipos e configuração inicial

# Desenvolvimento
npm run dev

# Build e produção
npm run build
npm start

# Docker (produção)
docker compose up -d
docker compose logs -f
docker compose down

# Backup
./scripts/backup.sh                      # backup manual
sqlite3 prisma/dev.db .backup backup.db  # backup rápido do banco
```
