# Task 3: Docker Compose com Backup

❌ **Pendente** — atualizar `docker-compose.yml`

Adicionar ao `docker-compose.yml`:
- Serviço `app`: build, porta 3000, volumes para `data/uploads` e `prisma/dev.db`, variáveis de ambiente, `restart: unless-stopped`
- Serviço `backup`: imagem `alpine:latest`, volumes para app e backups, instalar bash+sqlite, cron diário às 02:00 executando `scripts/backup.sh`, `restart: unless-stopped`

## Commit

```
feat(backup): adicionar serviço de backup no docker-compose com cron diário
```
