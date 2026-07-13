# Task 7: Verificar logs do `migrate` (deploy + seed)

✅ **Concluída**

## O que verificar

Os logs do service `migrate` devem mostrar `migrate deploy` aplicando as migrações e o seed
criando o admin (`admin@eitati.com`), sem erros.

## Critérios de aceite

- [ ] `prisma migrate deploy` roda sem erro (mesmo em DB já migrado, é idempotente)
- [ ] `tsx prisma/seed.ts` cria/confirma o admin e encerra
- [ ] nenhum erro de resolução de módulo (better-sqlite3, @prisma/*, @better-auth/utils)

## Comando

```bash
docker compose logs migrate
```
