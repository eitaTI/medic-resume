# Stage 1: Dependências + Build
FROM node:22-alpine AS builder
WORKDIR /app

# openssl (runtime do Prisma/better-sqlite3) + toolchain para compilar better-sqlite3 no musl
RUN apk add --no-cache openssl python3 make g++

# Copiar apenas arquivos de dependências (cache de camadas)
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --ignore-scripts

# Copiar o resto e buildar
COPY . .
RUN pnpm exec prisma generate
RUN pnpm build

# Stage 2: Produção
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Saída standalone do Next.js
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Scripts de entrypoint
COPY --from=builder /app/scripts ./scripts

RUN chmod +x ./scripts/start.sh

EXPOSE 3000

CMD ["sh", "scripts/start.sh"]

# Stage 3: Migrator (reusa builder que já tem node_modules + prisma + tsx)
FROM builder AS migrator
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && tsx prisma/seed.ts"]
