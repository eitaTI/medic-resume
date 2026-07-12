# Task 4: Corrigir Feedback e Retry do Jira (Fase 5 T3)

❌ **Pendente**

## Problema

Em `components/admin/AprovarRejeitarButtons.tsx`:
- O erro detalhado retornado por `aprovarSubmissao` (`jiraErro`) **não é exibido** na UI — só uma mensagem genérica ("Card Jira pendente — tente novamente").
- O botão de retry só aparece quando `jiraSyncStatus === 'ERRO'`; o spec exigia retry para qualquer estado `!= SINCRONIZADO` (ex.: `PENDENTE` travado).

O núcleo da integração (cliente `lib/jira.ts`, action fail-open, `jiraSyncStatus`, env vars) está OK — só o feedback ao admin está incompleto.

## O que fazer

1. Propagar e exibir `jiraErro` (vindo do resultado da Server Action) inline quando a sincronização Jira falhar.
2. Mostrar o botão "Sincronizar novamente" (retry via `sincronizarJira`) sempre que `jiraSyncStatus != 'SINCRONIZADO'`, não apenas em `ERRO`.
3. Manter estado "Sincronizando…" enquanto pendente.

## Critérios de aceite

- [ ] `jiraErro` é visível ao admin quando a sincronização falha
- [ ] Retry disponível para `PENDENTE` e `ERRO`
- [ ] Comportamento fail-open preservado (aprovação não depende do Jira)
- [ ] `pnpm build` e `pnpm lint` passam

## Commit

```
fix(jira): exibir erro e habilitar retry para qualquer estado nao sincronizado
```
