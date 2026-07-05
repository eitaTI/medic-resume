# Task 1: Componente Button UI

✅ **Concluído** — `components/ui/Button.tsx`

Criar `components/ui/Button.tsx`:
- Componente `'use client'` com props `variante` (`'primario'` | `'secundario'` | `'perigo'`) e `tamanho` (`'normal'` | `'pequeno'`)
- Estilos: primario → azul, secundario → cinza, perigo → vermelho
- Tamanhos: normal → `px-4 py-2`, pequeno → `px-3 py-1 text-sm`
- Desabilitado → `opacity-50`
- Estender `React.ButtonHTMLAttributes<HTMLButtonElement>`

## Correção aplicada

Adicionado `disabled:cursor-not-allowed` — sem essa classe, o cursor não muda para "não permitido" quando o botão está desabilitado, dando a impressão de que o botão é clicável mesmo estando desabilitado.

## Commit

```
feat(ui): criar componente Button com variantes primario/secundario/perigo
```
