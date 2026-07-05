# Task 9: Scripts package.json

✅ **Concluído**

Adicionar ao `package.json`:
- `"postinstall": "prisma generate"`
- Config `"prisma": { "seed": "pnpm tsx prisma/seed.ts" }`
- `"eslint"` como dependência de desenvolvimento (flat config em `eslint.config.mjs`)

**Dependências adicionais:** `@eslint/eslintrc`, `tsx` (para o seed)

Rodar:
```bash
pnpm prisma generate
pnpm prisma db seed
pnpm eslint       # verificação de lint
```

## Commits

```
chore: configurar scripts postinstall e seed no package.json
chore: adicionar eslint flat config com next/core-web-vitals
```
