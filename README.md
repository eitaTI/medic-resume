# Medic Resume — EitaTI Formulário

[![Build and Push Image](https://github.com/eitati/medic-resume/actions/workflows/build.yml/badge.svg)](https://github.com/eitati/medic-resume/actions/workflows/build.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite)](https://www.sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-validated-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

Sistema de cadastro e integração de clínicas médicas para o ecossistema EitaTI. Um **wizard público de 4 etapas** coleta e valida os dados da clínica, seus usuários, exames e equipamentos; e um **painel administrativo** restrito permite que administradores revisem, aprovem ou rejeitem as submissões. Na aprovação, um card contendo todas as informações e os uploads anexados é criado automaticamente no **Jira** (com lógica de retry e *fail-open*).

---

## 🧙 O Wizard de Cadastro

O formulário de cadastro de clínicas é composto por 4 etapas estruturadas:

1. **Clínica**: Dados corporativos (Nome, Titular, E-mail, Celular, CPF do Titular, CEP, Endereço e CNPJ opcional) e configurações visuais para laudo (Cabeçalho e Rodapé de laudo).
2. **Usuários**: Cadastro de funcionários e médicos da clínica, contendo nome, documento, e-mail, tipo do usuário (**Médico Examinador**, **Médico Solicitante** ou **Recepção**) e upload opcional da imagem de assinatura do médico.
3. **Exames**: Coleta os exames oferecidos pela clínica, permitindo escolher entre anexar um arquivo PDF do Laudo ou inserir tópicos de conteúdo em formato textual.
4. **Equipamentos**: Coleta os dados de equipamentos e dispositivos (Tipo, Marca, Modelo e Número de Série).

---

## 🚀 Funcionalidades Principais

- ⚡ **Prisma v7 com SQLite nativo**: Persistência simplificada através do adapter `PrismaBetterSqlite3` para excelente performance local e baixo consumo de recursos.
- 🔐 **Autenticação Segura via Better Auth**: Autenticação nativa para os administradores usando o provider `emailAndPassword`. As senhas são tratadas de forma totalmente segura com hash criptográfico.
- 🛡️ **Painel Administrativo Elegante**: Gerenciamento de submissões integrado com opções para revisar detalhes, aprovar com sincronização imediata no Jira ou rejeitar informando um motivo formal.
- 🧩 **Integração com Jira (Fail-Open)**: Criação automatizada de tarefas no Jira contendo toda a descrição estruturada e os uploads associados. Caso ocorra uma falha de conexão ou credencial, a aprovação prossegue e a clínica entra em modo de retry de sincronização.
- 👥 **Gestão de Administradores**: Interface interna para cadastrar ou excluir outros administradores, contendo validações contra auto-exclusão e exclusão do último administrador remanescente.
- 📝 **Auditoria Total (Audit Logs)**: Registro inalterável de todas as ações administrativas executadas por qualquer administrador (autenticações, criações, aprovações, rejeições e exclusões) salvando o IP e detalhes relevantes.
- 💾 **Rotinas de Backup Integradas**: Scripts inteligentes (`backup.sh` e `restore.sh`) para compactar o arquivo SQLite e a pasta de uploads com políticas automáticas de expiração (retenção de 30 dias).
- 🎨 **Branding Dinâmico e Modo Escuro**: Suporte completo a tema escuro/claro nativo via Tailwind CSS v4, com personalização de logotipos e papéis de parede em runtime na pasta `public/branding`.

---

## 🛠️ Início Rápido (Desenvolvimento Local)

### Pré-requisitos
- **Node.js 22+**
- **pnpm** (gerenciador padrão recomendado)

```bash
# 1. Instalar as dependências do projeto
pnpm install

# 2. Copiar as configurações de ambiente
cp .env.example .env

# 3. Aplicar as migrações do banco SQLite
pnpm prisma migrate dev

# 4. Executar o seed para criar o administrador padrão
pnpm prisma db seed

# 5. Iniciar o servidor em modo de desenvolvimento com HMR
pnpm dev
```

### URLs Locais
- **Formulário Público (Wizard)**: [http://localhost:3000/formulario](http://localhost:3000/formulario)
- **Login do Administrador**: [http://localhost:3000/login](http://localhost:3000/login)
- **Painel Administrativo**: [http://localhost:3000/admin](http://localhost:3000/admin)

> 💡 **Credenciais Iniciais (Seed):**  
> **E-mail:** `admin@eitati.com`  
> **Senha:** `admin123`  
> *(Por segurança, crie um novo administrador no painel e remova o administrador padrão após o primeiro login)*

---

## ⚙️ Variáveis de Ambiente

Crie ou configure o arquivo `.env` com as seguintes variáveis:

| Variável | Obrigatória? | Descrição | Valor de Exemplo / Padrão |
|----------|:------------:|-----------|---------------------------|
| `DATABASE_URL` | Sim | Caminho para o banco de dados SQLite. | `file:./dev.db` |
| `BETTER_AUTH_SECRET` | Sim | Segredo único para segurança das sessões. | *Gere um hash forte de 32+ caracteres* |
| `BETTER_AUTH_URL` | Sim | URL base da aplicação para validação das sessões. | `http://localhost:3000` |
| `JIRA_BASE_URL` | Não | Domínio base da sua instância do Jira Cloud. | `https://sua-empresa.atlassian.net` |
| `JIRA_EMAIL` | Não | Endereço de e-mail do usuário integrador do Jira. | `integrador@empresa.com` |
| `JIRA_API_TOKEN` | Não | API Token de acesso gerado no Jira. | *Seu API Token do Jira* |
| `JIRA_PROJECT_KEY` | Não | Chave (Key) do projeto destino para criação do card.| `EITATI` |
| `JIRA_ISSUE_TYPE` | Não | Tipo de issue a ser criado no Jira. | `Task` |
| `JIRA_LABELS` | Não | Labels que serão associadas de forma automática. | `medic-resume` |

> ⚠️ **Aviso de Integração:** O sistema é *fail-open* para o Jira. Se as variáveis `JIRA_*` não forem fornecidas, o fluxo de aprovação das clínicas ainda funciona normalmente, apenas registrando o status de sincronização como `PENDENTE`/`ERRO` para futura retentativa.

---

## 🎨 Branding Personalizado

Para substituir as marcas e fundos da aplicação por uma nova marca visual sem alterar uma única linha de código, basta trocar os arquivos correspondentes na pasta `public/branding/`:

- `eitati-logo-light.png` / `eitati-logo-dark.png`: Logotipo exibido na barra superior.
- `eitati-light-wallpaper.png` / `eitati-dark-wallpaper.png`: Imagem de fundo da tela de login e de sucesso.
- `eitati-icon-light.png` / `eitati-icon-dark.png`: Ícones do sistema.

> 🛠️ **Mecanismo de Cache-Busting:**  
> O arquivo `lib/branding.ts` lê essa pasta dinamicamente em runtime e anexa um sufixo de versão `v<mtime>` (baseado na data de modificação física do arquivo) em conjunto com os rewrites do `next.config.ts`, garantindo que navegadores e CDNs atualizem instantaneamente as imagens ao serem substituídas.

---

## 📂 Organização do Projeto

```
/
├── app/                  # Rotas (App Router) e endpoints da API
│   ├── formulario/       # Wizard de cadastro de clínica (público)
│   ├── login/            # Tela de login do administrador
│   ├── admin/            # Dashboard administrativo e sub-páginas (protegidos)
│   └── api/              # Endpoints para Autenticação, Saúde e Uploads (LGPD)
├── actions/              # Next.js Server Actions (mutações seguras no servidor)
├── components/           # Componentes React reutilizáveis
│   ├── ui/               # Componentes atômicos (Inputs, Buttons, Uploaders)
│   ├── wizard/           # Sub-formulários e Stepper do fluxo do cadastro
│   └── admin/            # Tabelas, cards e navbar do painel do admin
├── lib/                  # Singletons e utilitários (prisma, auth, audit, jira, etc.)
├── prisma/               # Configurações do Prisma ORM, migrations e script de Seed
├── scripts/              # Bash scripts do ciclo de vida da aplicação
│   ├── start.sh          # Script de bootstrap (migrações automáticas + next start)
│   ├── backup.sh         # Realiza backup de segurança das pastas de arquivos e DB
│   └── restore.sh        # Restaura um ponto de backup específico pelo timestamp
└── data/uploads/         # Diretório de uploads seguro (salvo fora do public/ por LGPD)
```

---

## 🐳 Deploy com Docker Compose

O projeto é empacotado através de um `Dockerfile` multi-stage que constrói a aplicação e inclui as dependências nativas (como `better-sqlite3` e `prisma`) de forma totalmente otimizada.

O Docker Compose oferece suporte a duas estratégias de deploy principais:

### Modo A — Puxando a Imagem do GHCR (Recomendado para VPS limitadas)
A imagem docker é automaticamente buildada e testada no CI (GitHub Actions) a cada push na branch `main` e publicada como pacote público no GitHub Packages (GHCR). Desta forma, sua máquina de produção não sofre com alto uso de CPU/RAM para buildar o projeto.

```bash
# 1. Puxe as imagens mais recentes do repositório
docker compose pull

# 2. Inicie a aplicação em background
docker compose up -d
```

### Modo B — Buildando Localmente (Recomendado para customizações)
Se você fez alterações no código ou deseja rodar o container buildado diretamente a partir do código fonte local:

```bash
docker compose up -d --build
```

---

## 💾 Rotinas de Backup & Restauração

Os scripts utilitários salvam uma cópia fria compactada e segura do banco de dados SQLite (`.db`) e do diretório de arquivos de uploads enviados pelas clínicas (`.tar.gz`).

### Como rodar o Backup manualmente dentro do container Docker
```bash
docker compose exec app sh -c \
  "DB_PATH=/data/db/dev.db UPLOADS_DIR=/app/data/uploads BACKUP_DIR=/backups sh /app/scripts/backup.sh /backups"
```
*Este script salva os pacotes no diretório `/backups` montado e configurado no host e remove de forma automatizada qualquer backup que exceda a retenção padrão de **30 dias**.*

### Como restaurar um Backup através de um Timestamp
```bash
# Identifique o timestamp desejado e execute:
docker compose exec app sh -c \
  "DB_PATH=/data/db/dev.db UPLOADS_DIR=/app/data/uploads BACKUP_DIR=/backups sh /app/scripts/restore.sh <TIMESTAMP>"
```

---

## 📖 Documentação Completa

Para aprofundar-se nas regras de desenvolvimento ou guias técnicos, consulte:

| Guia / Documento | Assunto |
|------------------|---------|
| [📖 Guia de Início Rápido](docs/guides/quick-start.md) | Guia completo de instalação local detalhado passo a passo. |
| [🐳 Guia de Deploy em Produção](docs/guides/deploy.md) | Detalhes do deploy Docker, Cloudflare Tunnels, montagem de volumes, etc. |
| [🏛️ Arquitetura do Sistema](docs/dev/ARQUITETURA.md) | Decisões de arquitetura, fluxo de dados e separação em camadas. |
| [💾 Guia de Banco de Dados](docs/dev/BANCO-DE-DADOS.md) | Padrões de banco, queries otimizadas, e ciclo de vida do Prisma v7. |
| [🛡️ Padrão de Server Actions](docs/dev/SERVER-ACTIONS.md) | Regras para criação de Server Actions, validação Zod e retornos padronizados. |
| [🎨 Estilização e Temas](docs/dev/ESTILIZACAO.md) | Utilização do Tailwind CSS v4 e regras de design para Dark/Light mode. |
| [🏁 Setup no Windows](docs/dev/WINDOWS-SETUP.md) | Resolução de problemas comuns no Windows (Node-Gyp, Symlinks, melhorias). |
| [🤝 Guia de Contribuição](CONTRIBUTING.md) | Diretrizes para contribuição, estilo de código, mensagens de commit e branches. |

---

## 🤝 Contribuição e Qualidade de Código

Para garantir a estabilidade do sistema, siga as diretrizes descritas no [Guia de Contribuição](CONTRIBUTING.md).

Antes de enviar ou criar qualquer commit na sua branch, certifique-se de validar se o projeto continua perfeitamente compilável e livre de violações de código:

```bash
# Executa a compilação completa de produção para garantir tipagem íntegra
pnpm build

# Verifica o código conforme as regras de qualidade
pnpm lint
```