# Task 4: Testar Backup/Restore

❌ **Pendente** — validação manual do fluxo

**Scripts locais (desenvolvimento):**
- Executar `wsl bash scripts/backup.sh` e verificar arquivos criados em `backups/`
- Executar `wsl bash scripts/restore.sh` sem argumentos e confirmar listagem
- Executar `wsl bash scripts/restore.sh <TIMESTAMP>` e verificar banco + uploads restaurados
- Verificar logs de execução

**Docker (produção):**
- Executar `docker compose exec backup sh` e verificar se o cron está ativo
- Executar manualmente `bash /scripts/backup.sh` dentro do container
- Verificar arquivos em `/backups` dentro e fora do container
- Simular restore: parar app, copiar backup, reiniciar

## Commit

```
test(backup): testar scripts de backup e restauração manualmente
```
