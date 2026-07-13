# Task 4: Testar Backup/Restore

✅ **Concluído** — validação dos scripts (com correções encontradas durante o teste)

**Correções aplicadas durante o teste:**
- `backup.sh` apontava `DB_PATH` para `./prisma/dev.db`, mas o Prisma resolve
  `file:./dev.db` relativo ao diretório de trabalho (raiz do projeto) → banco real em
  `./dev.db`. Corrigido o default para `./dev.db`.
- `backup.sh` declarava "Backup do banco realizado" mesmo quando o `sqlite3` não existia
  (não checava o exit code). Agora valida a presença do `sqlite3` e o código de saída,
  saindo com `exit 1` em falha (sem mentir sucesso).
- **Fallback offline:** quando o CLI `sqlite3` não está disponível (ex.: validação local
  fora do container), `backup.sh` faz cópia do arquivo (`cp`) em vez de `.backup`, com
  aviso explícito. Em produção (Docker) o pacote `sqlite` está instalado e o `.backup`
  original é usado.

**Testes executados:**
- `backup.sh`: branch de uploads funciona (`tar`); branch do banco via `.backup` quando
  `sqlite3` presente (container Docker/WSL/Git Bash) — validado o tratamento de erro quando
  ausente (sai com `exit 1` e mensagem clara).
- **Validação end-to-end (melhorias-3/T5):** executado localmente sem `sqlite3`
  (fallback `cp`): `backup.sh` gerou `db_<TS>.db` (94 KB, igual ao original) e
  `uploads_<TS>.tar.gz`; `restore.sh <TS>` reconstruiu banco e uploads corretamente
  (`exemplo.txt` restaurado). Tamanho do DB restaurado conferido com o original.
- `restore.sh`: testado em diretório temporário via env vars (`DB_PATH`/`UPLOADS_DIR`/
  `BACKUP_DIR`) — restaura banco (`cp`) e uploads (`tar -xzf`) corretamente; validados os
  caminhos de erro (sem timestamp → lista; timestamp inexistente → erro `exit 1`).
- `docker-compose.yml`: YAML validado; serviço `backup` injeta as env vars.
- `.gitignore`: `backups/` e `data/uploads/` confirmados ignorados (`git check-ignore`).

**Pré-requisito:** `sqlite3` instalado no ambiente (WSL/Git Bash local ou imagem alpine
do container). Sem ele, o backup do banco usa cópia de arquivo (fallback offline).

## Commit

```
test(backup): testar scripts de backup/restore e corrigir caminho do banco e tratamento de erro
```
