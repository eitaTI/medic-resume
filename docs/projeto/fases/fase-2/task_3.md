# Task 3: Componente FileUpload UI

✅ **Concluído** — `components/ui/FileUpload.tsx`

Criar `components/ui/FileUpload.tsx`:
- Componente `'use client'` com props `label`, `accept` (tipo MIME), `onFile` (callback com `File`)
- Preview de imagem se o arquivo for do tipo `image/*`
- Limite de 10MB com alerta se exceder
- Estilizar input file com botão azul personalizado
- Usar `useRef` e `useState` para preview

## Commit

```
feat(ui): criar componente FileUpload com preview e limite de 10MB
```
