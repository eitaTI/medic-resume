# Task 3: try/catch com Limpeza de Arquivos Órfãos

✅ **Concluído**

Adicionar tratamento de erro robusto no `submeterFormulario` para garantir que, se algo falhar durante o salvamento de arquivos ou criação de registros, os arquivos já escritos no disco sejam limpos.

## O que fazer

### 1. Envolver passos b–f em try/catch

```typescript
export async function submeterFormulario(formData: FormData) {
  try {
    // ... validação existente (passo a) ...

    // --- NOVO FLUXO (passos b-f da Task 2) ---
    let clinica
    let submissionFolder = ''

    try {
      // b. Criar Clinica no banco
      clinica = await prisma.clinica.create({
        data: {
          ...validacao.data,
          cabecalhoLaudo,
          rodapeLaudo,
          dispositivos: {
            create: dispositivoIndices.map((i) => { /* ... */ }),
          },
        },
      })

      submissionFolder = `${clinica.id}-${slugify(clinica.nomeClinica)}`

      // d. Salvar logo
      const logoFile = formData.get('logo') as File | null
      const logoPath = await salvarArquivo(logoFile, submissionFolder, 'logo')
      if (logoPath) {
        await prisma.clinica.update({
          where: { id: clinica.id },
          data: { logoPath },
        })
      }

      // e. Salvar assinaturas e criar medicos
      const medicosData = await Promise.all(/* ... */)
      if (medicosData.length > 0) {
        await prisma.medico.createMany({ data: medicosData })
      }

      // f. Salvar laudos e criar exames
      const examesData = await Promise.all(/* ... */)
      if (examesData.length > 0) {
        await prisma.exame.createMany({ data: examesData })
      }
    } catch (innerErro) {
      // Limpar arquivos do disco se algo falhou
      if (submissionFolder) {
        const uploadDir = path.join(process.cwd(), 'data', 'uploads', submissionFolder)
        await rm(uploadDir, { recursive: true, force: true }).catch(() => {})
      }
      throw innerErro // relança para o catch externo
    }

    console.log(`Submissão criada: Clinica #${clinica.id}`)
    revalidatePath('/admin')
    return { sucesso: true }
  } catch (erro) {
    console.log('Erro ao submeter formulário:', erro)
    return { erro: 'Erro interno do servidor' }
  }
}
```

### 2. Adicionar import do `rm`

```typescript
import { writeFile, mkdir, rm } from 'fs/promises'
```

### 3. Considerações sobre transação Prisma (opcional)

Para atomicidade total, os passos de banco podem ser envolvidos em `prisma.$transaction`. No entanto, como SQLite é single-writer, as operações sequenciais já são seguras. Se preferir:

```typescript
await prisma.$transaction(async (tx) => {
  // todas as operações de banco aqui
})
```

Isso garante que, se algo falhar, o banco reverte tudo automaticamente. A limpeza de arquivos no disco ainda precisa ser feita manualmente no catch.

### 4. Fluxo de erro

- Erro de validação → retorna `{ erro: "mensagem" }` (sem arquivos salvos, sem registro)
- Erro ao criar Clinica → catch externo captura, retorna `{ erro }` (sem arquivos, sem registro)
- Erro ao salvar arquivo ou criar medicos/exames → catch interno limpa pasta, relança para catch externo

## Critérios de aceite

- [ ] Bloco try/catch interno protege os passos b–f
- [ ] Se algo falha após salvar arquivos, a pasta `submissionFolder` é deletada com `rm({ recursive: true, force: true })`
- [ ] Se a Clinica foi criada mas a submissão falha, o registro fica órfão no banco (pode ser resolvido com `$transaction`)
- [ ] Import do `rm` adicionado de `fs/promises`
- [ ] Build passa sem erros

## Dependências

- Task 1 (salvarArquivo refatorado)
- Task 2 (fluxo reordenado)

## Commit

```
feat(uploads): adicionar try/catch com limpeza de arquivos órfãos
```
