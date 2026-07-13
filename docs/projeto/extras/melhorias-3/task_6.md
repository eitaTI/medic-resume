# Task 6: Limpezas Menores e Atualização de Docs Desatualizados

✅ **Concluído** — limpezas e docs atualizados

## Problema

Pequenos itens de consistência identificados na verificação:

1. `lib/audit.ts:1` carrega um diretiva `'use server'` desnecessária (helper usado em Server Actions, não é ele próprio uma action).
2. `actions/login.ts:44` grava `entidadeId: 0` como placeholder (o `User` é String-keyed). Reavaliar se `entidadeId` deve aceitar String ou se o campo deve ser opcional/ajustado para login.
3. Doc drift:
   - Fase 2 `task_9.md` lista `schemaClinica` com `nomeEmpresa`/`quantidadeMedicos`, mas `lib/validacoes.ts` não os coleta (o formulário também não). Decidir: ou adicionar ao formulário+Zod, ou atualizar o doc para refletir o real.
   - Fase 3 `task_4.md` descreve cookie `session` e matcher `['/admin/:path*','/login']`; o código usa `better-auth.session_token` e também protege `/api/uploads/:path*` (correto, alinhado ao `AGENTS.md`). Atualizar o doc.
   - Fases 6 `task_1/2/3.md` marcam ✅ mas não foram implementadas (ver Task 2) — atualizar para refletir o real após a implementação.

## O que fazer

1. Remover `'use server'` de `lib/audit.ts` (ou justificar se for action).
2. Corrigir/esclarecer o `entidadeId` no registro de `LOGIN`.
3. Revisar `schemaClinica` (adicionar campos ao formulário ou atualizar doc).
4. Atualizar `docs/projeto/fases/fase-3/task_4.md` e `fase-6/task_*.md` para refletir o código real.

## Critérios de aceite

- [ ] `lib/audit.ts` sem diretiva desnecessária
- [ ] Registro de login consistente com o modelo
- [ ] Docs de Fase 2/3/6 refletem o código real (ou campos adicionados ao formulário)

## Commit

```
chore(docs): corrigir drift de documentacao e limpar lib/audit.ts
```
