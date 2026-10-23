/**
 * Listas dinâmicas do formulário (via env, com fallback embutido).
 *
 * PORQUÊ: o gestor altera vendedores/tipos sem deploy — basta trocar o env e
 * reiniciar. O front busca via `/api/opcoes-cadastro`; a validação server-side
 * confere pertinência aqui (nunca confie no select do browser).
 */

/** Valores iniciais (usados quando o env não define a lista). */
export const VENDEDORES_PADRAO = [
  'Alyson Alves',
  'Alex Teodoro',
  'Jhonatan Souza',
  'Amanda Araújo',
  'Outros',
]

export const TIPOS_PROCESSO_PADRAO = [
  'Implantação nova Zscan',
  'Atualização Zscan 7 para EVO',
]

function lerLista(env: string | undefined, padrao: string[]): string[] {
  if (!env) return [...padrao]
  const itens = env
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return itens.length > 0 ? itens : [...padrao]
}

/** Vendedores disponíveis para seleção no formulário. */
export function getVendedores(): string[] {
  return lerLista(process.env.VENDEDORES, VENDEDORES_PADRAO)
}

/** Tipos de processo disponíveis para seleção no formulário. */
export function getTiposProcesso(): string[] {
  return lerLista(process.env.TIPOS_PROCESSO, TIPOS_PROCESSO_PADRAO)
}
