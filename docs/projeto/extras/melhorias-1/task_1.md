# Task 1: Migrar para React Hook Form + @hookform/resolvers

✅ **Concluído**

Substituir os 5 `useState` do formulário por um único `useForm` do React Hook Form com resolução Zod.

## O que fazer

### 1. Instalar dependências

```bash
pnpm add react-hook-form @hookform/resolvers
```

### 2. Alterar `app/formulario/page.tsx`

- Importar `useForm`, `FormProvider` de `react-hook-form`
- Importar `zodResolver` de `@hookform/resolvers/zod`
- Importar os schemas Zod de `@/lib/validacoes`
- Criar um schema unificado com `z.object()` para o formulário completo (ou manter schemas separados e usar `schema.partial()` por passo)
- Substituir os `useState` por `useForm({ resolver: zodResolver(schema), defaultValues: {...} })`
- Envolver os steps com `<FormProvider {...formMethods}>`
- Extrair `FormData` do `formMethods.getValues()` em vez de montar manualmente
- **Remover**: `dadosClinica`, `setDadosClinica`, `dadosUsuarios`, `setDadosUsuarios`, `dadosExames`, `setDadosExames`, `dadosEquipamentos`, `setDadosEquipamentos`

### 3. Alterar `components/wizard/StepClinica.tsx`

- Substituir props `dados` + `onChange` por `useFormContext()`
- Usar `register('nomeClinica')`, etc. em vez de `value` + `onChange` manual
- O `Input` deve aceitar `{...register('campo')}` para propagar `onChange`, `onBlur`, `ref`, `name`

### 4. Alterar `components/wizard/StepUsuarios.tsx`

- Usar `useFieldArray` do React Hook Form para a lista dinâmica de usuários
- Substituir `adicionarUsuario`/`removerUsuario`/`atualizarUsuario` por `append`/`remove`/`update` do `useFieldArray`

### 5. Alterar `components/wizard/StepExames.tsx`

- Usar `useFieldArray` para a lista dinâmica de exames
- `cabecalho` e `rodape` viram campos registrados com `register`

### 6. Alterar `components/wizard/StepEquipamentos.tsx`

- Usar `useFieldArray` para a lista dinâmica de equipamentos

### 7. Alterar `components/ui/Input.tsx`

- Aceitar props extras via spread (já faz isso) — garantir compatibilidade com `{...register('campo')}`
- Opcional: prop `erro?: string` (detalhado na task 4)

### 8. Alterar `actions/submeter-formulario.ts`

- Opcional: receber objeto JSON em vez de `FormData`, simplificando extração
- Se mantiver `FormData`, a construção manual permanece (task 2 pode migrar para `useActionState`)

## Critérios de aceite

- [ ] Formulário funciona sem `useState` manual
- [ ] `react-hook-form` gerencia todo o estado do formulário
- [ ] Validação client-side com Zod (erros aparecem antes do envio)
- [ ] `useFieldArray` usado para listas dinâmicas
- [ ] `criarUsuarioVazio` e `criarExameVazio` adaptados para React Hook Form
- [ ] `exameIdCounter` removido (ver task 8)
- [ ] Build passa sem erros (`pnpm build`)

## Commit

```
feat(form): migrar para React Hook Form com validação Zod
```
