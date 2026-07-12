# Task 5: Expandir dados da clínica no card Jira

✅ **Pronto** — expandir `lib/jira.ts` (`ClinicaParaJira` + `montarDescricao`) e caller em `actions/submissoes.ts`

## Objetivo

O card Jira criado hoje só inclui um subconjunto dos dados coletados pelo projeto:
`nomeClinica`, `nomeEmpresa`, `nomeTitular`, `emailTitular`, `quantidadeMedicos`,
`exames` (apenas `nome`) e `dispositivos`. Faltam campos coletados e relevantes para o
time de suporte. Esta task amplia a descrição ADF para replicar fielmente o que o
formulário coleta.

## Dados coletados pelo projeto (ver `prisma/schema.prisma`) que AINDA NÃO vão ao card

- `Clinica`: `celularTitular`, `documentoTitular`, `logoPath`, `cabecalhoLaudo`, `rodapeLaudo`
- `Medico[]`: `nome`, `documento`, `email`, `tipo` (hoje ignorado por completo)
- `Exame[]`: além de `nome`, o caminho do laudo `laudoPath`

## Passo 1 — `lib/jira.ts`: ampliar interface e descrição

```ts
export interface ClinicaParaJira {
  id: number
  nomeEmpresa: string | null
  nomeClinica: string
  nomeTitular: string
  emailTitular: string
  celularTitular: string | null
  documentoTitular: string | null
  quantidadeMedicos: number
  logoPath?: string | null
  cabecalhoLaudo?: string | null
  rodapeLaudo?: string | null
  medicos: { nome: string; documento: string; email: string; tipo: string }[]
  exames: { nome: string; laudoPath?: string | null }[]
  dispositivos: { tipo: string; marca: string; modelo: string; numeroSerie: string }[]
}
```

Em `montarDescricao(clinica)`, adicionar novos blocos ADF (seguindo o padrão de
`paragrafo`/`paragrafo(..., true)` já existente):

- `Celular do titular: ${clinica.celularTitular ?? '—'}`
- `Documento do titular: ${clinica.documentoTitular ?? '—'}`
- Seção `Médicos:` (negrito) listando `- {nome} | {tipo} | {documento} | {email}` para cada item.
- Para cada exame, incluir o laudo quando houver: `- {nome}${exame.laudoPath ? ' (laudo anexo)' : ''}`.
- Opcionalmente citar os caminhos de `logoPath`, `cabecalhoLaudo`/`rodapeLaudo` como
  texto (o anexo real fica a cargo da Task 6).

Manter a assinatura `criarCardJira(clinica: ClinicaParaJira): Promise<string>` e o
retorno de `issue.key`. NÃO alterar autenticação, `project.key`, `issuetype` nem `labels`
(já parametrizados via env nas correções de teste).

## Passo 2 — `actions/submissoes.ts`: incluir novos campos

Em `aprovarSubmissao` e `sincronizarJira`, ajustar o `include`/`select` ao buscar a
clínica para trazer os novos dados e passá-los a `criarCardJira`:

```ts
const clinica = await prisma.clinica.findUnique({
  where: { id },
  include: {
    medicos: { select: { nome: true, documento: true, email: true, tipo: true } },
    exames: { select: { nome: true, laudoPath: true } },
    dispositivos: { select: { tipo: true, marca: true, modelo: true, numeroSerie: true } },
  },
})
// ...
await criarCardJira({
  id: clinica.id,
  nomeEmpresa: clinica.nomeEmpresa,
  nomeClinica: clinica.nomeClinica,
  nomeTitular: clinica.nomeTitular,
  emailTitular: clinica.emailTitular,
  celularTitular: clinica.celularTitular,
  documentoTitular: clinica.documentoTitular,
  quantidadeMedicos: clinica.quantidadeMedicos,
  logoPath: clinica.logoPath,
  cabecalhoLaudo: clinica.cabecalhoLaudo,
  rodapeLaudo: clinica.rodapeLaudo,
  medicos: clinica.medicos,
  exames: clinica.exames,
  dispositivos: clinica.dispositivos,
})
```

A lógica **fail-open** e os retornos (`{ sucesso, jiraIssueKey }` /
`{ sucesso, jiraIssueKey: null, jiraErro }`) permanecem inalterados.

## Regras

- Preservar `try/catch` interno em `aprovarSubmissao` (fail-open) e o `catch` detalhado
  em `sincronizarJira` (`e instanceof Error ? e.message : 'Erro desconhecido'`).
- Usar `?? '—'` para campos nulos, evitando quebra da descrição ADF.
- Não usar `alert()` em lugar nenhum (convenção do projeto).
- Manter formatação ADF consistente com `paragrafo`/`paragrafo(..., true)` existentes.

## Commit

```
feat(jira): incluir médicos, contato do titular e laudos na descrição do card
```
