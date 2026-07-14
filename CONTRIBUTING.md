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

Consulte os guias em `docs/dev/`:

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
- [ ] Server Actions em `actions/`, componentes na pasta correta
- [ ] Documentação atualizada se necessário
- [ ] PR com descrição clara do que foi feito
