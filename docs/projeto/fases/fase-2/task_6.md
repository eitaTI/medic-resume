# Task 6: Componente StepUsuarios

✅ **Concluído** — `components/wizard/StepUsuarios.tsx`

Criar `components/wizard/StepUsuarios.tsx`:
- Componente `'use client'` com React Hook Form (`useFieldArray`)
- Interface `Usuario`: `{ nome, documento, email, tipo, temAssinatura, assinatura?: File }`
- Lista dinâmica: adicionar usuário, remover usuário, atualizar campos
- Cada usuário:
  - Nome, Documento (CRM/CPF), Email
  - `tipo`: select com opções `examinador` / `solicitante` / `recepcao` (padrão: `examinador`)
  - `temAssinatura`: checkbox que revela FileUpload para imagem de assinatura
- Primeiro usuário fixo como "Médico Examinador" (tipo não editável)
- Botão "+ Adicionar Usuário" (variante secundario)

## Correção aplicada

**`key={index}` → `key={usuario.id}`** — usar o índice do array como key em listas dinâmicas (com adição/remoção) causa bugs de reconciliação no React. Foi adicionado um campo `id` único estável (gerado por `crypto.randomUUID()`) no lugar do índice.

**Interface `Usuario` atualizada:** agora inclui os campos `id: string`, `tipo: 'examinador' | 'solicitante' | 'recepcao'`, `temAssinatura: boolean`.

## Commit

```
feat(wizard): criar StepUsuarios com lista dinâmica, tipo e assinatura
```
