#!/bin/bash

# Caminhos parametrizáveis (defaults para desenvolvimento local; em Docker,
# o docker-compose injeta DB_PATH/UPLOADS_DIR/BACKUP_DIR apontando para os volumes)
DB_PATH="${DB_PATH:-./dev.db}"
UPLOADS_DIR="${UPLOADS_DIR:-./data/uploads}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENCAO_DIAS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Criar diretório de backups se não existir
mkdir -p "$BACKUP_DIR"

# Backup do SQLite
# Requer o comando sqlite3 (instalado em WSL/Git Bash ou no container Docker)
if [ -f "$DB_PATH" ]; then
    if ! command -v sqlite3 >/dev/null 2>&1; then
        # Fallback para ambientes sem o CLI do sqlite3 (ex.: validação local).
        # Em produção (Docker) o pacote `sqlite` está instalado e usamos `.backup`.
        echo "Aviso: 'sqlite3' não encontrado; usando cópia do arquivo (backup offline)."
        if cp "$DB_PATH" "$BACKUP_DIR/db_$TIMESTAMP.db"; then
            echo "Backup do banco realizado (cópia): $BACKUP_DIR/db_$TIMESTAMP.db"
        else
            echo "Erro: falha ao copiar o banco em $BACKUP_DIR/db_$TIMESTAMP.db"
            DB_ERRO=1
        fi
    elif ! sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/db_$TIMESTAMP.db'"; then
        echo "Erro: falha ao gerar backup do banco em $BACKUP_DIR/db_$TIMESTAMP.db"
        DB_ERRO=1
    else
        echo "Backup do banco realizado: $BACKUP_DIR/db_$TIMESTAMP.db"
    fi
else
    echo "Erro: Banco de dados não encontrado em $DB_PATH"
    DB_ERRO=1
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

# Sai com erro se alguma etapa falhou
if [ -n "$DB_ERRO" ]; then
    exit 1
fi
