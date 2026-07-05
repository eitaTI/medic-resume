# Task 1: Server Actions de Submissões

❌ **Pendente** — criar `actions/submissoes.ts`

Criar `actions/submissoes.ts` (`'use server'`):
- `listarSubmissoes(filtro?)`: buscar clínicas do Prisma com filtro opcional por `status`, ordenar por `createdAt desc`, incluir `medicos`
- `detalharSubmissao(id)`: buscar clínica por ID incluindo `medicos`, `exames`, `dispositivos`
- `aprovarSubmissao(id)`: verificar sessão (`auth()`), atualizar status para `'APROVADA'`, salvar `reviewedAt`. Retornar `{ sucesso: true }`
- `rejeitarSubmissao(id, motivo)`: verificar sessão, atualizar status para `'REJEITADA'`, salvar `motivoRejeicao` e `reviewedAt`. Retornar `{ sucesso: true }`

## Commit

```
feat(admin): criar server actions de listagem, detalhe, aprovação e rejeição
```
