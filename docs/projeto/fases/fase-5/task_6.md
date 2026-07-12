# Task 6: Anexar imagens e PDFs reais ao card Jira

❌ **Pendente** — anexar arquivos de `data/uploads/` à issue via `jira.js`

## Objetivo

Hoje o card Jira contém apenas texto (descrição ADF). Os arquivos enviados pelo
formulário (logo, assinaturas dos médicos e laudos dos exames) ficam em
`data/uploads/<pasta>/<tipo>/<arquivo>` (caminho relativo ao `process.cwd()`, conforme
`actions/submeter-formulario.ts`) e NUNCA são anexados à issue. Esta task lê esses
arquivos do disco e os anexa via `client.issueAttachments.createAttachment`.

## Armazenamento (contexto)

- `Clinica.logoPath`: `data/uploads/<pasta>/logo/<arquivo>` (pode ser nulo).
- `Medico.assinaturaPath`: `data/uploads/<pasta>/assinaturas/<arquivo>` (pode ser nulo).
- `Exame.laudoPath`: `data/uploads/<pasta>/laudos/<arquivo>` (pode ser nulo).
- São caminhos relativos à raiz do projeto; ler com `path.join(process.cwd(), caminhoRelativo)`.

## Passo 1 — `lib/jira.ts`: nova função de anexo

Usar o `issueAttachments` do `jira.js` (mesmo `Version3Client` já instanciado em
`criarCardJira`). Exemplo de referência:

```ts
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

async function anexarArquivo(client: Version3Client, issueKey: string, caminhoRelativo: string | null | undefined) {
  if (!caminhoRelativo) return
  const abs = path.join(process.cwd(), caminhoRelativo)
  if (!existsSync(abs)) return
  const buffer = await readFile(abs)
  await client.issueAttachments.createAttachment({
    issueIdOrKey: issueKey,
    file: buffer,
  })
}
```

> Nota: o `jira.js` aceita `Buffer`/`ReadStream` em `file`. Se a versão instalada
> exigir `Blob`/`File`, envolver o buffer (`new Blob([buffer])`). Validar no teste real.

## Passo 2 — Integrar na `criarCardJira`

Após `client.issues.createIssue` retornar `issue.key`, anexar os arquivos existentes:

```ts
const issue = await client.issues.createIssue({ fields: { /* ... */ } })

await anexarArquivo(client, issue.key, clinica.logoPath)
for (const m of clinica.medicos) await anexarArquivo(client, issue.key, m.assinaturaPath)
for (const e of clinica.exames) await anexarArquivo(client, issue.key, e.laudoPath)

return issue.key
```

A interface `ClinicaParaJira` (ampliada na Task 5) já deve trazer `logoPath`,
`medicos[].assinaturaPath` e `exames[].laudoPath`. Se a Task 5 ainda não estiver
fundida, incluir esses campos aqui.

## Passo 3 — Tratamento de erro (fail-open)

Anexos são **opcionais**: uma falha ao ler/anexar um arquivo NÃO deve impedir a criação
do card nem desfazer a aprovação. Capturar erro de anexo e registrá-lo (log), mas
prosseguir e retornar `issue.key` normalmente. Ex.:

```ts
try {
  await anexarArquivo(client, issue.key, clinica.logoPath)
  // ...demais anexos
} catch (err) {
  console.error('Falha ao anexar arquivos ao card Jira:', err)
}
```

Manter o comportamento fail-open das Server Actions (a aprovação já ocorreu antes).
Erros de criação da issue continuam propagados para `aprovarSubmissao`/`sincronizarJira`.

## Regras

- Só anexar arquivos cujo caminho exista em disco (`existsSync`) — evitar erro de
  arquivo ausente.
- Não alterar resumo, `project.key`, `issuetype` nem `labels` (parametrizados via env).
- Não usar `alert()`. Falhas de anexo viram `console.error`, não quebram o fluxo.
- Respeitar LGPD: os arquivos já estão fora de `public/`; o anexo ao Jira é decisão de
  negócio esperada para a task de suporte.

## Teste real (obrigatório)

Repetir o teste real da fase (credenciais em `.env`, board `SUP`) criando uma issue com
clínica que possua logo + assinatura + laudo, e validar via `getIssue`/`getComments` que
os anexos aparecem (`issue.fields.attachment` ou endpoint de anexos).

## Commit

```
feat(jira): anexar logo, assinaturas e laudos da clínica ao card do Jira
```
