# Task 6: Componente StepMedicos

✅ **Concluído** — `components/wizard/StepMedicos.tsx`

Criar `components/wizard/StepMedicos.tsx`:
- Componente `'use client'` com props `medicos` (array) e `onChange`
- Interface `Medico`: `{ nome, documento, email, assinatura?: File }`
- Lista dinâmica: adicionar médico, remover médico, atualizar campos
- Cada médico: Nome, Documento (CRM/CPF), Email, Assinatura (FileUpload, accept image/*)
- Botão "+ Adicionar Médico"

## Correção aplicada

**`key={index}` → `key={medico.id}`** — usar o índice do array como key em listas dinâmicas (com adição/remoção) causa bugs de reconciliação no React. Exemplo: com 3 médicos cadastrados, remover o primeiro faz com que as keys `0,1,2` sejam reatribuídas aos médicos restantes, misturando valores dos campos de formulário entre os cards. A solução foi adicionar um campo `id` único estável (gerado por contador incremental) no lugar do índice.

**Interface `Medico` atualizada:** agora inclui o campo `id: string` obrigatório. O helper `criarMedicoVazio()` centraliza a criação de médicos com ID único.

## Commit

```
feat(wizard): criar StepMedicos com lista dinâmica de médicos
```
