#!/bin/sh
set -e

# Fix volume permissions — Docker mounts volumes as root, but the app runs as nextjs (uid 1001)
echo "=== Fixando permissões dos volumes ==="

# uploads volume
mkdir -p /app/data/uploads
chown -R nextjs:nodejs /app/data/uploads

# sqlite-data volume (the DB path may vary based on DATABASE_URL)
mkdir -p /data/db
chown -R nextjs:nodejs /data/db

# branding volume
mkdir -p /app/data/branding
chown -R nextjs:nodejs /app/data/branding

echo "Permissões corrigidas. Iniciando aplicação..."

# Drop to nextjs user and run start.sh
exec su -s /bin/sh nextjs -c "sh /app/scripts/start.sh"
