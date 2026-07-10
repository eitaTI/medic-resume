# Task 2: Reestruturar `submeterFormulario` — Clinica no Banco Antes dos Arquivos

✅ **Concluído**

Reordenar o fluxo de `submeterFormulario` para criar o registro `Clinica` no banco de dados (passo b) **antes** de salvar os arquivos (passos d–f), permitindo usar `clinica.id` como parte do caminho das pastas.

## O que fazer

### Fluxo atual (simplificado)

```
1. Validar dados
2. Salvar arquivos (logo, assinaturas, laudos) ← sem clinica.id ainda
3. prisma.clinica.create({ data: { ...com paths } })
```

### Novo fluxo

```
a. Validar dados (igual)
b. Criar Clinica no banco com campos básicos + Dispositivos (sem logoPath, sem Medicos, sem Exames)
c. Calcular submissionFolder = "{clinica.id}-{slugify(nomeClinica)}"
d. Salvar logo → prisma.clinica.update({ logoPath })
e. Salvar assinaturas → prisma.medico.createMany([{ ...assinaturaPath }])
f. Salvar laudos → prisma.exame.createMany([{ ...laudoPath }])
```

### 1. Criar Clinica (passo b)

```typescript
const clinica = await prisma.clinica.create({
  data: {
    ...validacao.data,
    cabecalhoLaudo,
    rodapeLaudo,
    dispositivos: {
      create: dispositivoIndices.map((i) => {
        const d = dispositivosRaw[i]
        return {
          tipo: d.tipo as string,
          marca: d.marca as string,
          modelo: d.modelo as string,
          numeroSerie: d.numeroSerie as string,
        }
      }),
    },
  },
})
```

### 2. Calcular submissionFolder (passo c)

```typescript
const submissionFolder = `${clinica.id}-${slugify(clinica.nomeClinica)}`
```

### 3. Salvar logo e atualizar Clinica (passo d)

```typescript
const logoFile = formData.get('logo') as File | null
const logoPath = await salvarArquivo(logoFile, submissionFolder, 'logo')
if (logoPath) {
  await prisma.clinica.update({
    where: { id: clinica.id },
    data: { logoPath },
  })
}
```

### 4. Salvar assinaturas e criar Medicos (passo e)

```typescript
const medicosData = await Promise.all(
  medicoIndices.map(async (i) => {
    const m = medicosRaw[i]
    const assinatura = formData.get(`medicos[${i}].assinatura`) as File | null
    const assinaturaPath = await salvarArquivo(assinatura, submissionFolder, 'assinaturas')
    return {
      clinicaId: clinica.id,
      nome: m.nome as string,
      documento: m.documento as string,
      email: m.email as string,
      tipo: (m.tipo as string) || 'examinador',
      assinaturaPath,
    }
  })
)

if (medicosData.length > 0) {
  await prisma.medico.createMany({ data: medicosData })
}
```

### 5. Salvar laudos e criar Exames (passo f)

```typescript
const examesData = await Promise.all(
  exameIndices.map(async (i) => {
    const e = examesRaw[i]
    const laudo = formData.get(`exames[${i}].laudo`) as File | null
    const laudoPath = await salvarArquivo(laudo, submissionFolder, 'laudos')
    return {
      clinicaId: clinica.id,
      nome: e.nome as string,
      laudoPath,
    }
  })
)

if (examesData.length > 0) {
  await prisma.exame.createMany({ data: examesData })
}
```

### 6. Remover código antigo

- Remover o `logoPath` do `clinica.create`
- Remover o nested `medicos.create` do `clinica.create`
- Remover o nested `exames.create` do `clinica.create`
- Manter `dispositivos.create` dentro do `clinica.create`

## Critérios de aceite

- [ ] `Clinica` é criada no banco antes de qualquer arquivo ser salvo
- [ ] `submissionFolder` usa `clinica.id` + `slugify(nomeClinica)`
- [ ] Logo salvo em `data/uploads/{submissionFolder}/logo/...`
- [ ] Assinaturas salvas em `data/uploads/{submissionFolder}/assinaturas/...`
- [ ] Laudos salvos em `data/uploads/{submissionFolder}/laudos/...`
- [ ] `createMany` usado para medicos e exames
- [ ] Dispositivos criados junto com Clinica (sem mudanças)
- [ ] Paths relativos corretos armazenados no banco
- [ ] Build passa sem erros

## Dependências

- Task 1 (slugify + salvarArquivo refatorado)

## Commit

```
feat(uploads): reordenar submeterFormulario para criar Clinica antes dos arquivos
```
