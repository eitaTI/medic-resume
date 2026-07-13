# Task 2: start.sh reduzido a `exec node server.js`

❌ **Pendente**

## Problema

O `start.sh` faz `migrate deploy` + `seed` + `node server.js`, o que obriga o container da app a
carregar o `node_modules` completo (Prisma CLI, tsx, deps do seed). Com o service `migrate`
separado, o app não precisa de nenhuma dessas ferramentas.

## O que fazer

Substituir o conteúdo de `scripts/start.sh` por:

```sh
#!/bin/sh
set -e
exec node server.js
```

## Critérios de aceite

- [ ] `start.sh` executa apenas o servidor standalone (`node server.js`)
- [ ] migrações/seed saíram do container da app (viram o service `migrate`)

## Commit

```
build(docker): start.sh vira apenas node server.js
```
