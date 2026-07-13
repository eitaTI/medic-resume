# Task 4: Documentar app mínimo + service migrate

✅ **Concluída**

## O que fazer

- `docs/guides/deploy.md`:
  - "O que o compose sobe": `app` (standalone, **sem node_modules do projeto**) + `migrate`
    (oneshot migrate+seed) + `backup`.
  - Substituir a nota "não remova o `node_modules`..." por explicação do novo modelo: o app roda
    100% com o bundle standalone; Prisma CLI/`tsx` ficam no service `migrate` (estágio `migrator`).
  - Comandos: `docker compose up -d --build` já sobe o `migrate` antes do `app` (via `depends_on`).
  - Menção de que é necessário Docker Compose v2 (`condition: service_completed_successfully`).
- `docs/projeto/fases/fase-9/task_4.md`: nota breve sobre o service `migrate`.

## Critérios de aceite

- [ ] `deploy.md` reflete app mínimo + service `migrate`
- [ ] removida a orientação de "não remover o node_modules"
- [ ] mencionado Docker Compose v2

## Commit

```
docs(deploy): documentar app mínimo + service migrate
```
