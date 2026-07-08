# Padrões de Git

Convenções de versionamento para o projeto Medic Resume.

## Branches

Formato: `tipo/tarefa-curta`

| Tipo | Uso | Exemplo |
|------|-----|---------|
| `feat/` | Nova funcionalidade | `feat/formulario-wizard` |
| `fix/` | Correção de bug | `fix/validacao-email` |
| `docs/` | Documentação | `docs/readme-update` |
| `refactor/` | Refatoração | `refactor/server-actions` |
| `chore/` | Configurações | `chore/docker-setup` |

## Commits

Formato: `tipo(escopo): descrição`

| Tipo | Exemplo |
|------|---------|
| `feat` | `feat(formulario): adiciona stepper do wizard` |
| `fix` | `fix(auth): corrige login com credenciais inválidas` |
| `docs` | `docs: atualiza README com instruções` |
| `refactor` | `refactor: extrai helper de validação` |
| `chore` | `chore: adiciona Dockerfile` |

Commits pequenos (uma mudança lógica cada), mensagens claras.

## Tags

Formato: `v{major}.{minor}.{patch}` — ex: `v1.0.0`, `v1.1.0`.

## Gitignore (essencial)

```
node_modules/  .next/  .env  .env.local  *.db  backups/  data/uploads/
```

## Boas Práticas

- ✅ Commits pequenos e frequentes
- ✅ Mensagens descritivas
- ❌ Commits direto na `main`
- ❌ Commits gigantes com múltiplas mudanças
- ❌ Mensagens vagas como "fix" ou "update"

## Checklist de PR

- [ ] Compila sem erros TypeScript
- [ ] Componentes na pasta correta
- [ ] Server Actions em `actions/`
- [ ] Documentação atualizada
- [ ] PR com descrição clara
