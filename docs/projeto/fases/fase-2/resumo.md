## Análise de Complexidade — FASE 2

### Resumo

Não há dependências externas a instalar, blockers técnicos, ou integrações complexas. É código retilíneo de UI + uma server action. O maior risco é o tratamento de FormData arrays no server action, mas o spec já fornece o helper `extrairArray`.

**Complexidade geral: Baixa-Média** (estimativa ~2-4h de implementação)

### O que já está pronto
- Next.js 15 + Tailwind v4 + App Router ✅
- Prisma v7 + SQLite, modelo `Clinica` com relações `Medico`/`Exame`/`Dispositivo` já migrado ✅
- Zod `^4.4.3` instalado ✅
- `lib/prisma.ts` existente ✅

### O que precisa ser criado (11 arquivos)

| Arquivo | Linhas | Complexidade | Observações |
|---|---|---|---|
| `components/ui/Button.tsx` | ~25 | **Muito Baixa** | Só estilização |
| `components/ui/Input.tsx` | ~15 | **Muito Baixa** | Só estilização |
| `components/ui/FileUpload.tsx` | ~55 | **Baixa** | Preview + validação de tamanho |
| `components/wizard/Stepper.tsx` | ~30 | **Muito Baixa** | Renderização condicional |
| `components/wizard/StepClinica.tsx` | ~50 | **Baixa** | Formulário simples |
| `components/wizard/StepMedicos.tsx` | ~70 | **Média** | Lista dinâmica (add/remove) |
| `components/wizard/StepExames.tsx` | ~100 | **Média** | Textareas + lista dinâmica |
| `components/wizard/StepDispositivos.tsx` | ~70 | **Média** | Lista dinâmica |
| `app/formulario/page.tsx` | ~100 | **Média** | State do wizard + `useActionState` |
| `lib/validacoes.ts` | ~25 | **Muito Baixa** | Schemas Zod simples |
| `actions/submeter-formulario.ts` | ~90 | **Média-Alta** | Parse de FormData, `extrairArray`, file I/O, Prisma nested create |

### Potenciais pontos de atenção

1. **Zod v3 → v4**: A documentação foi escrita para Zod v3, mas o projeto tem Zod `^4.4.3`. A sintaxe básica (`z.string().min(1)`, `.email()`) é compatível, mas precisa validar se não há breaking changes nos métodos usados.
2. **`extrairArray` no server action**: O parsing de arrays de objetos do `FormData` (ex: `medicos[0].nome`) é a parte mais cabeluda — requer regex e iteração.
3. **Upload de arquivos**: O `salvarArquivo` escreve em `data/uploads/` — precisa garantir que o diretório existe e tem permissão.
4. **State do wizard**: O `useState` com objeto aninhado (`dados.clinica`, `dados.medicos`, etc.) é funcional mas vai crescendo — sem observações por enquanto.


