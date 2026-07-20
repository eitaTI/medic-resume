# Testes de Regressão

> Suíte automatizada que valida todo o funcionamento do sistema após mudanças.
> Stack: **Vitest** (unit/integration) + **Playwright** (E2E). Jira **mockado**.

## 1. Visão geral

O projeto possui uma suíte de regressão dividida em duas camadas:

- **Vitest** — testes unitários/integração de Server Actions, libs
  (`lib/jira`, `lib/branding`, `lib/audit`, `lib/validacoes`) e rotas de API,
  com **banco de teste isolado** (SQLite `test.db`).
- **Playwright** — testes E2E de ponta-a-ponta cobrindo jornadas reais no
  navegador (auth, formulário, revisão, branding, auditoria).

O Jira é **mockado**: no Vitest, `jira.js` é substituído por mock (sucesso +
falha) via `vi.mock`; no Playwright, o servidor roda com `JIRA_*` dummy (o
*fail-open* cobre o caminho de erro).

## 2. Como executar

```bash
pnpm install
cp .env.example .env.test        # ajustar DATABASE_URL=file:./test.db + segredo dummy

pnpm test:unit                  # Vitest (ações + rotas) — 12 arquivos, 84 testes
pnpm test:e2e                   # Playwright (jornadas) — 13 testes
pnpm test                       # roda tudo (Vitest)
pnpm lint && pnpm build && pnpm test && pnpm test:e2e   # portão completo
```

> Pré-requisito E2E: `pnpm exec playwright install chromium` (feito no CI).

Variáveis de ambiente de teste ficam em `.env.test` (gitignored). O Vitest
carrega `DATABASE_URL=file:./test.db` via `tests/setup.ts`; o Playwright usa
um banco isolado `e2e.db` (ver `playwright.config.ts` → `webServer.env`).

## 3. Cobertura atual

Medida pelo Vitest (`@vitest/coverage-v8`) em `pnpm test:unit --coverage`.
Refere-se às camadas **unit/integration** (actions + libs + rotas de API); o
Playwright E2E não é contabilizado pela ferramenta de cobertura.

> **Snapshot:** números de `main` em `53a2887`, 84 testes unitários. Reexecute
> `pnpm test:unit --coverage` para valores atuais — o relatório HTML em
> `coverage/` traz o detalhe por arquivo.

```
Statements   : 89.72% ( 463/516 )
Branches     : 76.05% ( 235/309 )
Functions    : 100.0% (  50/50  )
Lines        : 92.73% ( 434/468 )
```

| Arquivo | % Stmts | % Branch | % Funcs | % Lines | Linhas não cobertas |
|---|---|---|---|---|---|
| `actions/admins.ts` | 85.96 | 84.37 | 100 | 90.19 | 36, 76, 109, 124, 158 |
| `actions/auditoria.ts` | 86.66 | 87.5 | 100 | 85.71 | 53, 90 |
| `actions/branding.ts` | 89.28 | 87.5 | 100 | 92.0 | 48, 72 |
| `actions/submeter-formulario.ts` | 95.6 | 81.42 | 100 | 97.61 | 204-205 |
| `actions/submissoes.ts` | 87.09 | 75.0 | 100 | 92.45 | 30, 52, 125, 218 |
| `app/api/auth/[...all]/route.ts` | 0 | 100 | 100 | 0 | 4 |
| `app/api/branding/[...path]/route.ts` | 87.06 | 75.0 | 100 | 89.9 | 77, 201, 206, 236 |
| `app/api/uploads/[...path]/route.ts` | 100 | 90.0 | 100 | 100 | 41 |
| `lib/audit.ts` | 100 | 50.0 | 100 | 100 | 47 |
| `lib/auth-client.ts` | 0 | 100 | 100 | 0 | 3 |
| `lib/auth.ts` | 0 | 100 | 100 | 0 | 6 |
| `lib/branding.ts` | 85.71 | 80.0 | 100 | 89.47 | 16, 33 |
| `lib/jira.ts` | 90.0 | 54.71 | 100 | 95.91 | 126-127 |
| `lib/prisma.ts` | 100 | 66.66 | 100 | 100 | 10, 17 |
| `lib/validacoes.ts` | 96.0 | 83.33 | 100 | 95.83 | 109 |

### Observações

- **`lib/auth.ts`, `lib/auth-client.ts` e `app/api/auth/[...all]/route.ts` = 0%**
  no Vitest porque as ações protegidas **mockam `@/lib/auth`**; a autenticação
  real é coberta ponta-a-ponta pelo Playwright E2E (login, guards, sessão).
- **`lib/audit.ts` (branch 50%)** — o branch de `detalhes` nulo raramente é
  exercitado; fácil de subir com um teste direto de `registrarAcao`.
- **`lib/jira.ts` (branch 54.71%)** — caminhos de anexo de arquivo e erros de
  rede não são totalmente exercitados pelos mocks atuais.
- Os maiores gaps de branch estão em `actions/submissoes.ts` (75%) e
  `app/api/branding` (75%) — bons candidatos para as tasks de 100% do roadmap.

## 4. Estrutura de arquivos

```
tests/
  unit/                      # Vitest: actions + libs
    validacoes.test.ts
    submeter-formulario.test.ts
    submissoes.test.ts
    admins.test.ts
    auditoria.test.ts
    branding.test.ts
    jira.test.ts             # mock de jira.js
    auth.test.ts
    smoke.test.ts
  api/                       # Vitest: rotas /api/*
    uploads.test.ts
    branding-api.test.ts
    health.test.ts
  e2e/                       # Playwright: jornadas
    auth.spec.ts
    formulario.spec.ts
    admin-submissoes.spec.ts
    branding.spec.ts
    auditoria.spec.ts
    global-setup.ts          # popula e2e.db (db push + seed)
    helpers.ts               # preencherEEnviarFormulario, loginComoAdmin, FIXTURE_LOGO
  fixtures/                  # arquivos de exemplo (logo.png, laudo.pdf)
  helpers/db.ts              # resetTestDb() + criarSessaoAdmin()
  setup.ts                   # configura DATABASE_URL de teste
vitest.config.ts
playwright.config.ts
```

### Detalhes de configuração

- **Vitest** (`vitest.config.ts`): alias `@`→raiz, ambiente `node`,
  `setupFiles: tests/setup.ts`, cobertura via `@vitest/coverage-v8` sobre
  `actions/lib/app/api`. `fileParallelism: false` — os arquivos compartilham
  `test.db`; rodar em paralelo corrompia o banco via `prisma db push
  --force-reset`.
- **Playwright** (`playwright.config.ts`): `webServer` sobe `pnpm dev` na
  porta 3000; `workers: 1` (dev-server único compartilhado — paralelismo
  causava timeout na compilação a frio) e `timeout: 90s`.

### Estratégia de mock nos testes unit/API

- Ações **protegidas** mockam `@/lib/auth` (`getSession` → admin ou `null`);
  `next/cache` (`revalidatePath`) e `next/headers` (`headers`) são mockados
  para isolar a lógica da action + banco real. A autenticação real (cookie/
  sessão) é coberta pelo Playwright E2E.
- `tests/helpers/db.ts#resetTestDb()` roda `prisma db push --force-reset`
  + `prisma/seed.ts` e garante um `User` admin de teste (`admin-test-id`)
  para que os `auditLog` com FK não quebrem.

## 5. O que é coberto

### Camada 1 — Vitest (unit/integration)

| Arquivo | O que cobre |
|---|---|
| `validacoes.test.ts` | `schemaClinica` (email, CPF 11, CNPJ 14/vazio, `quantidadeMedicos>=1`), `schemaMedico`, `schemaExame`, `schemaDispositivo`, `schemaFormulario` (superRefine: exame precisa laudo PDF OU tópicos; laudo `instanceof File`). |
| `submeter-formulario.test.ts` | Submissão pública válida cria `Clinica`+`Medicos`+`Exames`+`Dispositivos` e `revalidatePath`; inválida retorna `{ erro }`; arquivos em `data/uploads/<folder>`; fallback `nomeClinica`←`nomeTitular` quando `cnpjEmpresa` vazio; **validação server-side** de exame (laudo PDF ou tópicos — Gap 2); **respeita `quantidadeMedicos` enviada** (Gap 3). |
| `submissoes.test.ts` | `listarSubmissoes` (filtro status), `detalharSubmissao` (404), `aprovarSubmissao` (APROVADA, revalidate, audit APROVAR, **Jira mock sucesso** → SINCRONIZADO + `jiraIssueKey`, **Jira mock falha** → ERRO mantendo `{sucesso:true}` *fail-open*), `sincronizarJira` (guardas, **falha retorna `{erro}`** *fail-closed*), `rejeitarSubmissao`. |
| `admins.test.ts` | `criarAdmin` (duplicado, senha<6, hash `Account`), `excluirAdmin` (auto-exclusão e último admin bloqueados), `alterarSenha` (regex 8+/letra/número/especial, mismatch). |
| `auditoria.test.ts` | `listarAuditoria` respeita `userId`/`acao`/`dataInicio`/`dataFim` e limita 50. |
| `branding.test.ts` | `getBranding()` resolve override `data/branding` sobre `public/branding` + URL versionada `/api/branding/v{timestamp}/...`; `restaurarBrandingSlot`/`restaurarBrandingPadrao` removem arquivos + audit RESTAURAR. |
| `jira.test.ts` | `criarCardJira` monta ADF e retorna `issue.key` (mock sucesso) / lança (mock falha); `anexarArquivo` engole erros de anexo. |
| `auth.test.ts` | `login` válido → `{sucesso:true}`+audit LOGIN; inválido → `{erro}`; `getSession` nulo → `{erro:'Não autenticado'}`. |
| `api/uploads.test.ts` | GET sem sessão → 401; com sessão serve arquivo; path traversal (`..`) → 403; inexistente → 404. |
| `api/branding-api.test.ts` | POST auth-gated (401 sem sessão), `MAX_SIZE=5MB`, `ALLOWED_TYPES` png/jpeg/webp, valida `SLOTS`; DELETE remove slot/todos + audit. |
| `api/health.test.ts` | GET → `{ status: 'ok' }`. |

### Camada 2 — Playwright (E2E)

- **auth.spec** — `/` redireciona para `/formulario`; acesso `/admin` sem sessão → `/login`; login válido → `/admin`; logout → `/login`.
- **formulario.spec** — validação client-side bloqueia avanço com passo 0 vazio; preenche 4 passos (Clínica→Usuários→Exames→Equipamentos, via "Tópicos de conteúdo") e envia com sucesso.
- **admin-submissoes.spec** — listar, filtrar por status, abrir detalhe, **aprovar** (→ APROVADA + fail-open Jira), **sincronizar Jira** (erro fail-closed), **rejeitar** com motivo (→ REJEITADA).
- **branding.spec** — upload de slot PNG + sucesso; tipo não permitido → erro; Restaurar Padrão.
- **auditoria.spec** — lista logs; filtra por ação LOGIN.

## 6. CI

`.github/workflows/test.yml`: checkout → `pnpm install` → gera `.env`/`.env.test`
a partir de `.env.example` → `pnpm lint` → `pnpm build` → `pnpm test` (Vitest) →
`playwright install --with-deps` → `pnpm test:e2e`. O workflow de Docker
(`build.yml`) permanece inalterado.

## 7. Teste live do Jira (criação real de card)

Verifica a integração ponta a ponta com o Jira real: cria e remove um card de teste.
Exige **credenciais reais no `.env`** (gitignored — não são commitadas).

Pré-requisitos:
- `JIRA_BASE_URL`, `JIRA_EMAIL` e `JIRA_API_TOKEN` preenchidos com valores reais (não os
  placeholders do `.env.example`).
- Flag de opt-in `RUN_JIRA_LIVE=1`.

Comando:

```bash
RUN_JIRA_LIVE=1 pnpm test:jira:live
```

O que acontece:
1. **Self-check:** valida o token chamando `myself.getCurrentUser()`.
2. **Cria** um card dummy via `criarCardJira` e asserte a `issue.key` (ex.: `NCZ-1`).
3. **Remove** o card automaticamente (`deleteIssue`) para não poluir o board. Se o bot não
   tiver permissão de exclusão, emite `console.warn` e o card deve ser removido manualmente.

Observações:
- O teste vive em `tests/integration/` e **nunca** roda no `pnpm test:unit`/CI. Só executa
  quando `RUN_JIRA_LIVE=1` **e** as credenciais não são placeholders/dummy.
- O Vitest carrega `.env.test` (modo "test"), que contém credenciais dummy; o arquivo de teste
  sobrescreve com o `.env` real via `dotenv` (`override: true`).
- `pnpm test:integration` roda o arquivo mas **pula** os casos sem a flag.

---

## Adendo — Roadmap futuro: cobertura de 100%

O próximo passo natural desta suíte é elevar a **cobertura de código para 100%**
do projeto, capturada via `@vitest/coverage-v8` (já configurado). Sugestões de
tasks para quem quiser pegar:

- **Mapear lacunas com `pnpm test:unit --coverage`** e priorizar os arquivos
  abaixo do alvo.
- **Cobrir ramos de erro pouco exercitados**: timeouts de Jira, falhas de
  escrita de arquivo em `salvarArquivo`, e os caminhos `catch` de cada action.
- **Helpers de UI faltantes no E2E** (ex.: `CampoComLapis` de endereço,
  estados de loading/pending do `useActionState`) para reduzir risco de falso
  positivo.
- **Testes de acessibilidade** (contrastes, roles ARIA) e de responsividade.
- **Smoke de migração de banco** (rodar `prisma migrate` em fixture) para
  proteger o schema entre versões.
- **Gate de cobertura no CI**: falhar o pipeline se a cobertura cair abaixo do
  limite definido.

> Task aberta para qualquer dev: "Adicionar testes até atingir 100% de cobertura
> em `<alvo>`" — escolher um módulo (action/lib/rota) e fechar seus branches.
