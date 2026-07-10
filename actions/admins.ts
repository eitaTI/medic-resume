'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { registrarAcao } from '@/lib/audit'
import { randomUUID } from 'node:crypto'
import { hashPassword } from '@better-auth/utils/password'

/**
 * Lista todos os usuários do sistema (Better Auth User).
 *
 * Retorna os dados básicos de cada usuário: id, nome, email,
 * data de criação e se tem conta de autenticação vinculada.
 *
 * @returns Array de usuários ou erro
 */
export async function listarUsuarios() {
  try {
    // Verifica se o usuário está autenticado
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    // Busca todos os usuários com contas vinculadas
    const usuarios = await prisma.user.findMany({
      include: {
        accounts: {
          select: { providerId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return usuarios
  } catch {
    return { erro: 'Erro interno do servidor' }
  }
}

/**
 * Cria um novo usuário no sistema.
 *
 * Gera UUID para o ID, hasheia a senha e cria
 * o usuário com conta de autenticação vinculada.
 * Registra ação de auditoria CRIAR na entidade User.
 *
 * @param nome - Nome do usuário
 * @param email - Email único do usuário
 * @param senha - Senha em texto plano (será hasheada)
 * @returns Usuário criado ou erro
 */
export async function criarUsuario(nome: string, email: string, senha: string) {
  try {
    // Verifica se o usuário está autenticado
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    // Verifica se já existe um usuário com esse email
    const existeEmail = await prisma.user.findUnique({ where: { email } })
    if (existeEmail) return { erro: 'Já existe um usuário com esse email' }

    // Gera o hash da senha
    const senhaHash = await hashPassword(senha)

    // Gera UUID para o novo usuário
    const userId = randomUUID()

    // Cria o usuário com conta de autenticação em uma transação
    const usuario = await prisma.user.create({
      data: {
        id: userId,
        name: nome,
        email,
        emailVerified: false,
        accounts: {
          create: {
            id: randomUUID(),
            accountId: email,
            providerId: 'credential',
            password: senhaHash,
          },
        },
      },
    })

    // Registra ação de auditoria: criação de usuário
    await registrarAcao({
      userId: session.user.id,
      acao: 'CRIAR',
      entidade: 'User',
      entidadeId: 0, // User usa String ID, mas entidadeId é Int
      detalhes: { email, nome, novoUserId: userId }
    })

    // Atualiza a página para refletir as mudanças
    revalidatePath('/admin/usuarios')
    return { sucesso: true, usuario }
  } catch {
    return { erro: 'Erro interno do servidor' }
  }
}

/**
 * Exclui um usuário do sistema.
 *
 * Remove o usuário e suas contas de autenticação.
 * Não permite excluir a si mesmo.
 * Registra ação de auditoria EXCLUIR na entidade User.
 *
 * @param id - ID do usuário (String UUID do Better Auth)
 * @returns Sucesso ou erro
 */
export async function excluirUsuario(id: string) {
  try {
    // Verifica se o usuário está autenticado
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    // Não permite excluir a si mesmo
    if (session.user.id === id) {
      return { erro: 'Não é possível excluir seu próprio usuário' }
    }

    // Busca o usuário antes de excluir (para o log de auditoria)
    const usuario = await prisma.user.findUnique({
      where: { id },
      select: { email: true, name: true }
    })

    if (!usuario) return { erro: 'Usuário não encontrado' }

    // Remove as contas de autenticação vinculadas
    await prisma.account.deleteMany({ where: { userId: id } })

    // Remove as sessões do usuário
    await prisma.session.deleteMany({ where: { userId: id } })

    // Remove o usuário
    await prisma.user.delete({ where: { id } })

    // Registra ação de auditoria: exclusão de usuário
    await registrarAcao({
      userId: session.user.id,
      acao: 'EXCLUIR',
      entidade: 'User',
      entidadeId: 0, // User usa String ID, mas entidadeId é Int
      detalhes: { email: usuario.email, nome: usuario.name, excludedUserId: id }
    })

    // Atualiza a página para refletir as mudanças
    revalidatePath('/admin/usuarios')
    return { sucesso: true }
  } catch {
    return { erro: 'Erro interno do servidor' }
  }
}
