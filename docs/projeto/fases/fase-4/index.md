# Fase 4: Painel Admin

Dashboard para visualização e gestão de submissões do formulário.

## Contexto atual do projeto

Após as fases 2 e 3, o projeto tem as seguintes características que impactam esta fase:

- **Wizard 4 passos**: Clínica → Usuários → Exames → Equipamentos
- **Modelo `Clinica`** com campos: `nomeClinica`, `nomeTitular`, `emailTitular`, `celularTitular?`, `documentoTitular?`, `status` (`"PENDENTE"` | `"APROVADA"` | `"REJEITADA"`), `logoPath?`, `cabecalhoLaudo?`, `rodapeLaudo?`, `createdAt`, `reviewedAt?`, `motivoRejeicao?`
- **Modelo `Medico`** com campos: `nome`, `documento`, `email`, `tipo` (`examinador` | `solicitante` | `recepcao`), `assinaturaPath?`
- **Modelo `Exame`** com campos: `nome`, `laudoPath?`
- **Modelo `Dispositivo`** com campos: `tipo`, `marca`, `modelo`, `numeroSerie`
- **Auth**: Better Auth — `auth.api.getSession({ headers: await headers() })` para verificar sessão
- **Componentes UI**: `Button` (`variante`: `primario` | `secundario` | `perigo`; `tamanho`: `normal` | `pequeno`), `Input` (`label`, `erro?`), `Select` (`label`, `opcoes`, `erro?`)
- **Estilo**: Tailwind v4 com dark mode via classe `.dark`, fundo com wallpaper (`bg-[url('/images/zscan-*-wallpaper.png')]`)
- **Middleware**: já protege `/admin/:path*` — o layout server-side reforça a verificação

## Status Geral

| Componente | Status |
|-----------|--------|
| Server Actions de submissões | ❌ Pendente |
| StatusBadge UI | ❌ Pendente |
| SubmissaoCard | ❌ Pendente |
| AprovarRejeitarButtons | ❌ Pendente |
| Layout protegido `/admin` | ❌ Pendente |
| Dashboard `/admin` | ⚠️ Placeholder existente (precisa ser refeito como Server Component) |
| Detalhe `/admin/submissao/[id]` | ❌ Pendente |

## Estrutura

```
/admin                  → Dashboard com lista + filtros (Server Component)
/admin/submissao/[id]   → Detalhe completo (clínica, usuários, exames, equipamentos)
```

## Tasks (Commits)

| # | Arquivo | Descrição | Status |
|---|---------|-----------|--------|
| 1 | `task_1.md` | Server Actions de submissões | ❌ Pendente |
| 2 | `task_2.md` | Componente StatusBadge | ❌ Pendente |
| 3 | `task_3.md` | Componente SubmissaoCard | ❌ Pendente |
| 4 | `task_4.md` | Componente AprovarRejeitarButtons | ❌ Pendente |
| 5 | `task_5.md` | Layout protegido `/admin` | ❌ Pendente |
| 6 | `task_6.md` | Dashboard `/admin` | ❌ Pendente |
| 7 | `task_7.md` | Detalhe `/admin/submissao/[id]` | ❌ Pendente |
