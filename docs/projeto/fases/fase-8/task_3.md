# Task 3: Serviço de Backup no Docker Compose

✅ **Concluído**  — adicionar serviço de backup ao `docker-compose.yml`

Complementar o `docker-compose.yml` criado na **Fase 9** com o serviço de backup:

```yaml
services:
  app:
    # ... definido na Fase 9 ...

  backup:
    image: alpine:latest
    volumes:
      - sqlite-data:/data/db:ro
      - uploads:/data/uploads:ro
      - ./backups:/backups
      - ./scripts:/scripts:ro
    entrypoint: |
      sh -c "
        apk add --no-cache sqlite bash &&
        echo '0 2 * * * cd /scripts && bash backup.sh' | crontab - &&
        crond -f -l 2
      "
    restart: unless-stopped
    depends_on:
      - app
```

**Volumes adicionais no `docker-compose.yml`:** (já estão em `volumes:`)
```yaml
volumes:
  uploads:
  sqlite-data:
```

**Criar diretório local:**
```bash
mkdir -p backups
```

## Commit

```
feat(backup): adicionar serviço de backup no docker-compose com cron diário
```
