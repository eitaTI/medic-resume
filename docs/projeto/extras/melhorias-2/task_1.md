# Task 1: Adicionar `slugify` e Refatorar `salvarArquivo` para Estrutura Hierárquica

✅ **Concluído**

Criar função `slugify` para normalizar o nome da clínica e refatorar `salvarArquivo` para salvar arquivos em `data/uploads/{submissionFolder}/{tipo}/...`.

## O que fazer

### 1. Adicionar `slugify` em `actions/submeter-formulario.ts`

```typescript
function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')         // remove acentos
    .replace(/[^\w\s-]/g, '')                 // remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-')                     // espaços → hífens
    .replace(/-+/g, '-')                      // colapsa múltiplos hífens
    .toLowerCase()
    .slice(0, 60)                             // limite de segurança
}
```

### 2. Refatorar `salvarArquivo`

Mudar a assinatura de:
```typescript
async function salvarArquivo(file: File | null, subdir: string): Promise<string | null>
```

Para:
```typescript
async function salvarArquivo(
  file: File | null,
  submissionFolder: string,
  tipo: string
): Promise<string | null>
```

Onde:
- `submissionFolder` = `"{clinica.id}-{slugify(nomeClinica)}"` (ex: `"1-minha-clinica"`)
- `tipo` = `"logo"`, `"assinaturas"`, `"laudos"`

Novo comportamento:
```typescript
async function salvarArquivo(
  file: File | null,
  submissionFolder: string,
  tipo: string
): Promise<string | null> {
  if (!file || file.size === 0) return null

  const dir = path.join(process.cwd(), 'data', 'uploads', submissionFolder, tipo)
  await mkdir(dir, { recursive: true })

  const ext = path.extname(file.name)
  const nomeUnico = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const caminho = path.join(dir, nomeUnico)

  const bytes = await file.arrayBuffer()
  await writeFile(caminho, Buffer.from(bytes))

  return `data/uploads/${submissionFolder}/${tipo}/${nomeUnico}`
}
```

### 3. Ajustar chamadas existentes

Atualizar as 3 chamadas em `submeterFormulario` que usam `salvarArquivo`:
- `salvarArquivo(logoFile, 'logos')` → `salvarArquivo(logoFile, submissionFolder, 'logo')`
- `salvarArquivo(assinatura, 'assinaturas')` → `salvarArquivo(assinatura, submissionFolder, 'assinaturas')`
- `salvarArquivo(laudo, 'laudos')` → `salvarArquivo(laudo, submissionFolder, 'laudos')`

**Nota:** Nesta task `submissionFolder` ainda não está disponível no fluxo (a Task 2 reordena o fluxo). Basta preparar a função. As chamadas podem ser ajustadas provisoriamente com uma string fixa ou deixar para a Task 2.

## Critérios de aceite

- [ ] Função `slugify` existe em `actions/submeter-formulario.ts`
- [ ] `slugify` remove acentos, caracteres especiais, converte espaços para hífens
- [ ] `slugify` limita a 60 caracteres
- [ ] `salvarArquivo` aceita 3 parâmetros: `file`, `submissionFolder`, `tipo`
- [ ] Novo path gerado segue o padrão `data/uploads/{submissionFolder}/{tipo}/{timestamp}-{random}{ext}`
- [ ] Build passa sem erros (`pnpm build`)

## Commit

```
feat(uploads): adicionar slugify e refatorar salvarArquivo para estrutura hierárquica
```
