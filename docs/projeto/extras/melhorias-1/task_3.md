# Task 3: Validação por Passo (Step Gating)

✅ **Concluído**

Impedir que o usuário avance para o próximo passo sem preencher corretamente os campos obrigatórios do passo atual.

## O que fazer

### 1. Criar lógica de step gating em `app/formulario/page.tsx`

- No clique de "Próximo", validar apenas os campos do passo atual com `trigger()` do React Hook Form
- Usar `schemaClinica`, `schemaMedico`, `schemaExame`, `schemaDispositivo` com `partial()` ou `pick()` para validar só os campos pertinentes

```typescript
const validarPasso = async (passo: number): Promise<boolean> => {
  const campos = {
    0: ['nomeClinica', 'nomeTitular', 'emailTitular'],
    1: [`medicos.${indiceAtual}.nome`, `medicos.${indiceAtual}.documento`, `medicos.${indiceAtual}.email`],
    // ...
  }
  return await trigger(campos[passo])
}
```

### 2. Desabilitar "Próximo" se houver erros no passo

- Opcional: usar `formState.errors` para desabilitar visualmente o botão
- Ao menos, impedir o avanço se a validação do passo falhar

### 3. Mensagem de erro amigável

- Se o usuário tentar avançar com campos inválidos, destacar os campos com erro (via task 4)
- Opcional: `scrollIntoView` no primeiro campo com erro

### 4. Validar ao clicar "Enviar Cadastro"

- No passo 4, validar todos os campos do formulário completo antes de submeter
- Usar `handleSubmit()` do React Hook Form

## Critérios de aceite

- [ ] Botão "Próximo" valida campos do passo antes de avançar
- [ ] Campos obrigatórios não preenchidos impedem avanço
- [ ] Erros visuais aparecem nos campos inválidos
- [ ] Passo 4 valida formulário completo antes de enviar
- [ ] Build passa sem erros

## Dependências

- Task 1 (React Hook Form) — pré-requisito
- Task 4 (erro inline) — recomendado para feedback visual

## Commit

```
feat(form): adicionar validação por passo no wizard
```
