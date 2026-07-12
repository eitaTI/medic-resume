# Fase 8: Sistema de Backup

Scripts de backup e restauração do banco SQLite e uploads.

> **Nota sobre ambiente:** Os scripts são em bash e requerem WSL ou Git Bash no Windows.
> Em produção com Docker, o backup é feito via container — scripts servem para desenvolvimento e emergência.

## Status Geral

| Componente | Status |
|-----------|--------|
| Script de backup (`scripts/backup.sh`) | ✅ Concluído |
| Script de restauração (`scripts/restore.sh`) | ✅ Concluído |
| Serviço de backup no Docker Compose | ✅ Concluído (depende do app da Fase 9) |
| Compatibilidade Docker dos scripts (env vars) | ✅ Concluído |
| `.gitignore` (backups/uploads) | ✅ Concluído |
| Testes de backup/restore | ✅ Concluído |

## Tasks (Commits)

| # | Arquivo | Descrição | Status |
|---|---------|-----------|--------|
| 1 | `task_1.md` | Script de backup | ✅ Concluído |
| 2 | `task_2.md` | Script de restauração | ✅ Concluído |
| 3 | `task_3.md` | Serviço de backup no Docker Compose | ✅ Concluído |
| 4 | `task_4.md` | Testar backup/restore | ✅ Concluído |
| 5 | `task_5.md` | Compatibilidade Docker dos scripts (env vars) | ✅ Concluído |
| 6 | `task_6.md` | `.gitignore` (backups/uploads) | ✅ Concluído |
