'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

/**
 * Server Action responsável por autenticar o administrador.
 *
 * Recebe email e senha via FormData, valida as credenciais
 * usando o Better Auth e retorna o resultado da operação.
 *
 * @param formData - FormData com os campos 'email' e 'senha'
 * @returns { sucesso: true } em caso de sucesso, ou { erro: string } em caso de falha
 */
export async function login(formData: FormData) {
  try {
    // Extrai email e senha do formulário
    const email = formData.get('email') as string
    const senha = formData.get('senha') as string

    // Validação básica dos campos obrigatórios
    if (!email || !senha) {
      return { erro: 'Email e senha são obrigatórios' }
    }

    // Chama a API do Better Auth para autenticar com email/senha
    // O campo 'password' é o nome esperado pelo Better Auth (não 'senha')
    // headers() é necessário para configurar o cookie de sessão no navegador
    await auth.api.signInEmail({
      body: { email, password: senha },
      headers: await headers()
    })

    // Se chegou aqui, a autenticação foi bem-sucedida
    return { sucesso: true }
  } catch {
    // Se falhar (credenciais inválidas ou erro interno), retorna erro genérico
    // Não expõe detalhes do erro por segurança
    return { erro: 'Credenciais inválidas' }
  }
}
