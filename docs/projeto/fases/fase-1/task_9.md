# Task 9: Scripts package.json

✅ **Concluído**

Adicionar ao `package.json`:
- `"postinstall": "prisma generate"`
- Config `"prisma": { "seed": "npx tsx prisma/seed.ts" }`

Rodar:
```bash
npx prisma generate
npx prisma db seed
```

## Commit

```
chore: configurar scripts postinstall e seed no package.json
```
