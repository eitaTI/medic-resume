# ZScan Formulário

Sistema de coleta de dados de clínicas médicas com painel administrativo e integração Jira.

**Stack:** Next.js 15 (App Router) · TypeScript · Prisma v7 (SQLite) · Better Auth · Tailwind CSS v4 · Docker

## Início rápido

```bash
pnpm install
cp .env.example .env
pnpm prisma db seed        # admin@zscan.com / admin123
npx prisma studio   #Para verificar os dados no banco Isso abre uma interface web no navegador onde você pode ver todas as tabelas e dados inseridos.
pnpm dev
```

Acesse `http://localhost:3000` → página inicial
Acesse `http://localhost:3000/formulario` → wizard de cadastro

## Comandos

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Iniciar servidor de desenvolvimento |
| `pnpm build` | Compilar produção + type check + ESLint |
| `pnpm eslint` | Verificar lint manualmente |
| `pnpm prisma db seed` | Popular banco com admin padrão |

## Status do Projeto

~30% implementado ([detalhes](docs/projeto/fases/)). Fases concluídas:

- **Fase 1** ✅ — Setup (Next.js, Prisma v7, Better Auth, Tailwind v4)
- **Fase 2** ⚠️ — Formulário público (2 de 4 etapas do wizard)
- **Fase 3** ⚠️ — Auth (Better Auth configurado, rota API criada, faltam tela de login e middleware)

## Pré-requisitos para continuar

- Better Auth requer o arquivo `app/api/auth/[...all]/route.ts` (já criado) — sem ele, login não funciona
- O diretório `data/uploads/` é usado para arquivos enviados (fora de `public/`)
- `eslint.config.mjs` usa flat config — rode `pnpm eslint` em vez do legado `next lint`

## Documentação

- **[docs/dev/](./docs/dev/)** — padrões de código, componentes, server actions, banco, estilos, git
- **[docs/projeto/fases/](./docs/projeto/fases/)** — plano de implementação com 9 fases e tasks individuais
