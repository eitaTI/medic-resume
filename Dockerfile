# Etapa 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl python3 make g++
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm rebuild better-sqlite3
COPY . .
RUN pnpm exec prisma generate
RUN pnpm build

# Etapa 2: Execução (node_modules completo)
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl && corepack enable
ENV NODE_ENV=production
# Tudo da etapa de build (incluindo todos os node_modules)
COPY --from=builder /app ./
RUN mkdir -p /app/data/branding && chmod +x scripts/*.sh
CMD ["sh", "scripts/start.sh"]