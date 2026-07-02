import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const senhaHash = await bcrypt.hash('admin123', 10);

  await prisma.admin.upsert({
    where: { email: 'admin@zscan.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@zscan.com',
      senha: senhaHash,
    },
  });

  console.log('Admin padrão criado: admin@zscan.com / admin123');
}

main();