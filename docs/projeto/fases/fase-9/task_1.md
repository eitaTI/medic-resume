# Task 1: Dockerfile

❌ **Pendente** — criar `Dockerfile`

Criar `Dockerfile` multi-stage:
- **Stage builder**: imagem `node:18-alpine`, copiar `package*.json`, `npm ci`, copiar código, `npx prisma generate`, `npm run build`
- **Stage runner**: imagem `node:18-alpine`, instalar sqlite (`apk add --no-cache sqlite`), copiar `package*.json`, `node_modules`, `.next`, `public`, `prisma`, `scripts` do builder
- Criar diretório `/app/data/uploads`
- Tornar scripts executáveis
- Expor porta 3000
- CMD `["npm", "start"]`

## Commit

```
feat(docker): criar Dockerfile multi-stage para produção
```
