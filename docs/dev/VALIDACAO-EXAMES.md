# Validação de Exames — Bug e Sugestões

## Bug Identificado

Quando o usuário está no **Passo 4 (Equipamentos)** e clica em **Enviar Cadastro**, o `handleSubmit`
do react-hook-form revalida **todos** os campos incluindo `exames`. Se a validação falhar, o formulário
não é enviado e o erro é mapeado para o passo anterior (Passo 2 — Exames), que está **invisível**.

Resultado: o usuário não vê mensagem de erro nenhuma e o formulário simplesmente não envia.

### Fluxo atual (com bug)

```
Passo 2 → usuário preenche exame sem PDF/tópicos → clica Próximo
          → proximoPasso valida → mostra erro → OK, corrige → avança

          OU

Passo 2 → usuário preenche exame sem PDF/tópicos → clica Próximo
          → proximoPasso valida → USUÁRIO NÃO VÊ O ERRO (está em outro passo)
          → não avança → fica travado
```

```
Passo 4 → clica Enviar Cadastro
          → handleSubmit revalida TUDO包括 exames
          → se exame inválido → callback NÃO executa
          → resultado é null → nenhum erro visível
          → usuário vê apenas "Enviando..." ou nada
```

### Causa raiz

Em `app/formulario/page.tsx:259`:

```tsx
<SubmitButton onClick={handleSubmit(() => formAction())} isPending={isPending} />
```

`handleSubmit` falha silenciosamente quando a validação de passos anteriores falha.
O erro fica vinculado ao campo `exames` no react-hook-form, mas o DOM mostra os erros
apenas dentro do componente `StepExames` (Passo 2), que não está renderizado.

## Sugestão 1: Mostrar banner de erro cross-step (MVP)

Exibir um alerta no topo de **cada passo** quando houver erros em campos de outros passos.

**Arquivo:** `app/formulario/page.tsx`

```tsx
// Antes do conteúdo do passo atual, adicionar:
{passoAtual !== 2 && errors.exames && (
  <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200
    dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-400 text-sm">
    ⚠️ Existem erros na etapa de <strong>Exames</strong>.
    Volte ao Passo 2 para corrigir antes de enviar.
  </div>
)}

{passoAtual === 3 && errors.cabecalhoLaudo && (
  <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200
    dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-400 text-sm">
    ⚠️ Preencha o <strong>Cabeçalho</strong> e <strong>Rodapé do Laudo</strong> (Passo 2).
  </div>
)}

{passoAtual !== 1 && errors.usuarios && (
  <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200
    dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-400 text-sm">
    ⚠️ Existem erros na etapa de <strong>Usuários</strong>.
    Volte ao Passo 1 para corrigir antes de enviar.
  </div>
)}
```

## Sugestão 2: Auto-navegar para o passo com erro

Quando `handleSubmit` falhar, detectar qual passo contém o erro e navegar automaticamente.

**Arquivo:** `app/formulario/page.tsx`

```tsx
const handleSubmitWithErrorNav = handleSubmit(
  () => formAction(),
  (errors) => {
    if (errors.exames || errors.cabecalhoLaudo || errors.rodapeLaudo) {
      setPassoAtual(2) // Volta para Exames
    } else if (errors.usuarios) {
      setPassoAtual(1) // Volta para Usuários
    } else if (errors.nomeTitular || errors.emailTitular || errors.celularTitular
               || errors.documentoTitular || errors.cepClinica || errors.enderecoClinica) {
      setPassoAtual(0) // Volta para Clínica
    }
  }
)

// No botão:
<SubmitButton onClick={handleSubmitWithErrorNav} isPending={isPending} />
```

## Sugestão 3: Enviar `temLaudo` e `temTopicos` no FormData

Atualmente `montarFormData` não envia os booleans `temLaudo`/`temTopicos`, então o servidor
só verifica o conteúdo real (File/string). Funciona, mas é inconsistente com o schema do cliente.

**Arquivo:** `app/formulario/page.tsx` — função `montarFormData`

```tsx
examesArr.forEach((exame, i) => {
  fd.append(`exames[${i}].nome`, exame.nome)
  fd.append(`exames[${i}].temLaudo`, String(exame.temLaudo ?? false))   // ADICIONAR
  fd.append(`exames[${i}].temTopicos`, String(exame.temTopicos ?? false)) // ADICIONAR
  if (exame.topicos) fd.append(`exames[${i}].topicos`, exame.topicos)
  const laudoFile = exame.laudo
  if (laudoFile instanceof File) fd.append(`exames[${i}].laudo`, laudoFile)
})
```

## Sugestão 4: Validação server-side reforçada

No `actions/submeter-formulario.ts`, atualmente a validação server-side funciona corretamente,
mas poderia ser mais explícita usando os booleans recebidos:

```tsx
// Linha ~122-127 — atual
const temPdf = laudo instanceof File && laudo.size > 0
const temTopicos = !!topicos && topicos.length > 0
if (!temPdf && !temTopicos) {
  return { erro: 'Cada exame precisa de um laudo (PDF) ou de tópicos de conteúdo.' }
}

// Reforçado — valida também que o boolean confere com o conteúdo
const temLaudoBool = formData.get(`exames[${i}].temLaudo`) === 'true'
const temTopicosBool = formData.get(`exames[${i}].temTopicos`) === 'true'

if (temLaudoBool && !temPdf) {
  return { erro: `Exame "${examesRaw[i].nome}": marcado como PDF mas nenhum arquivo foi anexado.` }
}
if (temTopicosBool && !temTopicos) {
  return { erro: `Exame "${examesRaw[i].nome}": marcado como Tópicos mas nenhum tópico foi informado.` }
}
if (!temLaudoBool && !temTopicosBool && !temPdf && !temTopicos) {
  return { erro: `Exame "${examesRaw[i].nome}": selecione um PDF ou informe os tópicos.` }
}
```

## Sugestão 5: Validação no passo — impedir avanço sem completar

Refinamento no `proximoPasso` para garantir que o `trigger` use `shouldFocus: true`
e que os erros sejam mostrados mesmo em campos de steps anteriores:

```tsx
const proximoPasso = async () => {
  const campos = [...camposPorPasso[passoAtual]]
  if (passoAtual === 0 && getValues('possuiCnpj') === true) campos.push('cnpjEmpresa')
  const valido = await formMethods.trigger(campos, { shouldFocus: true })
  if (valido && passoAtual < 3) setPassoAtual(passoAtual + 1)
}
```

O `shouldFocus` já é o padrão do react-hook-form, mas pode ser explícito para garantir
que o scroll erre para o campo com problema.

## Prioridade sugerida

| # | Sugestão | Impacto | Esforço |
|---|----------|---------|---------|
| 2 | Auto-navegar para passo com erro | **Alto** — resolve o bug | Baixo |
| 1 | Banner cross-step | **Alto** — UX visível | Baixo |
| 4 | Validação server-side reforçada | **Médio** — mensagens específicas | Baixo |
| 3 | Enviar temLaudo/temTopicos no FormData | **Baixo** — consistência | Baixo |
| 5 | shouldFocus no trigger | **Baixo** — polish | Baixo |
