# Task 3: Componente FileUpload UI

✅ **Concluído** — `components/ui/FileUpload.tsx`

Criar `components/ui/FileUpload.tsx`:
- Componente `'use client'` com props `label`, `accept` (tipo MIME), `onFile` (callback com `File`)
- Preview de imagem se o arquivo for do tipo `image/*`
- Limite de 10MB com alerta se exceder
- Estilizar input file com botão azul personalizado
- Usar `useRef` e `useState` para preview

## Correções aplicadas

1. **`<img>` → `<Image>` do `next/image`** — o ESLint do Next.js acusa warning de performance (`@next/next/no-img-element`). Usar `<Image>` com `unoptimized` (já que é preview de arquivo local) resolve o warning e segue a convenção do framework.

2. **`htmlFor` no `<label>` e `id` no `<input>`** — mesma correção do componente Input: sem a associação, clicar no label não aciona o seletor de arquivo, o que é uma falha de acessibilidade e usabilidade.

## Commit

```
feat(ui): criar componente FileUpload com preview e limite de 10MB
```
