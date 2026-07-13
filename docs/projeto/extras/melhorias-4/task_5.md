# Task 5: Verificar `docker compose build`

✅ **Concluída**

## O que verificar

Rodar `docker compose build` e confirmar que ambas as imagens são geradas sem erro:
- `app` (estágio `runner`) — deve ser o bundle standalone, **sem** o `node_modules` do projeto.
- `migrate` (estágio `migrator`) — deve conter Prisma CLI + `tsx`.

## Critérios de aceite

- [ ] `docker compose build` conclui com sucesso
- [ ] a imagem `app` não copia `node_modules` (ver Task 10)
- [ ] a imagem `migrate` tem `prisma` e `tsx` disponíveis

## Comando

```bash
docker compose build
```
