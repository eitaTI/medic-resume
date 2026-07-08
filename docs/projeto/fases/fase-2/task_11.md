# Task 11: Página principal do Wizard

✅ **Concluído** — `app/formulario/page.tsx`

**Implementado:**
- Stepper com 4 labels: `['Clínica', 'Usuários', 'Exames', 'Equipamentos']`
- Etapa 0 (StepClinica) funcional com React Hook Form
- Etapa 1 (StepUsuarios) funcional com `useFieldArray`
- Etapa 2 (StepExames) funcional com campos `cabecalhoLaudo`, `rodapeLaudo` e `useFieldArray` para exames
- Etapa 3 (StepEquipamentos) funcional com `useFieldArray`
- Validação por passo: campos obrigatórios de cada etapa validados antes de avançar
- Botões "← Anterior" e "Próximo →" com navegação entre etapas
- Último passo substitui "Próximo" por "Enviar Cadastro"
- Submissão via `useActionState` com `submeterFormulario`
- Tela de sucesso após envio bem-sucedido
- Rascunho auto-salvo no localStorage (`useDraftPersistence`)

## Commit

```
feat(wizard): completar página principal com etapas e submissão via useActionState
```
