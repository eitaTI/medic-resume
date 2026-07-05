# Task 7: Página de Detalhe da Submissão

❌ **Pendente** — criar `app/admin/submissao/[id]/page.tsx`

Criar `app/admin/submissao/[id]/page.tsx` (Server Component):
- Buscar clínica por ID via Prisma incluindo `medicos`, `exames`, `dispositivos`
- Se não encontrar, chamar `notFound()`
- Topo: nome da clínica (bold) + `AprovarRejeitarButtons`
- Seções em cards brancos com sombra:
  - **Dados da Clínica**: grid 2 colunas (empresa, titular, email, qtd médicos) + exibir logo se tiver
  - **Laudos**: cabeçalho e rodapé se existirem
  - **Médicos**: lista com nome, documento, email por médico
  - **Exames**: lista com nome do exame + link para PDF se tiver
  - **Dispositivos**: lista com tipo, marca, modelo, número de série

## Commit

```
feat(admin): criar página de detalhe da submissão com todas as seções
```
