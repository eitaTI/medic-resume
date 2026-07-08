# Task 9: Esquemas de validação Zod

✅ **Concluído** — `lib/validacoes.ts` criado

Criar `lib/validacoes.ts`:
- Schema `clinica`: `nomeEmpresa` (min 1), `nomeClinica` (min 1), `nomeTitular` (min 1), `emailTitular` (email), `quantidadeMedicos` (number min 1)
- Schema `medico`: `nome` (min 1), `documento` (min 1), `email` (email)
- Schema `exame`: `nome` (min 1)
- Schema `dispositivo`: `tipo` (min 1), `marca` (min 1), `modelo` (min 1), `numeroSerie` (min 1)

## Commit

```
feat(validation): criar esquemas Zod para validação dos formulários
```
