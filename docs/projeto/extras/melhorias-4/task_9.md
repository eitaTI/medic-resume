# Task 9: Verificar login admin + fluxo de submissão

❌ **Pendente**

## O que verificar

Provar ponta a ponta que o app roda só com o bundle standalone e que o seed rodou no `migrate`:
1. Login em `/login` com `admin@eitati.com / admin123` deve funcionar (se o seed não tivesse
   rodado, o admin não existiria e o login falharia).
2. Submeter um cadastro de teste em `/formulario` e aprovar no `/admin` (exercita o app via
   standalone, incluindo better-sqlite3 e integração Jira fail-open).

## Critérios de aceite

- [ ] login do admin funciona
- [ ] submissão é criada e listada no painel
- [ ] aprovar gera o card Jira (ou fail-open sem quebrar)

## Comando

```bash
# via browser: /login, /formulario, /admin
```
