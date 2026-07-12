#!/bin/bash

# Configurações
BACKUP_DIR="./backups"
DB_PATH="./prisma/dev.db"
UPLOADS_DIR="./data/uploads"
RETENCAO_DIAS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Criar diretório de backups se não existir
mkdir -p "$BACKUP_DIR"

# Backup do SQLite
# Certifique-se de que o comando sqlite3 está disponível
if [ -f "$DB_PATH" ]; then
    sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/db_$TIMESTAMP.db'"
    echo "Backup do banco realizado: $BACKUP_DIR/db_$TIMESTAMP.db"
else
    echo "Erro: Banco de dados não encontrado em $DB_PATH"
fi

# Backup dos uploads
if [ -d "$UPLOADS_DIR" ]; then
    tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C "$UPLOADS_DIR" .
    echo "Backup dos uploads realizado: $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz"
else
    echo "Erro: Diretório de uploads não encontrado em $UPLOADS_DIR"
fi

# Limpar backups com mais de 30 dias
find "$BACKUP_DIR" -type f -mtime +$RETENCAO_DIAS -delete
echo "Backups com mais de $RETENCAO_DIAS dias removidos."

# Listar quantidade de backups disponíveis
QUANTIDADE=$(ls -1 "$BACKUP_DIR" | wc -l)
echo "Backup finalizado. Total de arquivos de backup: $QUANTIDADE"
