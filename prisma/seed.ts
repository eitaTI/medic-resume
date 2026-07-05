import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

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