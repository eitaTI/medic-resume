#!/bin/bash

# Script de Restauração de Backup
# Uso: ./scripts/restore.sh <TIMESTAMP>

BACKUP_DIR="./backups"
DB_PATH="./prisma/dev.db"
UPLOADS_DIR="./data/uploads"

# Verifica se o timestamp foi informado
if [ -z "$1" ]; then
    echo "Uso: $0 <TIMESTAMP>"
    echo "Backups disponíveis:"
    ls -1 "$BACKUP_DIR" | grep "db_" | sed 's/db_\(.*\)\.db/\1/'
    exit 1
fi

TIMESTAMP=$1

DB_BACKUP="$BACKUP_DIR/db_$TIMESTAMP.db"
UPLOADS_BACKUP="$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz"

# Verifica se os arquivos de backup existem
if [ ! -f "$DB_BACKUP" ]; then
    echo "Erro: Backup do banco não encontrado: $DB_BACKUP"
    exit 1
fi

if [ ! -f "$UPLOADS_BACKUP" ]; then
    echo "Erro: Backup dos uploads não encontrado: $UPLOADS_BACKUP"
    exit 1
fi

# Restauração do Banco
echo "Restaurando banco de dados..."
cp "$DB_BACKUP" "$DB_PATH"
echo "Banco restaurado com sucesso."

# Restauração dos Uploads
echo "Restaurando uploads..."
# Remove diretório de uploads atual para evitar conflitos antes de extrair
rm -rf "$UPLOADS_DIR"
mkdir -p "$UPLOADS_DIR"
tar -xzf "$UPLOADS_BACKUP" -C "$UPLOADS_DIR"
echo "Uploads restaurados com sucesso."

echo "Restauração concluída!"
echo "Agora você pode iniciar o servidor com: npm run dev"
