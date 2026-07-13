# Melhorias-3: Correções de Verificação das Fases 1–9

Consolida as discrepâncias reais encontradas na verificação de `docs/projeto/fases/` contra o código, que precisam de verificação mais profunda e/ou correção. Não são apenas drift de documentação — há ao menos um defeito que quebra em runtime e uma fase marcada como concluída sem estar implementada.

## Status Geral

| Componente | Status |
|-----------|--------|
| Corrigir drift de schema Admin → User (migração) | ✅ Concluído |
| Implementar CRUD de administradores (Fase 6) | ✅ Concluído |
| Integrar auditoria na gestão de usuários (Fase 7 T6) | ❌ Pendente |
| Corrigir feedback/retry de erro Jira (Fase 5 T3) | ❌ Pendente |
| Testar backup/restore de fato (Fase 8 T4) | ❌ Pendente |
| Limpezas menores (audit.ts, entidadeId, docs) | ❌ Pendente |

## Tasks

| # | Arquivo | Descrição | Prioridade | Status |
|---|---------|-----------|------------|--------|
| 1 | `task_1.md` | Criar migração para reconciliar schema: dropar `Admin` e alterar `AuditLog.adminId → userId` (resolve drift que quebra em runtime) | Alta | ✅ Concluído |
| 2 | `task_2.md` | Implementar Fase 6: `actions/admins.ts`, `AdminForm.tsx`, CRUD real em `/admin/usuarios` | Alta | ✅ Concluído |
| 3 | `task_3.md` | Integrar auditoria (CRIAR/EXCLUIR admin) nas novas Server Actions de gestão de usuários | Média | ❌ Pendente |
| 4 | `task_4.md` | Fase 5 T3: exibir `jiraErro` na UI e oferecer retry para qualquer estado `!= SINCRONIZADO` | Média | ❌ Pendente |
| 5 | `task_5.md` | Fase 8 T4: executar e validar backup.sh/restore.sh de ponta a ponta | Média | ❌ Pendente |
| 6 | `task_6.md` | Limpezas: remover `'use server'` em `lib/audit.ts`, corrigir `entidadeId: 0` no login, atualizar docs desatualizados (Fase 2/3) | Baixa | ❌ Pendente |

## Dependências

- Task 1 é pré-requisito para Tasks 2/3 (gestão de admins grava em `AuditLog.userId`).
- Task 3 depende da Task 2 (só existirá `actions/admins.ts` após implementá-la).
- As demais são independentes.

## Arquivos afetados (estimados)

| Arquivo | Ação |
|---|---|
| `prisma/schema.prisma` | Já correto (sem `Admin`, `AuditLog.userId`); só falta a migração |
| `prisma/migrations/` | **Criar** migração de reconciliação |
| `actions/admins.ts` | **Criar** |
| `components/admin/AdminForm.tsx` | **Criar** |
| `app/admin/usuarios/page.tsx` | Refatorar de read-only para CRUD |
| `actions/submissoes.ts` | Ajustar feedback Jira (T3/T4) |
| `components/admin/AprovarRejeitarButtons.tsx` | Exibir `jiraErro` e retry (T4) |
| `scripts/backup.sh`, `scripts/restore.sh` | Validar execução real (T5) |
| `lib/audit.ts`, `actions/login.ts` | Limpezas (T6) |
| `docs/projeto/fases/*` | Atualizar doc drift (T6) |
