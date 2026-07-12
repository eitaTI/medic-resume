#!/bin/sh
set -e

# Aplica as migrações no banco de produção (volume persistido)
echo "Aplicando migrações do Prisma..."
./node_modules/.bin/prisma migrate deploy

# Cria o usuário admin padrão (falha não interrompe o start)
echo "Executando seed do admin..."
./node_modules/.bin/tsx prisma/seed.ts || true

exec node server.js
