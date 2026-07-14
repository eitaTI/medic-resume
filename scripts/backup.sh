#!/bin/sh

# Backup frio — copia direta dos arquivos
# Uso: ./scripts/backup.sh [diretorio_destino]
# Exemplo: ./scripts/backup.sh ./backups

BACKUP_DIR="${1:-./backups}"
DB_PATH="${DB_PATH:-./dev.db}"
UPLOADS_DIR="${UPLOADS_DIR:-./data/uploads}"
RETENCAO_DIAS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

mkdir -p "$BACKUP_DIR"

# Backup do SQLite (cópia fria)
if [ -f "$DB_PATH" ]; then
    if cp "$DB_PATH" "$BACKUP_DIR/db_$TIMESTAMP.db"; then
        echo "Backup do banco: $BACKUP_DIR/db_$TIMESTAMP.db"
    else
        echo "Erro: falha ao copiar o banco"
        exit 1
    fi
else
    echo "Erro: banco não encontrado em $DB_PATH"
    exit 1
fi

# Backup dos uploads
if [ -d "$UPLOADS_DIR" ]; then
    tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C "$UPLOADS_DIR" .
    echo "Backup dos uploads: $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz"
else
    echo "Aviso: diretório de uploads não encontrado em $UPLOADS_DIR"
fi

# Limpar backups antigos
find "$BACKUP_DIR" -type f -mtime +$RETENCAO_DIAS -delete 2>/dev/null || true

echo "Backup finalizado."
