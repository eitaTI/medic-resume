# Task 1: Script de Backup

❌ **Pendente** — criar `scripts/backup.sh`

Criar `scripts/backup.sh`:
- Config: `BACKUP_DIR=./backups`, `DB_PATH=./prisma/dev.db`, `UPLOADS_DIR=./data/uploads`, `RETENCAO_DIAS=30`
- Criar diretório de backups se não existir
- Backup do SQLite com `sqlite3 .backup`
- Backup dos uploads com `tar -czf`
- Limpar backups com mais de 30 dias
- Listar quantidade de backups disponíveis
- Tornar executável: `chmod +x scripts/backup.sh`

## Commit

```
feat(backup): criar script de backup automático do banco e uploads
```
