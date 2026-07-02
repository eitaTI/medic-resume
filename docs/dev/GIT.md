# Padrões de Git

Guia de versionamento com Git no projeto ZScan Formulário.

## Configuração

### Branch Principal

- `main` — Código estável e pronto para produção

### Branches de Desenvolvimento

- `develop` — Integração de funcionalidades (opcional)

## Nomenclatura de Branches

### Formato

```
tipo/tarefa-curta
```

### Tipos

| Tipo | Uso | Exemplo |
|------|-----|---------|
| `feat/` | Nova funcionalidade | `feat/formulario-wizard` |
| `fix/` | Correção de bug | `fix/validacao-email` |
| `docs/` | Documentação | `docs/readme-update` |
| `refactor/` | Refatoração | `refactor/server-actions` |
| `test/` | Testes | `test/submissao-flow` |
| `chore/` | Configurações | `chore/docker-setup` |
| `style/` | Formatação | `style/prettier-config` |

### Exemplos

```bash
git checkout -b feat/formulario-wizard
git checkout -b fix/upload-error
git checkout -b docs/api-documentation
git checkout -b refactor/prisma-queries
```

## Commits

### Formato

```
tipo(escopo): descrição

[corpo opcional]

[footer opcional]
```

### Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat(formulario): adiciona validação de email` |
| `fix` | Correção de bug | `fix(auth): corrige login com credenciais inválidas` |
| `docs` | Documentação | `docs: atualiza README com instruções de instalação` |
| `style` | Formatação (sem afetar lógica) | `style: aplica Prettier no projeto` |
| `refactor` | Refatoração | `refactor: extrai helper de validação` |
| `test` | Adição de testes | `test: adiciona teste de submissão` |
| `chore` | Configurações | `chore: adiciona Dockerfile` |
| `perf` | Melhoria de performance | `prof: otimiza queries do Prisma` |
| `ci` | Integração contínua | `ci: adiciona GitHub Actions` |

### Exemplos de Commits

```bash
# Commit simples
git commit -m "feat(formulario): adiciona stepper do wizard"

# Commit com escopo
git commit -m "feat(admin): implementa dashboard de submissões"

# Commit com corpo
git commit -m "fix(auth): corrige expire de sessão

O cookie estava expirando antes do tempo configurado.
Ajustado para usar o tempo correto do Better Auth.

Closes #42"

# Commit de-breaking change
git commit -m "feat(api)!: muda formato de retorno das actions

BREAKING CHANGE: todas as Server Actions agora retornam
{ sucesso, dados } ou { sucesso: false, erro }"
```

### Regras para Commits

1. **Commits pequenos** — Uma mudança lógica por commit
2. **Mensagens claras** — Descrever o que foi feito e por quê
3. **Não commitar** — Arquivos temporários, `.env`, `node_modules`
4. **Referenciar issues** — Usar `Closes #12` ou `Fixes #12`

## Pull Requests

### Template

```markdown
## Descrição
Breve descrição do que foi feito

## Tipo de Mudança
- [ ] Nova funcionalidade
- [ ] Correção de bug
- [ ] Refatoração
- [ ] Documentação
- [ ] Outro

## Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## Screenshots (se aplicável)
[Adicionar screenshots]

## Checklist
- [ ] Código compila sem erros
- [ ] Testes passam
- [ ] Documentação atualizada
- [ ] Sem comentários desnecessários
```

### Regras para PRs

1. **Uma feature por PR** — PRs focados e fáceis de revisar
2. **Descrição clara** — Explicar o que e por quê
3. **Referenciar issues** — Link para a issue relacionada
4. **Review obrigatório** — Pelo menos 1 aprovação antes de merge
5. **CI passando** — Todos os checks devem passar

## Fluxo de Trabalho

### Feature Branch

```bash
# 1. Criar branch
git checkout main
git pull origin main
git checkout -b feat/nova-funcionalidade

# 2. Desenvolver
git add .
git commit -m "feat: adiciona nova funcionalidade"

# 3. Push
git push origin feat/nova-funcionalidade

# 4. Criar PR no GitHub
# 5. Aguardar review e CI
# 6. Merge na main
```

### Hotfix

```bash
# 1. Criar branch de hotfix
git checkout main
git checkout -b fix/correcao-urgente

# 2. Corrigir
git add .
git commit -m "fix: corrige problema urgente"

# 3. Push e PR
git push origin fix/correcao-urgente

# 4. Merge e tag
git checkout main
git merge fix/correcao-urgente
git tag -a v1.0.1 -m "Hotfix: descrição"
```

## Tags

### Formato

```
v{major}.{minor}.{patch}
```

### Exemplos

```bash
# Versão inicial
git tag -a v1.0.0 -m "Release inicial"

# Nova feature
git tag -a v1.1.0 -m "Adiciona formulário público"

# Hotfix
git tag -a v1.1.1 -m "Corrige validação de email"
```

## Comandos Úteis

### Status e Histórico

```bash
# Ver status
git status

# Ver histórico
git log --oneline -10

# Ver diffs
git diff
git diff --staged
```

### Branches

```bash
# Listar branches
git branch
git branch -a

# Trocar de branch
git checkout main
git checkout feat/nome

# Deletar branch
git branch -d feat/nome
git push origin --delete feat/nome
```

### Stash

```bash
# Salvar mudanças temporariamente
git stash

# Recuperar mudanças
git stash pop

# Listar stashes
git stash list
```

### Undo

```bash
# Desfazer último commit (manter mudanças)
git reset --soft HEAD~1

# Desfazer último commit (descartar mudanças)
git reset --hard HEAD~1

# Desfazer mudança específica
git checkout -- arquivo.ts
```

## Arquivos Gitignore

O projeto deve ignorar:

```gitignore
# Dependências
node_modules/

# Build
.next/
out/

# Ambiente
.env
.env.local
.env.production

# Banco de dados
*.db
*.db-journal

# Backups
backups/

# Uploads (opcional - pode querer versionar)
data/uploads/

# IDE
.vscode/
.idea/

# Sistema
.DS_Store
Thumbs.db
```

## Boas Práticas

### ✅ Faça

- Commits pequenos e frequentes
- Mensagens claras e descritivas
- Referenciar issues nos commits/PRs
- Revisar código antes de merge
- Manter histórico limpo

### ❌ Não Faça

- Commits direto na `main`
- Commits gigantes com múltiplas mudanças
- Mensagens vagas como "fix" ou "update"
- Forçar push em branches compartilhadas
- Deixar branches antigas acumulando

## Checklist de PR

- [ ] Código compila sem erros TypeScript
- [ ] Testes passam
- [ ] Não há warnings no console
- [ ] Componentes estão na pasta correta
- [ ] Server Actions estão em `actions/`
- [ ] Código está formatado
- [ ] Não há comentários desnecessários
- [ ] Documentação atualizada (se necessário)
- [ ] PR tem descrição clara
- [ ] Pelo menos 1 review aprovado
