# Task 5: Variáveis de Ambiente

✅ **Concluído**

Criar `.env.example` com:
- `BETTER_AUTH_SECRET` (mínimo 32 caracteres)
- `BETTER_AUTH_URL`
- `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY`
- `DATABASE_URL=file:./dev.db`

> `.env` está no `.gitignore` — cada dev precisa copiar de `.env.example`:
> ```bash
> cp .env.example .env
> ```

## Commit

```
chore: criar .env.example com variáveis de ambiente
```
