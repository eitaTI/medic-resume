# Plano de Regressão — medic-resume

> Suíte automatizada para validar todo o funcionamento do sistema após mudanças.
> Stack: **Vitest** (unit/integration) + **Playwright** (E2E). Jira **mockado**.

## 1. Objetivo

Criar uma suíte de regressão que valide **todo o funcionamento** do sistema: submissão do
formulário (wizard), autenticação de admin, revisão (aprovar/rejeitar/sincronizar Jira),
branding, auditoria, upload/serviço de arquivos e APIs.

Hoje não há nenhum framework de teste instalado (só `pnpm lint` + `next build`).

## 2. Stack (definida)

- **Vitest** — testes unitários/integração de Server Actions, libs (`lib/jira`, `lib/branding`,
  `lib/audit`, `lib/validacoes`) e rotas de API, com **DB de teste isolado** (SQLite `test.db`).
- **Playwright** — testes E2E de ponta-a-ponta cobrindo jornadas reais no navegador.
- **Jira mockado** — `jira.js` substituído por mock (sucesso + falha) via `vi.mock` no Vitest;
  no Playwright o servidor roda com `JIRA_*` dummy (o *fail-open* cobre o caminho de erro).

## 3. Estrutura de arquivos (na raiz)

```
PLANO_REGRESSAO.md            # este plano
vitest.config.ts
playwright.config.ts
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
  fixtures/                  # arquivos de exemplo (logo.png, laudo.pdf)
  helpers/                   # setup/teardown de DB, auth de admin
test.db                      # (gitignored)
.env.test                    # (gitignored)
```

Adicionar ao `package.json`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:unit": "vitest run tests/unit tests/api",
  "test:e2e": "playwright test"
}
```

## 4. Ambiente e dados

- `.env.test` (gitignored): `DATABASE_URL=file:./test.db`, `BETTER_AUTH_SECRET` dummy (>=32
  chars), `NEXT_PUBLIC_BETTER_AUTH_URL`, `JIRA_*` dummy.
- `tests/helpers/db.ts`: antes de cada suite, reset do DB de teste + execução do `seed.ts`
  (cria admin `admin@eitati.com` / `admin123`) num schema isolado.
- Helper `loginAsAdmin()` que faz signIn via Better Auth e injeta o cookie
  `better-auth.session_token` para testes de rotas/actions protegidas.
- Uploads de teste em `os.tmpdir()` (ou `data/uploads_test/`) para não poluir `data/uploads`.

## 5. Camada 0 — Porta de qualidade (existente)

`pnpm lint` e `pnpm build` devem passar antes da suíte. Documentar como gate inicial.

## 6. Camada 1 — Vitest (unit/integration)

| Arquivo | O que cobre |
|---|---|
| `validacoes.test.ts` | `schemaClinica` (email, CPF 11, CNPJ 14/empty, `quantidadeMedicos>=1`), `schemaMedico`, `schemaExame`, `schemaDispositivo`, `schemaFormulario` (superRefine: exame precisa laudo PDF OU tópicos; laudo `instanceof File`). |
| `submeter-formulario.test.ts` | Submissão pública válida cria `Clinica`+`Medicos`+`Exames`+`Dispositivos` e `revalidatePath`; inválida retorna `{ erro }`; arquivos em `data/uploads/<folder>`; fallback `nomeClinica`<-`nomeTitular` quando `cnpjEmpresa` vazio. |
| `submissoes.test.ts` | `listarSubmissoes` (filtro status), `detalharSubmissao` (404), `aprovarSubmissao` (APROVADA, revalidate, audit APROVAR, **Jira mock sucesso** -> SINCRONIZADO + `jiraIssueKey`, **Jira mock falha** -> ERRO mantendo `{sucesso:true}` *fail-open*), `sincronizarJira` (guardas, **falha retorna `{erro}`** *fail-closed*), `rejeitarSubmissao`. |
| `admins.test.ts` | `criarAdmin` (duplicado, senha<6, hash `Account`), `excluirAdmin` (auto-exclusão e último admin bloqueados), `alterarSenha` (regex 8+/letra/número/especial, mismatch). |
| `auditoria.test.ts` | `listarAuditoria` respeita `userId`/`acao`/`dataInicio`/`dataFim` e limita 50. |
| `branding.test.ts` | `getBranding()` resolve override `data/branding` sobre `public/branding` + URL versionada `/api/branding/v{timestamp}/...`; `restaurarBrandingSlot`/`restaurarBrandingPadrao` removem arquivos + audit RESTAURAR. |
| `jira.test.ts` | `criarCardJira` monta ADF e retorna `issue.key` (mock sucesso) / lança (mock falha); `anexarArquivo` engole erros de anexo. |
| `auth.test.ts` | `login` válido -> `{sucesso:true}`+audit LOGIN; inválido -> `{erro}`; `getSession` nulo -> `{erro:'Não autenticado'}`. |
| `api/uploads.test.ts` | GET sem sessão -> 401; com sessão serve arquivo; path traversal (`..`) -> 403; inexistente -> 404. |
| `api/branding-api.test.ts` | POST auth-gated (401 sem sessão), `MAX_SIZE=5MB`, `ALLOWED_TYPES` png/jpeg/webp, valida `SLOTS`; DELETE remove slot/todos + audit. |
| `api/health.test.ts` | GET -> `{ status: 'ok' }`. |

## 7. Camada 2 — Playwright (E2E)

- **auth.spec** — `/` redireciona para `/formulario`; acesso `/admin` sem sessão -> `/login`;
  login válido -> `/admin`; logout -> `/login`.
- **formulario.spec** — preencher 4 passos (Clínica->Usuários->Exames->Equipamentos), anexar
  logo/laudo, submeter -> tela de sucesso; validações client-side bloqueiam avanço.
- **admin-submissoes.spec** — listar, filtrar por status, abrir detalhe, **aprovar**,
  **rejeitar** com motivo, **sincronizar Jira**.
- **branding.spec** — upload de 6 slots, visualizar no `/login` e layout admin, restaurar padrão.
- **auditoria.spec** — `/admin/auditoria`, filtrar por ação/data, confirmar registros de
  login/aprovar/criar admin.

## 8. CI (`.github/workflows/test.yml`)

Adicionar workflow: checkout -> `pnpm install` -> reset do DB de teste -> `pnpm lint` ->
`pnpm build` -> `pnpm test` (Vitest) -> `pnpm test:e2e` (Playwright com
`playwright install --with-deps`). Manter o `build.yml` existente para imagem Docker.

## 9. Riscos / gaps descobertos e CORRIGIDOS

- [x] **`proxy.ts` era código morto** (sem `middleware.ts`; não era importado). A guarda real de
  `/admin` é o `redirect` em `app/admin/layout.tsx` e as rotas `/api/*` auto-validam a sessão.
  **Corrigido:** arquivo `proxy.ts` removido. Sem perda funcional.
- [x] **Assimetria de validação (exame laudo/tópicos)** — risco de segurança/LGPD. O `superRefine`
  de `schemaFormulario` (laudo PDF OU tópicos) só rodava client-side; a action `submeterFormulario`
  (pública) validava só os schemas por item. **Corrigido:** `actions/submeter-formulario.ts` agora
  valida server-side, no loop de exames, se há laudo PDF (`File`+tipo/ext `.pdf`) OU tópicos; exame
  sem nenhum dos dois ou com laudo não-PDF retorna `{ erro }`. Testes adicionados em
  `tests/unit/submeter-formulario.test.ts` (exame sem laudo/tópicos → erro; só tópicos → sucesso;
  laudo não-PDF → erro).
- [x] **`quantidadeMedicos` (redação corrigida)** — o cliente **envia** `quantidadeMedicos`
  (`app/formulario/page.tsx`), mas o servidor ignorava esse valor e **recomputava** (contagem de
  médicos `examinador`). Ou seja, o valor enviado era descartado e o computado ia ao banco.
  **Corrigido:** `actions/submeter-formulario.ts` usa o valor enviado quando válido (≥1), com
  fallback para o computado. Teste adicionado (envio `3` → `clinica.quantidadeMedicos === 3`).
  Recomendação: o wizard deveria definir `quantidadeMedicos` a partir da contagem real de `usuarios`.
- [x] **Dependências mortas `ofetch` e `bcryptjs`** — nenhum uso no código (auth usa
  `hashPassword` de `@better-auth/utils`; Jira usa `jira.js`). **Corrigido:** removidas de
  `package.json` (e `@types/bcryptjs`), lockfile podado via `pnpm install`.

## 10. Cronograma executável (checklist por fase)

- [x] **Fase A — Setup de tooling**
  - [ ] `pnpm add -D vitest @vitest/coverage-next playwright @playwright/test`
  - [ ] Criar `vitest.config.ts`, `playwright.config.ts`
  - [ ] Adicionar scripts `test`/`test:unit`/`test:e2e`/`test:watch` no `package.json`
  - [ ] Criar `.env.test` e adicionar `test.db`, `.env.test` ao `.gitignore`
  - [ ] Criar `tests/helpers/db.ts` (reset + seed) e `loginAsAdmin()`
  - [ ] Criar `tests/fixtures/` (logo.png, laudo.pdf)

- [x] **Fase B — Camada 1 (Vitest)**
  - [x] `validacoes.test.ts`
  - [x] `auth.test.ts`
  - [x] `submeter-formulario.test.ts`
  - [x] `submissoes.test.ts` (com mock Jira sucesso/falha)
  - [x] `admins.test.ts`
  - [x] `auditoria.test.ts`
  - [x] `branding.test.ts`
  - [x] `jira.test.ts`
  - [x] `api/health.test.ts`, `api/uploads.test.ts`, `api/branding-api.test.ts`
  - Notas: 80 testes passando (`pnpm test:unit`). `vitest.config.ts` com `fileParallelism: false`
    (os arquivos compartilham `test.db`; rodar em paralelo corrompia o banco via `db push --force-reset`).
    Ações protegidas mockam `@/lib/auth` (`getSession` → admin ou null); `next/cache` e `next/headers` mockados.

- [x] **Fase C — Camada 2 (Playwright E2E)**
  - [x] `auth.spec.ts` (redireciona `/`→`/formulario`; `/admin` sem sessão→`/login`; login válido→`/admin`; logout→`/login`)
  - [x] `formulario.spec.ts` (validação client-side bloqueia passo 0 vazio; preenche 4 passos via "Tópicos de conteúdo" e envia com sucesso)
  - [x] `admin-submissoes.spec.ts` (aprovar → APROVADA + fail-open Jira; sincronizar novamente → erro fail-closed; rejeitar com motivo → REJEITADA)
  - [x] `branding.spec.ts` (upload de slot PNG + sucesso; tipo não permitido → erro; Restaurar Padrão)
  - [x] `auditoria.spec.ts` (lista logs; filtra por ação LOGIN)
  - Notas: 13 testes passando (`pnpm test:e2e`). `playwright.config.ts` usa `workers: 1` (servidor
    de dev único compartilhado — paralelismo causava timeout na compilação a frio) e `timeout: 90s`.
    `globalSetup` popula um banco isolado `e2e.db` (via `DATABASE_URL` no `webServer.env`) para não
    destruir o `dev.db`. fixtures em `tests/fixtures/logo.png`.

- [x] **Fase D — CI & documentação**
  - [x] `.github/workflows/test.yml` (checkout → setup pnpm/node → `pnpm install` → gera `.env`/`.env.test` a partir de `.env.example` → `pnpm lint` → `pnpm build` → `pnpm test` (Vitest) → `playwright install --with-deps` → `pnpm test:e2e`)
  - [x] Validado localmente: `pnpm lint` (limpo) + `pnpm build` (ok) + `pnpm test` (80 Vitest) + `pnpm test:e2e` (13 Playwright)
  - [x] Revisar gaps do item 9 e aplicar correções (ver Item 9 — todos resolvidos)
  - Notas: o `build.yml` (imagem Docker GHCR) permanece inalterado. O workflow de testes é
    separado. `vitest.config.ts` (`fileParallelism:false`) + `playwright.config.ts` (`workers:1`)
    justificados pela contenção de um único banco/dev-server compartilhado.

## 11. Comandos de execução

```bash
pnpm install
cp .env.example .env.test        # ajustar DATABASE_URL=file:./test.db + segredo dummy
pnpm test:unit                  # Vitest (ações + rotas)
pnpm test:e2e                   # Playwright (jornadas)
pnpm test                       # tudo
```
