# Task 10: Server Action de submissão

❌ **Pendente** — criar `actions/submeter-formulario.ts`

Criar `actions/submeter-formulario.ts`:
- `'use server'`
- Extrair dados do `FormData`: clínica, cabeçalhoLaudo, rodapeLaudo, médicos (array), exames (array), dispositivos (array)
- Função auxiliar `extrairArray(formData, prefix)` para extrair arrays do FormData via regex (padrão `prefixo\[indice\].campo`)
- Função auxiliar `salvarArquivo(file, subdir)` para salvar arquivos em `data/uploads/` via `fs/promises`
- Validar com schemas Zod (retornar `{ erro: mensagem }` se inválido)
- Persistir no banco via Prisma: `clinica` com `medicos`, `exames`, `dispositivos` aninhados (create)
- Definir `status: 'PENDENTE'` no registro da clínica
- Salvar logoPath na clínica, assinaturas nos médicos, laudos nos exames
- `revalidatePath('/admin')` após sucesso
- Retornar `{ sucesso: true }` ou `{ erro: 'Erro interno do servidor' }`
- Tratar erros com try/catch e log no console

## Commit

```
feat(api): criar server action submeter-formulario com validação e persistência
```
