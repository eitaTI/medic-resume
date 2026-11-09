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

/**
 * Requisitos de PC exibidos na etapa de Confirmações (genérico por empresa).
 *
 * PORQUÊ: cada empresa que clonar o repo ajusta sem deploy — basta trocar o
 * env e reiniciar. O front busca via `/api/opcoes-cadastro`; o valor aceito
 * pelo cliente viaja no JSON `confirmacoes` (sem validação de pertinência,
 * pois é texto de ciência — não select).
 */

/** Valores iniciais (usados quando o env não define). */
export const REQUISITOS_PC_PADRAO = [
  'Armazenamento em SSD (disco sólido) — HD mecânico deixa o sistema lento e pode travar',
  'Pelo menos 16 GB de memória RAM para o melhor desempenho e funcionamento do sistema',
  'Processador i5 de 13ª geração ou equivalente (ou superior)',
]

export interface ApendiceRequisito {
  id: string
  titulo: string
  resumo: string
  detalhes: string[]
}

/**
 * Apêndice técnico: o que pode ocorrer no Windows quando o PC está abaixo dos
 * requisitos mínimos/recomendados. Pesquisa: Microsoft Learn (requisitos do
 * Windows 11, minimum 1 GHz/2 núcleos/4 GB/64 GB), Microsoft Q&A e guias
 * técnicos 2025-2026 sobre disco 100%, paginação e hardware não suportado.
 */
export const APENDICE_PC_PADRAO: ApendiceRequisito[] = [
  {
    id: 'disco',
    titulo: 'Sem SSD (HD mecânico)',
    resumo: 'Disco em 100% com frequência, sistema e programas demoram a abrir, risco de congelamentos.',
    detalhes: [
      'O Windows 11 foi projetado para a latência de um SSD; em HD mecânico o "Disco 100%" no Gerenciador de Tarefas é recorrente e o PC fica quase inutilizável nos picos.',
      'Inicialização e abertura de programas ficam muito mais lentas; atualizações do Windows mantêm o disco ocupado por longos períodos.',
      'Em paginação intensa (pouca RAM), o pagefile no HD multiplica a lentidão — cada troca de programa pode levar segundos.',
      'Risco maior de travamentos e, em casos de falha do disco, perda de acesso ao sistema.',
    ],
  },
  {
    id: 'ram',
    titulo: 'Menos de 16 GB de RAM',
    resumo: 'Multitarefa limitada, uso intenso do arquivo de paginação, travamentos ao alternar programas.',
    detalhes: [
      'O Windows usa a RAM livre como cache; quando ela esgota, o sistema recorre ao arquivo de paginação no disco, que é ordens de magnitude mais lento.',
      'Sintomas típicos: alternar entre programas demora, navegador pesado, mensagens de "memória insuficiente" em cargas maiores e falhas de alocação quando a paginação cresce devagar.',
      'Com pouca RAM, o disco trabalha sem parar (thrashing), o que desgasta a experiência mesmo em SSD e inviabiliza em HD.',
      'Desabilitar ou limitar o arquivo de paginação piora: o sistema perde margem e pode falhar onde antes apenas ficava lento.',
    ],
  },
  {
    id: 'cpu',
    titulo: 'Processador abaixo do recomendado',
    resumo: 'Lentidão geral, incompatibilidade com o Windows 11 e sem garantia de atualizações de segurança.',
    detalhes: [
      'O Windows 11 exige oficialmente CPU 64 bits acima de certos patamares (Intel 8ª geração ou superior, por exemplo); processadores mais antigos ficam fora da lista de compatibilidade.',
      'Em hardware não suportado, a Microsoft informa que o PC pode não funcionar corretamente (compatibilidade e desempenho) e pode não receber atualizações — inclusive de segurança.',
      'Mesmo instalando via métodos alternativos, cada grande atualização pode exigir reinstalação limpa, sem garantia de estabilidade ou suporte.',
      'CPUs fracas alongam todo o resto: tudo que depende de processamento (abrir laudos, gerar PDFs, multitarefa) fica mais lento, independente de SSD e RAM.',
    ],
  },
]

/** Requisitos de PC (editáveis via env, um por linha separada por `;`). */
export function getRequisitosPc(): string[] {
  const raw = process.env.REQUISITOS_PC
  if (!raw) return [...REQUISITOS_PC_PADRAO]
  const itens = raw
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
  return itens.length > 0 ? itens : [...REQUISITOS_PC_PADRAO]
}
