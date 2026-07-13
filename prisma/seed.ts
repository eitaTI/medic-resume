import { prisma } from '../lib/prisma';
import { randomUUID } from 'node:crypto';
import { hashPassword } from '@better-auth/utils/password';

/**
 * Seed do banco de dados.
 *
 * Cria o usuário administrador padrão usando Better Auth.
 * O modelo Admin foi removido - agora usamos apenas o User do Better Auth.
 *
 * Credenciais padrão:
 * - Email: admin@eitati.com
 * - Senha: admin123
 */
async function main() {
  // Gera o hash da senha para o Better Auth
  const senhaHash = await hashPassword('admin123');

  // Verifica se o usuário já existe
  const userExists = await prisma.user.findUnique({ where: { email: 'admin@eitati.com' } });

  if (!userExists) {
    // Cria o usuário + conta de autenticação em uma transação
    const userId = randomUUID();
    await prisma.user.create({
      data: {
        id: userId,
        name: 'Administrador',
        email: 'admin@eitati.com',
        emailVerified: true,
        accounts: {
          create: {
            id: randomUUID(),
            accountId: 'admin@eitati.com',
            providerId: 'credential',
            password: senhaHash,
          },
        },
      },
    });
  }

  console.log('Admin padrão criado: admin@eitati.com / admin123');
}

main();
