'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { registrarAcao } from '@/lib/audit'

/**
 * Server Action responsável por autenticar o usuário e registrar
 * o login no sistema de auditoria do Better Auth.
 *
 * Fluxo:
 * 1. Valida os campos email e senha
 * 2. Chama a API do Better Auth para autenticar
 * 3. Registra a ação LOGIN no log de auditoria
 * 4. Retorna sucesso ou erro
 *
 * @param formData - FormData com os campos 'email' e 'senha'
 * @returns { sucesso: true } em caso de sucesso, ou { erro: string } em caso de falha
 */
export async function login(formData: FormData) {
  // Extrai email e senha do formulário
  const email = formData.get('email') as string
  const senha = formData.get('senha') as string

  // Validação básica dos campos obrigatórios
  if (!email || !senha) {
    return { erro: 'Email e senha são obrigatórios' }
  }

  try {
    // Chama a API do Better Auth para autenticar com email/senha
    // headers() é necessário para configurar o cookie de sessão no navegador
    const session = await auth.api.signInEmail({
      body: { email, password: senha },
      headers: await headers()
    })

    // Se chegou aqui, a autenticação foi bem-sucedida
    // Registra a ação de LOGIN no log de auditoria
    await registrarAcao({
      userId: session.user.id,
      acao: 'LOGIN',
      entidade: 'User',
      entidadeId: 0, // User usa String ID, mas entidadeId é Int
      detalhes: { email, nome: session.user.name }
    })

    return { sucesso: true }
  } catch {
    // Se falhar (credenciais inválidas ou erro interno), retorna erro genérico
    // Não expõe detalhes do erro por segurança
    return { erro: 'Credenciais inválidas' }
  }
}
