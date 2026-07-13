# Task 8: Substituir Contador Mutável por crypto.randomUUID()

✅ **Concluído**

O módulo `StepExames.tsx` usa uma variável mutável `let exameIdCounter = 0` para gerar IDs únicos. Isso pode causar problemas em Strict Mode (React 19) e em concorrência. Substituir por `crypto.randomUUID()`.

## O que fazer

### 1. Alterar `components/wizard/StepExames.tsx`

- Remover `let exameIdCounter = 0`
- Remover `interface ExameComId` (se usar React Hook Form, `useFieldArray` gerencia keys)
- Se mantiver IDs manuais, usar `crypto.randomUUID()`

### 2. Alternativa com React Hook Form

Se a task 1 já foi implementada, `useFieldArray` do React Hook Form gerencia as keys automaticamente — nesse caso, `criarExameVazio` não precisa mais gerar IDs manualmente.

### 3. Verificar outros usos

- Garantir que nenhum outro arquivo usa `exameIdCounter`
- Se houver, migrar também

## Critérios de aceite

- [ ] `let exameIdCounter` removido
- [ ] IDs gerados via `crypto.randomUUID()` ou gerenciados por `useFieldArray`
- [ ] Navegação e remoção de exames funcionando corretamente
- [ ] Build passa sem erros

## Commit

```
fix(form): substituir contador mutável por crypto.randomUUID()
```
