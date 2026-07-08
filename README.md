# ZScan Formulário

Sistema de coleta de dados de clínicas médicas com wizard público de 4 etapas, painel administrativo e integração com Jira.

**Next.js 15 · TypeScript · Prisma v7 (SQLite) · Better Auth · Tailwind v4 · Docker**

## Início rápido

```bash
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

> Setup completo com instruções de fork/branch em [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Documentação

| Onde | Conteúdo |
|------|----------|
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Setup, contribuição, git, workflow |
| [`docs/dev/`](docs/dev/) | Padrões de código, componentes, server actions, banco, estilos, git |
| [`docs/dev/DEV-WORKFLOW.md`](docs/dev/DEV-WORKFLOW.md) | HMR, teste em tempo real, comandos do dia a dia |
| [`docs/projeto/fases/`](docs/projeto/fases/) | Status do projeto (~44%) por fase |
