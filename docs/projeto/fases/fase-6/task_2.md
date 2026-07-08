# Task 2: Componente AdminForm

❌ **Pendente** — criar `components/admin/AdminForm.tsx`

Criar `components/admin/AdminForm.tsx` (`'use client'`):
- `useActionState` com wrapper inline que chama `criarAdmin()` e dá `router.refresh()` em caso de sucesso
- Campos: Nome, Email (type email), Senha (type password, minLength 6)
- Mensagem de erro (vermelho) e sucesso (verde)
- Botão "Criar Admin" desabilitado enquanto pending ("Criando...")

## Commit

```
feat(admin): criar AdminForm com useActionState para criação de admins
```
