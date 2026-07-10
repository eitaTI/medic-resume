# Melhorias-2: Estrutura de Uploads e Rota de Arquivos

Organizar o salvamento de arquivos enviados no formulário em pastas por cliente e criar uma rota autenticada para servir esses arquivos ao admin.

## Objetivo

Atualmente os arquivos são salvos em pastas planas (`data/uploads/logos/`, `data/uploads/assinaturas/`, `data/uploads/laudos/`) misturando todos os clientes. Além disso, não há rota para servir/download dos arquivos — o caminho relativo fica armazenado no banco mas não pode ser acessado pelo navegador. Esta melhoria reorganiza o salvamento por cliente e implementa uma API segura para servir os arquivos.

## Status Geral

| Componente | Status |
|-----------|--------|
| slugify helper + salvarArquivo refatorado | ✅ Concluído |
| Fluxo reordenado (criar Clinica antes) | ✅ Concluído |
| try/catch com limpeza de arquivos órfãos | ✅ Concluído |
| Rota API GET /api/uploads/[...path] | ✅ Concluído |
| Middleware atualizado | ✅ Concluído |

## Tasks

| # | Arquivo | Descrição | Prioridade | Status |
|---|---------|-----------|------------|--------|
| 1 | `task_1.md` | Adicionar `slugify` e refatorar `salvarArquivo` para estrutura hierárquica | Alta | ✅ Concluído |
| 2 | `task_2.md` | Reestruturar `submeterFormulario`: Clinica no banco antes dos arquivos | Alta | ✅ Concluído |
| 3 | `task_3.md` | try/catch com limpeza de arquivos órfãos no disco | Alta | ✅ Concluído |
| 4 | `task_4.md` | Criar rota API `GET /api/uploads/[...path]` com autenticação | Média | ✅ Concluído |
| 5 | `task_5.md` | Atualizar `middleware.ts` para proteger `/api/uploads/` | Média | ✅ Concluído |

## Dependências

Nenhuma — todas as alterações são em arquivos existentes e não requerem instalação de pacotes.

## Arquivos afetados

| Arquivo | Ação |
|---|---|
| `actions/submeter-formulario.ts` | Refatorar `salvarArquivo`, adicionar `slugify`, reordenar fluxo, adicionar try/catch + cleanup |
| `app/api/uploads/[...path]/route.ts` | **Criar** — rota GET para servir arquivos |
| `middleware.ts` | Adicionar `/api/uploads/:path*` ao matcher |

## Nova estrutura de diretórios (após implementação)

```
data/uploads/
  {clinica.id}-{slug-nome-clinica}/
    logo/
      {timestamp}-{random}.{ext}
    assinaturas/
      {timestamp}-{random}.{ext}
    laudos/
      {timestamp}-{random}.{ext}
```

## Notas

- A slug do nome da clínica é gerada com remoção de acentos, caracteres especiais, espaços → hífens, limitada a 60 caracteres
- A rota de arquivos verifica autenticação do admin (better-auth) e previne path traversal
- Em caso de erro durante o salvamento, os arquivos já salvos são limpos do disco

## Histórico de Commits

| Commit | Task | Mensagem |
|--------|------|----------|
| — | 1 | `feat(uploads): adicionar slugify e refatorar salvarArquivo para estrutura hierárquica` |
| — | 2 | `feat(uploads): reordenar submeterFormulario para criar Clinica antes dos arquivos` |
| — | 3 | `feat(uploads): adicionar try/catch com limpeza de arquivos órfãos` |
| — | 4 | `feat(api): criar rota GET /api/uploads/[...path] com autenticação` |
| — | 5 | `feat(auth): adicionar /api/uploads/:path* ao matcher do middleware` |
