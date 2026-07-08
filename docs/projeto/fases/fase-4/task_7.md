# Task 7: Página de Detalhe da Submissão

❌ **Pendente** — criar `app/admin/submissao/[id]/page.tsx`

Criar `app/admin/submissao/[id]/page.tsx` (Server Component):

- Buscar clínica por ID via `prisma.clinica.findUnique()` incluindo:
  - `medicos` (todos os campos: `id`, `nome`, `documento`, `email`, `tipo`, `assinaturaPath`)
  - `exames` (todos os campos: `id`, `nome`, `laudoPath`)
  - `dispositivos` (todos os campos: `id`, `tipo`, `marca`, `modelo`, `numeroSerie`)
- Se não encontrar, chamar `notFound()` de `next/navigation`
- **Topo da página**:
  - Nome da clínica (bold, texto grande) + `StatusBadge`
  - `AprovarRejeitarButtons` ao lado (importar de `@/components/admin/AprovarRejeitarButtons`)
  - Botão "← Voltar" linkando para `/admin`
- **Seções em cards** (padrão: `bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6`):

  1. **Dados da Clínica** (grid 2 colunas: `grid grid-cols-1 sm:grid-cols-2 gap-4`):
     - Nome da clínica
     - Nome do titular
     - Email do titular
     - Celular (se tiver)
     - Documento (se tiver)
     - Logo (se `logoPath` existir, exibir imagem)
     - Data de cadastro formatada (pt-BR)

  2. **Laudos** (se `cabecalhoLaudo` ou `rodapeLaudo` existirem):
     - Cabeçalho do laudo (texto)
     - Rodapé do laudo (texto)

  3. **Usuários** (antigo "Médicos"):
     - Lista em grid com nome, documento, email, tipo (exibido em português: Examinador / Solicitante / Recepção)
     - Se houver `assinaturaPath`, link para download/visualização da assinatura

  4. **Exames**:
     - Lista com nome do exame
     - Se houver `laudoPath`, link para download do PDF

  5. **Equipamentos** (antigo "Dispositivos"):
     - Lista com tipo, marca, modelo, número de série

- **Importante**: as labels das seções devem usar a nomenclatura atual do formulário:
  - "Usuários" (não "Médicos")
  - "Equipamentos" (não "Dispositivos")
  - O modelo Prisma ainda se chama `Medico`/`Dispositivo` — a tradução é só na UI

## Commit

```
feat(admin): criar página de detalhe da submissão com todas as seções
```
