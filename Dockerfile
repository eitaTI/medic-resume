# Etapa 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl python3 make g++
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm rebuild better-sqlite3
COPY . .
RUN pnpm exec prisma generate
RUN pnpm build

# Etapa 2: Execução
FROM node:24-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Install only production dependencies (though we need all for this app due to native modules)
# But we set the user anyway for security
RUN apk add --no-cache openssl && corepack enable

# Set environment variables
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

# Copy only necessary files from builder
COPY --from=builder /app ./

# Set proper ownership for non-root user
RUN chown -R nextjs:nodejs /app
RUN mkdir -p /app/data/branding && chown -R nextjs:nodejs /app/data/branding
RUN chmod +x scripts/*.sh

# Add metadata labels
LABEL org.opencontainers.image.source="https://github.com/eitati/medic-resume"
LABEL org.opencontainers.image.description="EitaTI Formulário - Sistema de cadastro e integração de clínicas médicas"
LABEL org.opencontainers.image.licenses=MIT
LABEL org.opencontainers.image.version="latest"
LABEL org.opencontainers.image.created=${BUILD_DATE:-}

CMD ["sh", "scripts/entrypoint.sh"]