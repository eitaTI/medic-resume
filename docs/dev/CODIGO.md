# Padrões de Código

Convenções de código para o projeto Medic Resume.

## Nomenclatura

| Tipo | Exemplo | Regra |
|------|---------|-------|
| Variável/função | `nomeClinica`, `listarSubmissoes` | camelCase |
| Componente | `SubmissaoCard` | PascalCase |
| Interface/Tipo | `SubmissaoCardProps`, `StatusType` | PascalCase |
| Constante | `MAX_FILE_SIZE` | UPPER_SNAKE_CASE |
| Arquivo | `submissoes.ts` | kebab-case |
| Arquivo componente | `SubmissaoCard.tsx` | PascalCase |

## Tipagem

- **Prefira interfaces explícitas** a `any`. Use `unknown` ou tipos específicos quando não souber o tipo.
- **Use Union Types** em vez de `enum`:

```typescript
type Status = 'PENDENTE' | 'APROVADA' | 'REJEITADA'
```

## Erro Padronizado

Toda Server Action retorna `{ sucesso: true; dados? }` ou `{ erro: string }`:

```typescript
if (!submissao) return { erro: 'Não encontrada' }
return { sucesso: true, dados: submissao }
```

## Imports

Use alias `@/` (nunca caminhos relativos). Ordem: externas → componentes → utils → tipos.

```typescript
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { prisma } from '@/lib/prisma'
import type { Submissao } from '@/types'
```

## Constantes do Projeto

> Ilustrativas — não existem como constantes nomeadas no codebase. O projeto usa tipos/union types inline (ex: `type Status = 'PENDENTE' | 'APROVADA' | 'REJEITADA'`).

```typescript
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ITEMS_PER_PAGE = 50
export const STATUS_CLINICA = { PENDENTE: 'PENDENTE', APROVADA: 'APROVADA', REJEITADA: 'REJEITADA' } as const
export const ACAO_AUDITORIA = { CRIAR: 'CRIAR', APROVAR: 'APROVAR', REJEITAR: 'REJEITAR', EXCLUIR: 'EXCLUIR', LOGIN: 'LOGIN' } as const
```

## Validação com Zod

Schemas Zod centralizados em `lib/validacoes.ts` (`schemaClinica`, `schemaMedico`, `schemaExame`, `schemaDispositivo`, `schemaFormulario`), importados por `actions/submeter-formulario.ts` e `app/formulario/page.tsx` e validados com `safeParse`.

## Checklist

- [ ] TypeScript sem erros
- [ ] Sem `any` desnecessário
- [ ] Tratamento de erros padronizado
- [ ] Validação com Zod
- [ ] Imports com `@/`
- [ ] Sem comentários desnecessários
