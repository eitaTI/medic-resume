# Task 11: Página principal do Wizard

✅ **Concluído** — `app/formulario/page.tsx` completo com 4 etapas e submissão

**Implementado:**
- Stepper com 4 labels
- Etapa 0 (StepClinica) funcional com state `dadosClinica`
- Etapa 1 (StepMedicos) funcional com state `dadosMedicos`
- Etapa 2 (StepExames) funcional com states `cabecalhoLaudo`, `rodapeLaudo`, `dadosExames`
- Etapa 3 (StepDispositivos) funcional com state `dadosDispositivos`
- Botões "Anterior" e "Próximo" com navegação entre etapas
- Último passo substitui "Próximo" por "Enviar Formulário"
- Submissão via `useActionState` com `submeterFormulario`
- Montagem programática de FormData a partir dos states
- Botão de envio desabilitado enquanto `pending`
- Mensagem de sucesso (verde) ou erro (vermelho) baseada no state retornado

## Commit

```
feat(wizard): completar página principal com etapas 2-3 e submissão via useActionState
```
