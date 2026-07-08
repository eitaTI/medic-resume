# Task 8: Componente StepEquipamentos

✅ **Concluído** — `components/wizard/StepEquipamentos.tsx`

Criar `components/wizard/StepEquipamentos.tsx`:
- Componente `'use client'` com React Hook Form (`useFieldArray`)
- Interface `Equipamento`: `{ tipo, marca, modelo, numeroSerie }`
- Lista dinâmica: adicionar equipamento, remover, atualizar
- Cada equipamento: Tipo (placeholder "Ex: Raio-X, Ultrassom, etc."), Marca, Modelo, Número de Série
- Botão "+ Adicionar Equipamento" (variante secundario)
- Botão "Remover" em cada equipamento (variante perigo, tamanho pequeno)

> **Nota:** O modelo Prisma ainda se chama `Dispositivo` — a UI usa "Equipamentos" como label.

## Commit

```
feat(wizard): criar StepEquipamentos com lista dinâmica de equipamentos
```
