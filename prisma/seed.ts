import { prisma } from '../lib/prisma';
import { randomUUID } from 'node:crypto';
// @ts-expect-error - módulo existe em runtime (exportado via package.json exports)
import { hashPassword } from '@better-auth/utils/password';

async function main() {
  const senhaHash = await hashPassword('admin123');

  await prisma.admin.upsert({
    where: { email: 'admin@zscan.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@zscan.com',
      senha: senhaHash,
    },
  });

  const userExists = await prisma.user.findUnique({ where: { email: 'admin@zscan.com' } });

  if (!userExists) {
    const userId = randomUUID();
    await prisma.user.create({
      data: {
        id: userId,
        name: 'Administrador',
        email: 'admin@zscan.com',
        emailVerified: true,
        accounts: {
          create: {
            id: randomUUID(),
            accountId: 'admin@zscan.com',
            providerId: 'credential',
            password: senhaHash,
          },
        },
      },
    });
  }

  console.log('Admin padrão criado: admin@zscan.com / admin123');
}

main();