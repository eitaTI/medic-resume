# Fase 9: Deploy com Docker

Containerização e deploy em produção.

## Objetivo

Empacotar a aplicação em Docker para deploy fácil e consistente.

## Componentes

### 1. Dockerfile

Crie `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar dependências
COPY package*.json ./
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Instalar dependências de sistema
RUN apk add --no-cache sqlite

# Copiar arquivos necessários
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

# Criar diretório de uploads
RUN mkdir -p /app/data/uploads

# Tornar scripts executáveis
RUN chmod +x /app/scripts/*.sh

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
```

### 2. .dockerignore

Crie `.dockerignore`:

```
node_modules
.next
.git
.env
.env.local
backups
data/uploads/*.db
*.db-journal
```

### 3. docker-compose.yml

Crie `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: medic-resume
    ports:
      - "3000:3000"
    volumes:
      - uploads:/app/data/uploads
      - db:/app/prisma
    environment:
      - DATABASE_URL=file:./dev.db
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL:-http://localhost:3000}
      - JIRA_BASE_URL=${JIRA_BASE_URL}
      - JIRA_EMAIL=${JIRA_EMAIL}
      - JIRA_API_TOKEN=${JIRA_API_TOKEN}
      - JIRA_PROJECT_KEY=${JIRA_PROJECT_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  backup:
    image: alpine:latest
    container_name: zscan-backup
    volumes:
      - ./:/app
      - ./backups:/backups
    command: >
      sh -c "apk add --no-cache bash sqlite &&
             echo '0 2 * * * /app/scripts/backup.sh >> /backups/backup.log 2>&1' | crontab - &&
             crond -f -l 2"
    restart: unless-stopped
    depends_on:
      - app

volumes:
  uploads:
  db:
```

### 4. Variáveis de Ambiente para Produção

Crie `.env.production`:

```env
# Gere um novo secret para produção
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=https://seudominio.com

# Jira
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=seu_token_aqui
JIRA_PROJECT_KEY=ZSCAN
```

### 5. Build e Deploy

```bash
# Build da imagem
docker compose build

# Iniciar serviços
docker compose up -d

# Ver logs
docker compose logs -f app

# Parar serviços
docker compose down
```

### 6. Nginx Reverse Proxy (Opcional)

Crie `nginx.conf`:

```nginx
server {
    listen 80;
    server_nameseudominio.com;

    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_nameseudominio.com;

    # SSL (Certbot)
    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Adicione ao `docker-compose.yml`:

```yaml
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - app
    restart: unless-stopped
```

### 7. SSL com Certbot (Opcional)

```bash
# Instalar Certbot
sudo apt install certbot

# Obter certificado
sudo certbot certonly --standalone -d seudominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Comandos Úteis

```bash
# Ver status
docker compose ps

# Ver logs
docker compose logs -f app

# Reiniciar app
docker compose restart app

# Atualizar e rebuild
git pull
docker compose build
docker compose up -d

# Backup manual
docker compose exec backup /app/scripts/backup.sh

# Acessar shell do container
docker compose exec app sh
```

## Checklist

- [ ] Dockerfile criado
- [ ] .dockerignore configurado
- [ ] docker-compose.yml funcionando
- [ ] Build sem erros
- [ ] App rodando em Docker
- [ ] Volumes configurados
- [ ] Healthcheck funcionando
- [ ] (Opcional) Nginx configurado
- [ ] (Opcional) SSL ativo