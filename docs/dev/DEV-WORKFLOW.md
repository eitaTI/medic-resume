# Workflow de Desenvolvimento

Como desenvolver e testar alterações em tempo real no projeto.

## Servidor de Desenvolvimento

```bash
pnpm dev
```

Inicia o Next.js em `http://localhost:3000` com **Hot Module Replacement (HMR)** ativo.

### O que é HMR?

HMR permite que as alterações em arquivos sejam aplicadas instantaneamente no navegador **sem recarregar a página**. Você edita o código, salva, e a mudança aparece em milissegundos.

| Tipo de alteração | Comportamento |
|---|---|
| Componente React (.tsx) | Atualiza no navegador sem perder estado |
| CSS / Tailwind | Atualiza no navegador sem perder estado |
| Server Action | Next.js recompila e aplica na próxima chamada |
| Server Component | Re-renderiza no servidor e envia atualização |
| Prisma schema | Requer `pnpm prisma generate` + reiniciar dev |
| `next.config.ts` | Requer reiniciar `pnpm dev` |

## Testando Mudanças em Tempo Real

### Fluxo recomendado

1. Deixe `pnpm dev` rodando em um terminal
2. Edite os arquivos no seu editor
3. Salve (Ctrl+S) — as mudanças são refletidas automaticamente
4. Verifique no navegador em `http://localhost:3000`

### Navegação entre páginas

| URL | Descrição |
|---|---|
| `http://localhost:3000` | Página inicial com links |
| `http://localhost:3000/formulario` | Wizard de cadastro (4 etapas) |
| `http://localhost:3000/login` | Login do admin |
| `http://localhost:3000/admin` | Painel administrativo (protegido) |

## Banco de Dados

### Após alterar o schema Prisma

```bash
pnpm prisma generate         # Atualiza o client
pnpm prisma migrate dev      # Cria migração + aplica
```

> O `prisma generate` já roda automaticamente no `postinstall`, mas após alterar o schema você precisa rodar manualmente.

### Resetar o banco

```bash
pnpm prisma migrate reset    # Apaga dados + reaplica migrações + seed
```

### Visualizar dados

```bash
pnpm prisma studio           # Abre interface web (http://localhost:5555)
```

## Otimizações de Performance no Dev

### Turbopack (default no Next.js 16)

O Next.js 16 usa Turbopack por padrão para `dev` e `build`. Módulos nativos como `better-sqlite3` e `@prisma/adapter-better-sqlite3` são automaticamente excluídos do bundle do Turbopack.

### Proteção de rotas

Não há `proxy.ts`/`middleware.ts` no projeto. A proteção é feita por Server Component: `app/admin/layout.tsx` chama `auth.api.getSession` e redireciona para `/login` quando não há sessão. Rotas de API protegidas (ex.: `/api/uploads`) validam a sessão inline e retornam 401. O cookie de sessão é o padrão do Better Auth (`better-auth.session_token`).

## Antes de Commitar

```bash
pnpm build    # Verifica TypeScript + compilação
pnpm lint     # Verifica ESLint
```

> Rode esses comandos **antes de commitar**. O `pnpm build` valida se o projeto compila corretamente.

## Resumo de Comandos

| Comando | Quando usar |
|---------|-------------|
| `pnpm dev` | Durante o desenvolvimento (sempre rodando) |
| `pnpm build` | Antes de commitar / fazer PR |
| `pnpm lint` | Antes de commitar |
| `pnpm prisma generate` | Após alterar o schema |
| `pnpm prisma migrate dev` | Após alterar o schema |
| `pnpm prisma db seed` | Para recriar dados iniciais |
| `pnpm prisma studio` | Para inspecionar dados |
