# Task 3: Integrar Auditoria na Gestão de Usuários (Fase 7 T6)

❌ **Pendente**

## Problema

A Fase 7 T6 exige registrar auditoria para criar/excluir admins, mas `actions/admins.ts` não existe (ver Task 2), então `CRIAR`/`EXCLUIR` admin nunca foram auditados. A integração de auditoria está incompleta apesar do ✅ no `docs/projeto/fases/fase-7/task_6.md`.

## O que fazer

Após a Task 2, adicionar `registrarAcao` (de `lib/audit.ts`) nas Server Actions de gestão de usuários:
- Em `criarAdmin`: registrar `acao: 'CRIAR_USUARIO'` (ou `CRIAR`), `entidade: 'User'`, `entidadeId` do novo user, `detalhes` com email/nome.
- Em `excluirAdmin`: registrar `acao: 'EXCLUIR_USUARIO'`, `entidade: 'User'`, `entidadeId` do removido.

Usar `userId` do admin logado (da sessão) — **não** `adminId` (ver Task 1).

## Critérios de aceite

- [ ] Toda criação/exclusão de admin gera `AuditLog` correspondente
- [ ] Registros usam `userId` (String) consistente com o schema pós-Task 1
- [ ] `/admin/auditoria` exibe os eventos de gestão de usuários

## Commit

```
feat(audit): auditar criacao/exclusao de administradores
```
