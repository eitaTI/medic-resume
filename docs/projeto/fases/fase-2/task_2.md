# Task 2: Componente Input UI

✅ **Concluído** — `components/ui/Input.tsx`

Criar `components/ui/Input.tsx`:
- Componente `'use client'` com prop `label` (string)
- Label acima do input com `text-sm font-medium text-gray-700`
- Input com borda arredondada, foco com ring azul (`focus:ring-2 focus:ring-blue-500`)
- Estender `React.InputHTMLAttributes<HTMLInputElement>`

## Correção aplicada

Adicionado `htmlFor` no `<label>` e `id` no `<input>` (gerado via `useId()` do React) — sem essa associação, clicar no label não foca o input, violando diretrizes de acessibilidade (WCAG). O `useId()` garante IDs únicos mesmo com múltiplas instâncias do componente na mesma página.

## Commit

```
feat(ui): criar componente Input com label e estilos de foco
```
