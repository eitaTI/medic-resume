# Contribuindo

Guia para contribuir com o projeto.

## Setup

```bash
git clone <seu-fork> && cd medic-resume
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm prisma db seed          # admin@eitati.com / admin123
pnpm dev                     # http://localhost:3000
```

## Git

Padrões detalhados em [`docs/dev/GIT.md`](docs/dev/GIT.md):

- Branch: `tipo/tarefa-curta` — `feat/formulario-wizard`
- Commit: `tipo(escopo): descrição` — `feat(auth): adiciona tela de login`

## Workflow de Desenvolvimento

Guia completo em [`docs/dev/DEV-WORKFLOW.md`](docs/dev/DEV-WORKFLOW.md):

- Servidor com HMR, teste em tempo real, comandos Prisma
- Rode `pnpm build && pnpm lint` antes de commitar

## Padrões de Código

Guie-se pelos guias em `docs/dev/`:

| Guia | O que cobre |
|------|-------------|
| [`ARQUITETURA.md`](docs/dev/ARQUITETURA.md) | Estrutura de pastas, stack, data flow, decisões |
| [`COMPONENTES.md`](docs/dev/COMPONENTES.md) | Server vs Client, props, composição |
| [`SERVER-ACTIONS.md`](docs/dev/SERVER-ACTIONS.md) | Padrão, retorno, autenticação, auditoria |
| [`CODIGO.md`](docs/dev/CODIGO.md) | Nomenclatura, tipagem, imports, validação |
| [`BANCO-DE-DADOS.md`](docs/dev/BANCO-DE-DADOS.md) | Schema, queries, paginação, comandos |
| [`ESTILIZACAO.md`](docs/dev/ESTILIZACAO.md) | Tailwind v4, paleta, responsividade |

## Checklist de PR

- [ ] Compila sem erros (`pnpm build`)
- [ ] Lint passa (`pnpm lint`)
- [ ] Testes passam (`pnpm test` + `pnpm test:e2e`)
- [ ] Server Actions em `actions/`, componentes na pasta correta, novos passos do wizard registrados em `LABELS`, `camposPorPasso`, `irParaPassoComErro`, banner cross-step e `defaultValues`
- [ ] Documentação atualizada se necessário
- [ ] PR com descrição clara do que foi feito

## Contrato dos helpers E2E (`tests/e2e/helpers.ts`)

Campo obrigatório novo no wizard? Atualize **junto** o helper, ou o fluxo
feliz quebra sem erro claro:

- Preencha vendedor + tipo via `selecionarVendedorETipo(page)` (nunca
  `selectOption` direto — as opções chegam async via `/api/opcoes-cadastro`).
- Chamadas de rede externa precisam de mock via `page.route` em
  `mockBrasilApi(page)` **antes** do `goto` (CEP/CNPJ). Teste E2E não depende
  de internet.
- Todo campo com validação no passo 0 deve ter cobertura no helper — o `trigger`
  bloqueia o avanço silenciosamente se algo faltar.
