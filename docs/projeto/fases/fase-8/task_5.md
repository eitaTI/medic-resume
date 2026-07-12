# Task 5: Compatibilidade Docker dos Scripts de Backup

✅ **Concluído** — scripts parametrizados via env vars e serviço `backup` do compose ajustado

Os scripts agora usam variáveis de ambiente com fallback para desenvolvimento local:
`DB_PATH` (default `./dev.db`), `UPLOADS_DIR` (default `./data/uploads`),
`BACKUP_DIR` (default `./backups`).

O `docker-compose.yml` injeta no serviço `backup`:
`DB_PATH=/data/db/dev.db`, `UPLOADS_DIR=/data/uploads`, `BACKUP_DIR=/backups`, e o
cron executa com essas variáveis.

> **Dependência da Fase 9:** o serviço `app` do compose ainda é placeholder
> (`image: node:20-alpine` com volume `sqlite-data:/app/prisma`). Como o banco real fica
> em `./dev.db` (raiz do cwd), o volume do banco no container deve montar `/app` (ou o
> `backup` apontar para `/app/dev.db`) quando a Fase 9 definir o `Dockerfile` real.

## Commit

```
fix(backup): parametrizar caminhos dos scripts via env vars para suportar Docker
```
