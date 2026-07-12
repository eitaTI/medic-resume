# Task 1: Script de Backup

✅ **Concluído** — criar `scripts/backup.sh`

Criar `scripts/backup.sh`:
- Config: `BACKUP_DIR=./backups`, `DB_PATH=./prisma/dev.db`, `UPLOADS_DIR=./data/uploads`, `RETENCAO_DIAS=30`
- Criar diretório de backups se não existir
- Backup do SQLite com `sqlite3 .backup`
- Backup dos uploads com `tar -czf`
- Nome dos arquivos com timestamp: `db_20250101_120000.db`, `uploads_20250101_120000.tar.gz`
- Limpar backups com mais de 30 dias
- Listar quantidade de backups disponíveis no final
- Tornar executável: `chmod +x scripts/backup.sh`

**Ambiente Windows:** Executar via WSL (`wsl bash scripts/backup.sh`) ou Git Bash.

## Commit

```
feat(backup): criar script de backup automático do banco e uploads
```
