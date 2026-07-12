# Task 5: Testar Backup/Restore de Fato (Fase 8 T4)

❌ **Pendente**

## Problema

O `docs/projeto/fases/fase-8/task_4.md` marca "Testar backup/restore" como ✅, mas não é verificável a partir do código. Os scripts `scripts/backup.sh` e `scripts/restore.sh` estão corretos em lógica (parametrizados por env, `sqlite3`, retenção, restore de DB + uploads), porém a execução real precisa ser confirmada.

## O que fazer

1. Executar `scripts/backup.sh` em ambiente local (SQLite `dev.db` + `data/uploads/`) e confirmar geração do arquivo `.sqlite` e do `.tar.gz` de uploads com timestamp.
2. Executar `scripts/restore.sh <TIMESTAMP>` apontando para um banco/uploads de teste e validar restauração íntegra.
3. Validar compatibilidade Docker: rodar os scripts com `DB_PATH`/`UPLOADS_DIR`/`BACKUP_DIR` absolutos (como no `docker-compose.yml`) e confirmar funcionamento dentro de container.
4. Documentar o resultado do teste (ou registrar falha e corrigir).

## Critérios de aceite

- [ ] Backup gera DB + uploads com timestamp
- [ ] Restore reconstrói DB e uploads corretamente
- [ ] Scripts funcionam com env vars absolutas (modo Docker)
- [ ] Resultado registrado em `docs/projeto/fases/fase-8/task_4.md`

## Commit

```
test(backup): validar backup.sh/restore.sh end-to-end
```
