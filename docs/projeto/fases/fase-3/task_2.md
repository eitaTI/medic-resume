# Task 2: Server Action de Login

❌ **Pendente** — criar `actions/login.ts`

Criar `actions/login.ts`:
- `'use server'`
- Extrair `email` e `senha` do `FormData`
- Chamar `auth.api.signInEmail` com `{ body: { email, password }, headers: await headers() }`
- Se falhar, retornar `{ erro: 'Credenciais inválidas' }`
- Se sucesso, retornar `{ sucesso: true }`
- Tratar exceção com try/catch retornando erro genérico

## Commit

```
feat(auth): criar server action de login com Better Auth
```
