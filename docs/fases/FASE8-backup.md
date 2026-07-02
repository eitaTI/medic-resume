# Fase 8: Sistema de Backup

Script de backup automático do banco e uploads.

## Objetivo

Proteger dados com backups regulares e restauração.

## Componentes

### 1. Script de Backup

Crie `scripts/backup.sh`:

```bash
#!/bin/bash

# Configurações
BACKUP_DIR="./backups"
DB_PATH="./prisma/dev.db"
UPLOADS_DIR="./data/uploads"
RETENCAO_DIAS=30

# Criar diretório de backups
mkdir -p "$BACKUP_DIR"

# Timestamp para nome dos arquivos
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=== Início do backup: $TIMESTAMP ==="

# Backup do banco de dados
echo "1. Fazendo backup do banco de dados..."
if [ -f "$DB_PATH" ]; then
    sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/db_$TIMESTAMP.db'"
    echo "   ✓ Banco salvo: db_$TIMESTAMP.db"
else
    echo "   ✗ Banco não encontrado: $DB_PATH"
fi

# Backup dos uploads
echo "2. Fazendo backup dos uploads..."
if [ -d "$UPLOADS_DIR" ]; then
    tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C . data/uploads/
    echo "   ✓ Uploads salvos: uploads_$TIMESTAMP.tar.gz"
else
    echo "   ✗ Diretório de uploads não encontrado"
fi

# Limpar backups antigos
echo "3. Limpando backups com mais de $RETENCAO_DIAS dias..."
find "$BACKUP_DIR" -name "*.db" -mtime +$RETENCAO_DIAS -delete 2>/dev/null
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENCAO_DIAS -delete 2>/dev/null
echo "   ✓ Limpeza concluída"

# Listar backups atuais
echo "4. Backups disponíveis:"
ls -lh "$BACKUP_DIR"/*.db 2>/dev/null | wc -l
echo "   bancos de dados"
ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null | wc -l
echo "   pacotes de uploads"

echo "=== Backup concluído: $(date +%H:%M:%S) ==="
```

Torne executável:

```bash
chmod +x scripts/backup.sh
```

### 2. Script de Restauração

Crie `scripts/restore.sh`:

```bash
#!/bin/bash

# Configurações
BACKUP_DIR="./backups"
DB_PATH="./prisma/dev.db"
UPLOADS_DIR="./data/uploads"

# Verificar se foi informado um timestamp
if [ -z "$1" ]; then
    echo "Uso: ./scripts/restore.sh <TIMESTAMP>"
    echo "Exemplo: ./scripts/restore.sh 20260701_020000"
    echo ""
    echo "Backups disponíveis:"
    ls "$BACKUP_DIR"/*.db 2>/dev/null | sed 's/.*db_//' | sed 's/\.db//' | sort -r
    exit 1
fi

TIMESTAMP=$1

echo "=== Restaurando backup: $TIMESTAMP ==="

# Restaurar banco
if [ -f "$BACKUP_DIR/db_$TIMESTAMP.db" ]; then
    echo "1. Restaurando banco de dados..."
    cp "$BACKUP_DIR/db_$TIMESTAMP.db" "$DB_PATH"
    echo "   ✓ Banco restaurado"
else
    echo "   ✗ Backup do banco não encontrado: db_$TIMESTAMP.db"
    exit 1
fi

# Restaurar uploads
if [ -f "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" ]; then
    echo "2. Restaurando uploads..."
    mkdir -p "$UPLOADS_DIR"
    tar -xzf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C ./
    echo "   ✓ Uploads restaurados"
else
    echo "   ⚠ Backup de uploads não encontrado, ignorando"
fi

echo "=== Restauração concluída ==="
echo "Reinicie o servidor: npm run dev"
```

Torne executável:

```bash
chmod +x scripts/restore.sh
```

### 3. Docker Compose com Backup

Adicione ao `docker-compose.yml`:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data/uploads:/app/data/uploads
      - ./prisma/dev.db:/app/prisma/dev.db
    environment:
      - DATABASE_URL=file:./dev.db
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - JIRA_BASE_URL=${JIRA_BASE_URL}
      - JIRA_EMAIL=${JIRA_EMAIL}
      - JIRA_API_TOKEN=${JIRA_API_TOKEN}
      - JIRA_PROJECT_KEY=${JIRA_PROJECT_KEY}
    restart: unless-stopped

  backup:
    image: alpine:latest
    volumes:
      - ./:/app
      - ./backups:/backups
    command: >
      sh -c "apk add --no-cache bash sqlite &&
             echo '0 2 * * * /app/scripts/backup.sh >> /backups/backup.log 2>&1' | crontab - &&
             crond -f -l 2"
    restart: unless-stopped
```

### 4. Testar Backup

```bash
# Executar backup manual
./scripts/backup.sh

# Verificar arquivos criados
ls -la backups/

# Testar restauração
./scripts/restore.sh <TIMESTAMP>
```

## Estrutura de Backups

```
backups/
├── db_20260701_020000.db          # Banco de dados
├── uploads_20260701_020000.tar.gz # Uploads comprimidos
├── db_20260702_020000.db          # Backup do dia seguinte
└── backup.log                     # Log de execuções
```

## Cronograma

| Tipo | Frequência | Retenção |
|------|------------|----------|
| Completo | Diário às 02:00 | 30 dias |

## Checklist

- [ ] scripts/backup.sh criado
- [ ] scripts/restore.sh criado
- [ ] Scripts executáveis
- [ ] Backup manual testado
- [ ] Restauração testada
- [ ] Docker compose com serviço de backup
- [ ] Cron configurado