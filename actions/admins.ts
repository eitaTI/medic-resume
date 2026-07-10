'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

/**
 * Server Action: criarAdmin
 * Cria um novo administrador no sistema.
 * 
 * Fluxo:
 * 1. Verifica se o usuário logado tem sessão ativa
 * 2. Checa se o email já está cadastrado no modelo Admin
 * 3. Hasheia a senha com bcryptjs
 * 4. Persiste no banco via Prisma
 * 5. Revalida o cache da página /admin/usuarios
 * 
 * @param dados - Objeto com nome, email e senha do novo admin
 * @returns { sucesso: true } ou { erro: 'mensagem' }
 */
export async function criarAdmin(dados: { nome: string; email: string; senha: string }) {
  try {
    // Verifica se o usuário está autenticado
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return { erro: 'Não autorizado. Faça login primeiro.' }
    }

    // Valida campos obrigatórios
    if (!dados.nome || !dados.email || !dados.senha) {
      return { erro: 'Todos os campos são obrigatórios.' }
    }

    // Valida email mínimo
    if (!dados.email.includes('@')) {
      return { erro: 'Email inválido.' }
    }

    // Valida tamanho da senha
    if (dados.senha.length < 6) {
      return { erro: 'A senha deve ter no mínimo 6 caracteres.' }
    }

    // Verifica se o email já existe no modelo Admin
    const emailExistente = await prisma.admin.findUnique({
      where: { email: dados.email }
    })

    if (emailExistente) {
      return { erro: 'Este email já está cadastrado como administrador.' }
    }

    // Hasheia a senha com bcryptjs (sincrono por simplicidade)
    const senhaHash = bcrypt.hashSync(dados.senha, 10)

    // Cria o administrador no banco
    await prisma.admin.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: senhaHash,
      },
    })

    // Revalida o cache da página de listagem de admins
    revalidatePath('/admin/usuarios')
    return { sucesso: true }

  } catch (error) {
    console.error('Erro ao criar admin:', error)
    return { erro: 'Erro interno do servidor.' }
  }
}

/**
 * Server Action: excluirAdmin
 * Remove um administrador do sistema.
 * 
 * Fluxo:
 * 1. Verifica sessão ativa
 * 2. Busca o admin pelo ID
 * 3. Impede auto-exclusão (compara email do admin com email da sessão)
 * 4. Remove do banco
 * 5. Revalida o cache
 * 
 * @param id - ID numérico do administrador a ser excluído
 * @returns { sucesso: true } ou { erro: 'mensagem' }
 */
export async function excluirAdmin(id: number) {
  try {
    // Verifica se o usuário está autenticado
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return { erro: 'Não autorizado. Faça login primeiro.' }
    }

    // Busca o admin pelo ID
    const admin = await prisma.admin.findUnique({ where: { id } })
    if (!admin) {
      return { erro: 'Administrador não encontrado.' }
    }

    // Impede auto-exclusão: compara o email do admin com o email da sessão
    // Nota: session.user.email é do Better Auth (User model), admin.email é do Admin model
    if (admin.email === session.user.email) {
      return { erro: 'Você não pode excluir seu próprio usuário.' }
    }

    // Remove o administrador do banco
    await prisma.admin.delete({ where: { id } })

    // Revalida o cache da página de listagem
    revalidatePath('/admin/usuarios')
    return { sucesso: true }

  } catch (error) {
    console.error('Erro ao excluir admin:', error)
    return { erro: 'Erro interno do servidor.' }
  }
}
