# Melhorias-4: Otimização do Deploy Docker (app mínimo + serviço migrate)

Elimina a cópia dos ~802 MB de `node_modules` para a imagem da aplicação. A imagem da app passa
a ser apenas o bundle `standalone` do Next.js (`node server.js`); as migrações e o seed do admin
passam a um service auxiliar `migrate` (oneshot) no Docker Compose, que roda `prisma migrate
deploy` + `tsx prisma/seed.ts` antes do app subir.

## Status Geral

| Componente | Status |
|-----------|--------|
| Dockerfile: app mínimo (sem node_modules) + estágio migrator | ❌ Pendente |
| start.sh reduzido a `exec node server.js` | ❌ Pendente |
| docker-compose: service migrate + depends_on | ❌ Pendente |
| docs/guides/deploy.md atualizado | ❌ Pendente |
| Verificação: build das imagens | ❌ Pendente |
| Verificação: migrate roda antes do app | ❌ Pendente |
| Verificação: logs do migrate (deploy+seed) | ❌ Pendente |
| Verificação: healthcheck /api/health | ❌ Pendente |
| Verificação: login admin + fluxo de submissão | ❌ Pendente |
| Verificação: imagem app sem node_modules | ❌ Pendente |

## Tasks

| # | Arquivo | Descrição | Prioridade | Status |
|---|---------|-----------|------------|--------|
| 1 | `task_1.md` | Dockerfile: remover cópia de node_modules do estágio `runner` e adicionar estágio `migrator` | Alta | ❌ Pendente |
| 2 | `task_2.md` | `scripts/start.sh`: reduzir para `exec node server.js` (app standalone mínimo) | Alta | ❌ Pendente |
| 3 | `task_3.md` | `docker-compose.yml`: `app` usa `target: runner` + `depends_on migrate`; criar service `migrate` oneshot | Alta | ❌ Pendente |
| 4 | `task_4.md` | `docs/guides/deploy.md` (+ fase-9/task_4.md): documentar app mínimo + service migrate | Média | ❌ Pendente |
| 5 | `task_5.md` | Verificar `docker compose build` (imagens app mínima + migrator) | Alta | ❌ Pendente |
| 6 | `task_6.md` | Verificar `docker compose up -d`: migrate completa antes do app (depends_on) | Alta | ❌ Pendente |
| 7 | `task_7.md` | Verificar `docker compose logs migrate` (migrate deploy + seed OK) | Média | ❌ Pendente |
| 8 | `task_8.md` | Verificar `curl /api/health` retorna 200 | Média | ❌ Pendente |
| 9 | `task_9.md` | Verificar login admin (seed) + submeter/aprovar clínica | Média | ❌ Pendente |
| 10 | `task_10.md` | Verificar que a imagem `app` não carrega node_modules (tamanho menor) | Baixa | ❌ Pendente |

## Dependências

- Tasks 1–3 são as mudanças de código; a Task 4 (docs) depende delas.
- Tasks 5–10 são verificações em ambiente com Docker; a Task 6 depende da 5; 7–10 dependem da 6.

## Arquivos afetados (estimados)

| Arquivo | Ação |
|---|---|
| `Dockerfile` | Remover `COPY node_modules` do runner; adicionar estágio `migrator` |
| `scripts/start.sh` | Reduzir a `exec node server.js` |
| `docker-compose.yml` | `target: runner` no app; novo service `migrate` |
| `docs/guides/deploy.md` | Documentar novo modelo de deploy |
| `docs/projeto/fases/fase-9/task_4.md` | Nota sobre service migrate |
