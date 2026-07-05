# Task 5: Cloudflare Tunnel

❌ **Pendente** — configurar Cloudflare Tunnel

Usar Cloudflare Tunnel (`cloudflared`):
- Instalar `cloudflared` (via apt, brew ou binary)
- Autenticar: `cloudflared tunnel login`
- Criar tunnel: `cloudflared tunnel create medic-resume`
- Criar arquivo de configuração `config.yml` com ingresso para `http://localhost:3000`
- Configurar DNS: `cloudflared tunnel route dns medic-resume subdomain.seudominio.com`
- Adicionar serviço `cloudflared` no `docker-compose.yml` ou rodar como serviço do sistema
- Testar túnel e verificar HTTPS automático

## Commit

```
feat(infra): configurar Cloudflare Tunnel para exposição segura da aplicação
```
