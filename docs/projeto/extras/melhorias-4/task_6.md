# Task 6: Verificar `docker compose up -d` (migrate antes do app)

❌ **Pendente**

## O que verificar

Subir o stack e confirmar a ordem correta: o service `migrate` **completa** (exit 0) antes do
`app` iniciar, graças a `depends_on: { migrate: { condition: service_completed_successfully } }`.

## Critérios de aceite

- [ ] `docker compose up -d` sobe sem erro
- [ ] `migrate` entra em estado `exited (0)` e não fica preso
- [ ] `app` inicia somente após `migrate` concluído

## Comando

```bash
docker compose up -d
docker compose ps
```
