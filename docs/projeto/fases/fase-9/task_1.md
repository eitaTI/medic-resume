# Task 1: Dockerfile

✅ **Concluído** — `Dockerfile` multi-stage criado

Criar `Dockerfile` multi-stage:
- **Stage builder**: imagem `node:18-alpine`, copiar `package.json` + `pnpm-lock.yaml`, `pnpm install --frozen-lockfile`, copiar código, `pnpm prisma generate`, `pnpm build`
- **Stage runner**: imagem `node:18-alpine`, instalar sqlite (`apk add --no-cache sqlite`), copiar `package*.json`, `node_modules`, `.next`, `public`, `prisma`, `scripts` do builder
- Criar diretório `/app/data/uploads`
- Tornar scripts executáveis
- Expor porta 3000
- CMD `["pnpm", "start"]`

## Commit

```
feat(docker): criar Dockerfile multi-stage para produção
```
