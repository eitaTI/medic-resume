# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache --virtual .build-deps python3 make g++

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm --activate

# Install dependencies (separate from source for layer caching)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Ensure expected directories exist for downstream COPY
RUN mkdir -p public scripts

# Generate Prisma client and build Next.js
RUN pnpm prisma generate
RUN pnpm build

# Stage 2: Runner
FROM node:18-alpine AS runner

WORKDIR /app

# Install SQLite CLI
RUN apk add --no-cache sqlite

# Copy production artifacts from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/next.config.ts ./

# Create uploads directory
RUN mkdir -p data/uploads

# Expose application port
EXPOSE 3000

# Start Next.js in production mode
CMD ["pnpm", "start"]
