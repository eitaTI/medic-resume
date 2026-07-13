# Task 4: Variáveis de Ambiente

✅ **Pronto** — já presentes em `.env.example`

## Objetivo

Garantir que as variáveis de ambiente do Jira estejam definidas para a aplicação.

## Estado atual

O arquivo `.env.example` (raiz do projeto) **já contém** as variáveis necessárias:

```
# Jira (usado apenas na aprovação)
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=seu_token_aqui
JIRA_PROJECT_KEY=EITATI
```

## Ações

- **Nada a adicionar** ao `.env.example` — está completo.
- Apenas garantir que o arquivo `.env` local (fora do git) exista com valores reais
  para desenvolvimento/teste.
- `lib/jira.ts` (Task 1) e `actions/submissoes.ts` (Task 2) consomem exatamente estas
  chaves: `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY`.

## Nomenclatura (importante)

O esboço anterior (`fase-5/jira-ts`, já excluído) usava `JIRA_HOST`. **Não usar**
`JIRA_HOST` — o projeto adota `JIRA_BASE_URL` + `JIRA_PROJECT_KEY`, conforme acima.

## Commit

Sem commit necessário (sem alteração de código). Caso se crie `.env` local, ele deve
estar em `.gitignore` (verificar; o `.env` não deve ser versionado).
