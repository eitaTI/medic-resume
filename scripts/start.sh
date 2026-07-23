#!/bin/sh
set -e

echo "=== Iniciando aplicação Medic Resume ==="
echo "Data: $(date)"
echo "Ambiente: $NODE_ENV"
echo "Hostname: $HOSTNAME"

# Exibir algumas variáveis de ambiente (sem mostrar segredos)
echo "DATABASE_URL: ${DATABASE_URL:-'não definido'}"
echo "BETTER_AUTH_URL: ${BETTER_AUTH_URL:-'não definido'}"
if [ -n "$BETTER_AUTH_SECRET" ]; then
	echo "BETTER_AUTH_SECRET: definido (oculto por segurança)"
else
	echo "BETTER_AUTH_SECRET: não definido"
fi

# Verificar se Jira está configurado
if [ -n "$JIRA_BASE_URL" ] && [ -n "$JIRA_EMAIL" ] && [ -n "$JIRA_API_TOKEN" ]; then
	echo "JIRA_CONFIGURED: sim"
else
	echo "JIRA_CONFIGURED: não"
fi

echo "Rodando migrações do banco..."
if ! pnpm exec prisma migrate deploy; then
	echo "Erro: Falha ao executar migrações do banco de dados"
	echo "Verifique se o DATABASE_URL está correto e se o banco de dados está acessível"
	exit 1
fi

echo "Verificando se o seed já foi executado..."
if ! pnpm exec tsx prisma/seed.ts; then
	echo "Erro: Falha ao executar seed do banco de dados"
	exit 1
fi

echo "Iniciando o servidor Next.js..."
echo "Acesse a aplicação em: http://$HOSTNAME:3000"
if ! pnpm exec next start; then
	echo "Erro: Falha ao iniciar o servidor Next.js"
	exit 1
fi
