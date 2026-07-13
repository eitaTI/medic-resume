# Task 8: Verificar healthcheck `/api/health`

✅ **Concluída**

## O que verificar

O app deve responder 200 no endpoint de saúde após o `migrate` ter preparado o banco.

## Critérios de aceite

- [ ] `curl -f http://localhost:3000/api/health` retorna 200
- [ ] o healthcheck do compose fica healthy

## Comando

```bash
curl -f http://localhost:3000/api/health && echo "OK"
```
