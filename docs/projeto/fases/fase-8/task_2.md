# Task 2: Script de Restauração

❌ **Pendente** — criar `scripts/restore.sh`

Criar `scripts/restore.sh`:
- Receber `TIMESTAMP` como argumento
- Se não informado, listar backups disponíveis e sair com uso
- Restaurar banco: copiar `backups/db_TIMESTAMP.db` para `prisma/dev.db`
- Restaurar uploads: extrair `backups/uploads_TIMESTAMP.tar.gz` para raiz
- Mensagem final com instrução `npm run dev`
- Tornar executável: `chmod +x scripts/restore.sh`

## Commit

```
feat(backup): criar script de restauração de backup por timestamp
```
