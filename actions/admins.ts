'use server'

import { randomUUID } from 'node:crypto'
import { hashPassword } from '@better-auth/utils/password'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { registrarAcao } from '@/lib/audit'

/**
 * Server Actions de gestão de administradores (modelo User do Better Auth).
 *
 * Substituem o antigo modelo `Admin` (removido). Criar/excluir um admin
 * significa criar/remover um registro `User` + `Account` (credential).
 */

async function obterSessaoAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  return session
}

export async function criarAdmin(dados: {
  nome: string
  email: string
  senha: string
}) {
  const session = await obterSessaoAdmin()
  if (!session) return { erro: 'Não autenticado' }

  const nome = dados.nome?.trim()
  const email = dados.email?.trim().toLowerCase()
  const senha = dados.senha

  if (!nome || !email || !senha) {
    return { erro: 'Nome, email e senha são obrigatórios' }
  }
  if (senha.length < 6) {
    return { erro: 'A senha deve ter ao menos 6 caracteres' }
  }

  try {
    const existente = await prisma.user.findUnique({ where: { email } })
    if (existente) return { erro: 'Já existe um usuário com este email' }

    const senhaHash = await hashPassword(senha)
    const userId = randomUUID()

    await prisma.user.create({
      data: {
        id: userId,
        name: nome,
        email,
        emailVerified: true,
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

    await registrarAcao({
      userId: session.user.id,
      acao: 'CRIAR',
      entidade: 'User',
      entidadeId: null,
      detalhes: { email, nome },
    })

    return { sucesso: true }
  } catch {
    return { erro: 'Erro interno ao criar administrador' }
  }
}

export async function excluirAdmin(id: string) {
  const session = await obterSessaoAdmin()
  if (!session) return { erro: 'Não autenticado' }

  if (id === session.user.id) {
    return { erro: 'Você não pode excluir a si mesmo' }
  }

  try {
    const total = await prisma.user.count()
    if (total <= 1) {
      return { erro: 'Não é possível excluir o último administrador' }
    }

    const alvo = await prisma.user.findUnique({ where: { id } })
    if (!alvo) return { erro: 'Usuário não encontrado' }

    await prisma.user.delete({ where: { id } })

    await registrarAcao({
      userId: session.user.id,
      acao: 'EXCLUIR',
      entidade: 'User',
      entidadeId: null,
      detalhes: { email: alvo.email, nome: alvo.name },
    })

    return { sucesso: true }
  } catch {
    return { erro: 'Erro interno ao excluir administrador' }
  }
}
