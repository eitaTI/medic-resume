# Task 11: Página principal do Wizard

⚠️ **Parcial** — `app/formulario/page.tsx` existe mas incompleto

**Já implementado:**
- Stepper com 4 labels
- Etapa 0 (StepClinica) funcional com state `dadosClinica`
- Etapa 1 (StepMedicos) funcional com state `dadosMedicos`
- Botões "Anterior" e "Próximo" com navegação

**O que falta fazer:**

Substituir o placeholder das etapas 2 e 3 pela implementação real:
- Importar `StepExames` e `StepDispositivos`
- Adicionar states: `dadosExames`, `dadosDispositivos`, `cabecalhoLaudo`, `rodapeLaudo`
- Renderizar `StepExames` no passo 2 e `StepDispositivos` no passo 3

Substituir a navegação por submissão no último passo:
- Importar `useActionState` de `react`
- Importar `submeterFormulario` de `@/actions/submeter-formulario`
- Criar state com `useActionState(submeterFormulario, null)`
- No passo 3, substituir botão "Próximo" por formulário com botão "Enviar Formulário"
- Botão de envio desabilitado enquanto `pending`
- Exibir mensagem de sucesso (verde) ou erro (vermelho) baseada no state retornado

## Commit

```
feat(wizard): completar página principal com etapas 2-3 e submissão via useActionState
```
