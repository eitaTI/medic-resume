# Task 1: Dockerfile

❌ **Pendente** — criar `Dockerfile`

Criar `Dockerfile` multi-stage usando `output: 'standalone'` do Next.js:

```dockerfile
# Stage 1: Dependencies + Build
FROM node:22-alpine AS builder
WORKDIR /app

# Instalar dependências do Prisma (openssl para SQLite)
RUN apk add --no-cache openssl

# Copiar apenas arquivos de dependências
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Copiar o resto e buildar
COPY . .
RUN npx prisma generate
RUN pnpm build

# Stage 2: Produção — apenas o standalone + runtime
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar standalone do Next.js
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma runtime necessário para conexão com banco
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Script de entrypoint para rodar migrate + seed
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000

CMD ["node", "server.js"]
```

**Pré-requisito:** `next.config.ts` deve ter `output: 'standalone'`.

## Commit

```
feat(docker): criar Dockerfile multi-stage com standalone output
```
