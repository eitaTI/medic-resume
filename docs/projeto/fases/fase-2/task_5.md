# Task 5: Componente StepClinica

✅ **Concluído** — `components/wizard/StepClinica.tsx`

Criar `components/wizard/StepClinica.tsx`:
- Componente `'use client'` com React Hook Form (`useFormContext`)
- Campos:
  - `nomeClinica` (string, obrigatório)
  - `nomeTitular` (string, obrigatório)
  - `emailTitular` (email, obrigatório)
  - `celularTitular` (string, opcional, com mask)
  - `documentoTitular` (string, opcional, com mask CPF/CNPJ)
  - `logo` (FileUpload, accept image/*, opcional)
- Usar `Input` e `FileUpload` de `@/components/ui/`

> **Nota:** `nomeEmpresa` e `quantidadeMedicos` existem no schema Prisma mas **não são coletados** no formulário — `quantidadeMedicos` é computado pela quantidade de usuários cadastrados.

## Commit

```
feat(wizard): criar StepClinica com campos de dados da clínica
```
