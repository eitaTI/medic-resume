# Task 10: Verificar que a imagem `app` não carrega node_modules

❌ **Pendente**

## O que verificar

Confirmar que a imagem da app ficou drasticamente menor, pois não copia o `node_modules` do
projeto (~802 MB) — só o bundle standalone (~68 MB de node_modules tracejados).

## Critérios de aceite

- [ ] `docker image inspect` da imagem `app` mostra tamanho muito menor que antes
- [ ] não há `/app/node_modules` com o projeto inteiro dentro do container `app`
  (`docker compose exec app sh -c 'ls /app/node_modules | head'` deve mostrar só o que o
  standalone copiou, não 802 MB)

## Comando

```bash
docker compose images
docker compose exec app sh -c 'du -sh /app/node_modules'
```
