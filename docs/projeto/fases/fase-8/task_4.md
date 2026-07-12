# Task 4: Testar Backup/Restore

✅ **Concluído** — validação dos scripts (com correções encontradas durante o teste)

**Correções aplicadas durante o teste:**
- `backup.sh` apontava `DB_PATH` para `./prisma/dev.db`, mas o Prisma resolve
  `file:./dev.db` relativo ao diretório de trabalho (raiz do projeto) → banco real em
  `./dev.db`. Corrigido o default para `./dev.db`.
- `backup.sh` declarava "Backup do banco realizado" mesmo quando o `sqlite3` não existia
  (não checava o exit code). Agora valida a presença do `sqlite3` e o código de saída,
  saindo com `exit 1` em falha (sem mentir sucesso).

**Testes executados:**
- `backup.sh`: branch de uploads funciona (`tar`); branch do banco exige CLI `sqlite3`
  (presente no container Docker e em WSL/Git Bash) — validado o tratamento de erro quando
  ausente (sai com `exit 1` e mensagem clara).
- `restore.sh`: testado em diretório temporário via env vars (`DB_PATH`/`UPLOADS_DIR`/
  `BACKUP_DIR`) — restaura banco (`cp`) e uploads (`tar -xzf`) corretamente; validados os
  caminhos de erro (sem timestamp → lista; timestamp inexistente → erro `exit 1`).
- `docker-compose.yml`: YAML validado; serviço `backup` injeta as env vars.
- `.gitignore`: `backups/` e `data/uploads/` confirmados ignorados (`git check-ignore`).

**Pré-requisito:** `sqlite3` instalado no ambiente (WSL/Git Bash local ou imagem alpine
do container). Sem ele, o backup do banco é pulado com erro explícito.

## Commit

```
test(backup): testar scripts de backup/restore e corrigir caminho do banco e tratamento de erro
```
