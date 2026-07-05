# Task 7: Componente StepExames

❌ **Pendente** — criar `components/wizard/StepExames.tsx`

Criar `components/wizard/StepExames.tsx`:
- Componente `'use client'` com props `cabecalho`, `rodape`, `exames` (array), `onChange`
- Interface `Exame`: `{ nome, laudo?: File }`
- Textareas para cabeçalho e rodapé do laudo (3 linhas cada)
- Lista dinâmica de exames: adicionar, remover, atualizar
- Cada exame: Nome do Exame (Input), PDF do Laudo (FileUpload, accept .pdf)
- Botão "+ Adicionar Exame" (variante secundario)
- Botão "Remover" em cada exame (variante perigo, tamanho pequeno)

## Commit

```
feat(wizard): criar StepExames com cabeçalho/rodapé e lista dinâmica de exames
```
