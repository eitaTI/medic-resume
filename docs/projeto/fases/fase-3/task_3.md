# Task 3: Tela de Login

❌ **Pendente** — criar `app/login/page.tsx`

Criar `app/login/page.tsx`:
- `'use client'` com `useActionState` vinculado à action `login`
- `useRouter` para redirecionar ao `/admin` em caso de sucesso
- Layout: centralizado na tela (flex min-h-screen), card branco com sombra, fundo cinza
- Título "Login Admin"
- Mensagem de erro em vermelho se `state?.erro`
- Formulário com: campo Email (type email) e campo Senha (type password)
- Botão "Entrar" (full width, desabilitado enquanto pending, texto "Entrando..." quando pending)
- Usar `Input` e `Button` de `@/components/ui/`

## Commit

```
feat(auth): criar tela de login com useActionState e redirect
```
