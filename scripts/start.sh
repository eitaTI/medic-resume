#!/bin/sh
set -e

echo "Rodando migrações do banco..."
pnpm exec prisma migrate deploy

echo "Verificando se o seed já foi executado..."
pnpm exec tsx prisma/seed.ts

echo "Iniciando o servidor..."
pnpm exec next start