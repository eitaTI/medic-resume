# Task 7: Substituir window.location.reload() por Reset Controlado

✅ **Concluído**

A função `resetarFormulario()` atualmente recarrega a página inteira com `window.location.reload()`. Substituir por um reset controlado do estado do React Hook Form.

## O que fazer

### 1. Alterar `app/formulario/page.tsx`

- Usar `formMethods.reset()` do React Hook Form para zerar todos os campos
- Usar `setValue` ou reset para valores padrão
- Resetar `passoAtual` para 0
- Redirecionar visualmente para o passo 1 (passoAtual = 0)

### 2. Comportamento esperado

- Clicar "Novo Cadastro" → formulário limpo → passo 1
- Sem refresh da página
- Sem perda do tema (dark mode mantido)
- localStorage limpo se houver rascunho salvo (task 10)

### 3. Código sugerido

```typescript
function resetarFormulario() {
  formMethods.reset(defaultValues)
  setResultado(null)
  setPassoAtual(0)
  // limpar localStorage se implementado (task 10)
}
```

## Critérios de aceite

- [ ] `window.location.reload()` removido
- [ ] Reset limpa todos os campos do formulário
- [ ] Usuário retorna ao passo 1
- [ ] Tema escuro/claro preservado
- [ ] Build passa sem erros

## Dependências

- Task 1 (React Hook Form) — necessário para ter `formMethods.reset()`

## Commit

```
feat(form): resetar formulário sem recarregar a página
```
