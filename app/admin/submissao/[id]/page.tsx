import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AprovarRejeitarButtons } from '@/components/admin/AprovarRejeitarButtons'

interface Props {
  params: Promise<{ id: string }>
}

const labelsTipo: Record<string, string> = {
  examinador: 'Examinador',
  solicitante: 'Solicitante',
  recepcao: 'Recepção',
}

// Helper para converter o caminho de armazenamento (data/uploads/...)
// em uma URL segura da API (/api/uploads/...)
function getSecureUrl(path: string | null) {
  if (!path) return null
  // Substitui 'data/uploads/' por 'api/uploads/' e garante que comece com '/'
  return `/${path.replace('data/uploads/', 'api/uploads/')}`
}

export default async function DetalheSubmissaoPage({ params }: Props) {
  const { id } = await params
  const clinica = await prisma.clinica.findUnique({
    where: { id: Number(id) },
    include: { medicos: true, exames: true, dispositivos: true },
  })

  if (!clinica) notFound()

  const cardClass = 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6'

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {clinica.nomeClinica}
          </h1>
          <StatusBadge status={clinica.status as 'PENDENTE' | 'APROVADA' | 'REJEITADA'} />
        </div>
        <AprovarRejeitarButtons
          clinicaId={clinica.id}
          status={clinica.status}
          jiraSyncStatus={clinica.jiraSyncStatus}
          jiraIssueKey={clinica.jiraIssueKey}
        />
      </div>

      <div className={cardClass}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Dados da Clínica
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nome da Clínica</p>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{clinica.nomeClinica}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nome do Titular</p>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{clinica.nomeTitular}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">E-mail do Titular</p>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{clinica.emailTitular}</p>
          </div>
          {clinica.celularTitular && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Celular</p>
              <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{clinica.celularTitular}</p>
            </div>
          )}
          {clinica.documentoTitular && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">CPF do Titular</p>
              <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{clinica.documentoTitular}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tipo de Cadastro</p>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">
              {clinica.cnpjEmpresa ? 'Pessoa Jurídica (CNPJ)' : 'Pessoa Física'}
            </p>
          </div>
          {clinica.cnpjEmpresa && (
            <>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">CNPJ da Empresa</p>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{clinica.cnpjEmpresa}</p>
              </div>
              {clinica.nomeEmpresa && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nome da Empresa</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{clinica.nomeEmpresa}</p>
                </div>
              )}
            </>
          )}
          {clinica.cepClinica && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">CEP</p>
              <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{clinica.cepClinica}</p>
            </div>
          )}
          {clinica.enderecoClinica && (
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Endereço</p>
              <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{clinica.enderecoClinica}</p>
            </div>
          )}
            {clinica.logoPath && (
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Logo</p>
                <Image
                  src={getSecureUrl(clinica.logoPath) || ''}
                  alt="Logo da clínica"
                  width={200}
                  height={100}
                  unoptimized
                  className="mt-1 max-h-20 w-auto object-contain"
                />
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Data de Cadastro</p>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">
              {new Date(clinica.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      {(clinica.cabecalhoLaudo || clinica.rodapeLaudo) && (
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Laudos</h2>
          <div className="space-y-3">
            {clinica.cabecalhoLaudo && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Cabeçalho do Laudo</p>
                <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{clinica.cabecalhoLaudo}</p>
              </div>
            )}
            {clinica.rodapeLaudo && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Rodapé do Laudo</p>
                <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{clinica.rodapeLaudo}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={cardClass}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Usuários ({clinica.medicos.length})
        </h2>
        {clinica.medicos.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum usuário cadastrado.</p>
        ) : (
          <div className="space-y-4">
            {clinica.medicos.map((medico) => (
              <div
                key={medico.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nome</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{medico.nome}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Documento</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{medico.documento}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">E-mail</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{medico.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tipo</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">
                      {labelsTipo[medico.tipo] || medico.tipo}
                    </p>
                  </div>
                  {medico.assinaturaPath && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Assinatura</p>
                      <a
                        href={getSecureUrl(medico.assinaturaPath) || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Visualizar assinatura
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={cardClass}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Exames ({clinica.exames.length})
        </h2>
        {clinica.exames.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum exame cadastrado.</p>
        ) : (
          <div className="space-y-3">
            {clinica.exames.map((exame) => (
              <div key={exame.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{exame.nome}</p>
                  {exame.laudoPath && (
                    <a
                      href={getSecureUrl(exame.laudoPath) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={cardClass}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Equipamentos ({clinica.dispositivos.length})
        </h2>
        {clinica.dispositivos.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum equipamento cadastrado.</p>
        ) : (
          <div className="space-y-3">
            {clinica.dispositivos.map((dispositivo) => (
              <div key={dispositivo.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tipo</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{dispositivo.tipo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Marca</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{dispositivo.marca}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Modelo</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{dispositivo.modelo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nº Série</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{dispositivo.numeroSerie}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}