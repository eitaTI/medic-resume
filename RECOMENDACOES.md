# Recomendações de Melhoria - Projeto Medic Resume

Este documento lista os pontos identificados para correção, melhoria e ajuste no código do projeto Medic Resume.

## 1. Validação Redundante de CNPJ

**Local:** `actions/submeter-formulario.ts`

**Descrição:** No processo de validação do CNPJ, existe uma condição redundante que nunca será executada.

**Código atual:**
```typescript
const cnpjEmpresaRaw = formData.get('cnpjEmpresa') as string | null
const cnpjEmpresa = cnpjEmpresaRaw && cnpjEmpresaRaw.trim() !== '' ? cnpjEmpresaRaw : undefined

// Mais abaixo no código:
if (!cnpjEmpresa || cnpjEmpresa.trim() === '') {  // <-- Condição redundante
  nomeClinica = nomeTitular
}
```

**Problema:** A segunda condição `cnpjEmpresa.trim() === ''` nunca será verdadeira porque:
- Se `cnpjEmpresaRaw` for vazio ou contiver apenas espaços, `cnpjEmpresa` será `undefined`
- Se `cnpjEmpresaRaw` tiver conteúdo, `cnpjEmpresa` terá esse valor (não será uma string vazia)

**Recomendação:** Remover a condição redundante:
```typescript
if (!cnpjEmpresa) {
  nomeClinica = nomeTitular
}
```

## 2. Configuração de Host do Jira com Barra Final

**Local:** Arquivo `.env`

**Descrição:** A variável `JIRA_BASE_URL` está configurada com uma barra final, o que pode causar problemas na construção de URLs na integração com o Jira.

**Valor atual:**
```
JIRA_BASE_URL=https://zscandev.atlassian.net/
```

**Problema:** A biblioteca `jira.js` utilizada em `lib/jira.ts` provavelmente espera o host sem a barra final. Quando a barra está presente, pode resultar em URLs duplicadas como `https://zscandev.atlassian.net//rest/api/3/issue`.

**Recomendação:** Remover a barra final do valor:
```
JIRA_BASE_URL=https://zscandev.atlassian.net
```

## 3. Sobreposição de Definições de Esquema

**Local:** `lib/validacoes.ts`

**Descrição:** Existem definições de esquemas sobrepostos que podem causar confusão e manutenção difícil.

**Problema:** 
- Esquemas individuais: `schemaClinica`, `schemaMedico`, `schemaExame`, `schemaDispositivo`
- Esquema combinado `schemaFormulario` que redefine muitos dos mesmos campos

Isso cria duplicação e pode levar a inconsistências se um for atualizado e o outro não.

**Recomendação:** 
- Manter os esquemas individuais para uso específico
- No `schemaFormulario`, referenciar os esquemas individuais em vez de redefinir os campos
- Exemplo: Em vez de redefinir `nomeClinica`, usar uma referência ou composição dos esquemas existentes

## 4. Validação Potencialmente Insegura de quantidadeMedicos

**Local:** `actions/submeter-formulario.ts`

**Descrição:** A lógica de validação de `quantidadeMedicos` calcula um valor a partir dos dados do formulário, mas permite que o cliente envie um valor que pode ser menor que o real, criando uma possível brecha.

**Código relevante:**
```typescript
const medicoIndices = Object.keys(medicosRaw).map(Number).sort()
const quantidadeMedicosComputada = Math.max(
  1,
  medicosArray.filter((m) => {
    const tipo = m.tipo as string | undefined
    return !tipo || tipo === 'examinador'
  }).length
)

const quantidadeMedicosEnviada = Number(formData.get('quantidadeMedicos'))
const quantidadeMedicos =
  Number.isInteger(quantidadeMedicosEnviada) && quantidadeMedicosEnviada >= 1
    ? quantidadeMedicosEnviada
    : quantidadeMedicosComputada
```

**Problema:** Um cliente mal-intencionado poderia enviar `quantidadeMedicos: '1'` mesmo quando o formulário contém vários médicos, fazendo com que o sistema subestime a quantidade real de médicos.

**Recomendação:** 
- Ignorar completamente o valor enviado pelo cliente para `quantidadeMedicos` e sempre usar o valor calculado a partir dos dados reais do formulário
- Ou, se o valor do cliente for necessário para algum propósito, validar que ele seja maior ou igual ao valor calculado:
```typescript
const quantidadeMedicos = Math.max(
  quantidadeMedicosEnviada || 0,
  quantidadeMedicosComputada
)
```

## 5. Tratamento de Barra Final na URL do Jira

**Local:** `lib/jira.ts`

**Descrição:** Para tornar a aplicação mais robusta, o código que constrói o cliente Jira deveria tratar adequadamente barras finais na URL, independentemente da configuração no `.env`.

**Código atual em `lib/jira.ts`:**
```typescript
const client = new Version3Client({
  host: process.env.JIRA_BASE_URL,
  authentication: {
    basic: {
      email: process.env.JIRA_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN,
    },
  },
})
```

**Recomendação:** Adicionar tratamento para remover qualquer barra final antes de passar a URL para o cliente:
```typescript
// Remover barra final se existir
const jiraBaseUrl = process.env.JIRA_BASE_URL?.replace(/\/+$/, '') || ''

const client = new Version3Client({
  host: jiraBaseUrl,
  authentication: {
    basic: {
      email: process.env.JIRA_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN,
    },
  },
})
```

## Resumo das Ações Recomendadas

1. ✅ Corrigir validação redundante de CNPJ em `actions/submeter-formulario.ts`
2. ✅ Remover barra final de `JIRA_BASE_URL` no arquivo `.env`
3. 🔄 Refatorar esquemas sobrepostos em `lib/validacoes.ts` (manter esquemas individuais e referenciá-los)
4. ✅ Melhorar validação de `quantidadeMedicos` em `actions/submeter-formulario.ts` para ignorar valor do cliente ou validar adequadamente
5. 🔄 Adicionar tratamento de barra final em `lib/jira.ts` para robustez

As marcações indicam:
- ✅: Correção simples/recomendação direta
- 🔄: Requer refatoração mais cuidadosa